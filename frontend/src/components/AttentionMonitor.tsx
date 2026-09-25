import * as cocoSsd from "@tensorflow-models/coco-ssd"
import * as tf from "@tensorflow/tfjs"
import { useEffect, useRef, useState } from "react"
// Vendored (see src/vendor/human.esm-nobundle.js) instead of imported from
// @vladmandic/human directly — same reasoning as the source prototype: it
// reuses this app's own @tensorflow/tfjs instance instead of bundling a
// second internal copy, sidestepping a package.json "exports" bug in the
// published package that makes the nobundle build otherwise unresolvable.
import Human from "../vendor/human.esm-nobundle.js"
import {
  areEyesClosed,
  DISTRACTING_OBJECT_CLASSES,
  getEyeAspectRatio,
  getGazeOffset,
  hasDrifted,
  objectConfidenceThreshold,
} from "../lib/attention"
import type { AttentionStatus } from "../lib/attentionStatus"

const humanConfig = {
  modelBasePath: "/models/human/",
  backend: "webgl" as const,
  debug: false,
  face: {
    enabled: true,
    detector: { rotation: true, maxDetected: 5 },
    mesh: { enabled: true },
    iris: { enabled: true },
    description: { enabled: false },
    emotion: { enabled: false },
    antispoof: { enabled: false },
    liveness: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
}

const STATUS_TEXT: Record<AttentionStatus, string> = {
  idle: "Not started",
  loading: "Loading…",
  calibrating: "Calibrating — look at the screen normally",
  engaged: "Engaged",
  "no-face": "No face detected",
  "multiple-faces": "More than one person in frame",
  "looking-away": "Head turned away",
  "gaze-away": "Eyes looking away",
  "eyes-closed": "Eyes closed",
  "object-detected": "Phone/book detected",
  error: "Camera or model error",
}

const CALIBRATION_SAMPLES_NEEDED = 10
const CALIBRATION_WARMUP_CYCLES = 8
const CALIBRATION_MAX_RESTARTS = 5
const YAW_SMOOTHING_WINDOW = 3
const GAZE_SMOOTHING_WINDOW = 1
const STATUS_WINDOW = 3
const BOOLEAN_WINDOW = 3

function smoothed(history: number[], value: number, window: number): number {
  history.push(value)
  if (history.length > window) history.shift()
  return history.reduce((a, b) => a + b, 0) / history.length
}

export default function AttentionMonitor({ onStatus }: { onStatus?: (status: AttentionStatus) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const loopActiveRef = useRef(false)
  const objectModelRef = useRef<cocoSsd.ObjectDetection | null>(null)
  const humanRef = useRef<InstanceType<typeof Human> | null>(null)
  const startingRef = useRef(false)
  const cancelStartRef = useRef(false)

  const statusWindowRef = useRef<AttentionStatus[]>([])
  const lastCommittedStatusRef = useRef<AttentionStatus>("idle")
  const headAwayWindowRef = useRef<boolean[]>([])
  const gazeAwayWindowRef = useRef<boolean[]>([])
  const eyesClosedWindowRef = useRef<boolean[]>([])

  const warmupCyclesRemainingRef = useRef(CALIBRATION_WARMUP_CYCLES)
  const calibrationSamplesRef = useRef<{ yaw: number[]; gazeStrength: number[]; ear: number[] }>({
    yaw: [],
    gazeStrength: [],
    ear: [],
  })
  const baselineRef = useRef<{ yaw: number; gazeStrength: number; ear: number } | null>(null)
  const calibrationRestartsRef = useRef(0)
  const yawHistoryRef = useRef<number[]>([])
  const earHistoryRef = useRef<number[]>([])
  const gazeStrengthHistoryRef = useRef<number[]>([])

  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState<AttentionStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onStatusRef = useRef(onStatus)
  onStatusRef.current = onStatus

  useEffect(() => {
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadModels(): Promise<boolean> {
    await tf.ready()
    if (cancelStartRef.current) return false
    if (!humanRef.current) humanRef.current = new Human(humanConfig)
    await humanRef.current.load()
    if (cancelStartRef.current) return false
    await humanRef.current.warmup()
    if (cancelStartRef.current) return false
    if (!objectModelRef.current) {
      objectModelRef.current = await cocoSsd.load({ base: "lite_mobilenet_v2" })
    }
    return !cancelStartRef.current
  }

  function resetTracking() {
    calibrationSamplesRef.current = { yaw: [], gazeStrength: [], ear: [] }
    baselineRef.current = null
    yawHistoryRef.current = []
    earHistoryRef.current = []
    gazeStrengthHistoryRef.current = []
    calibrationRestartsRef.current = 0
    headAwayWindowRef.current = []
    gazeAwayWindowRef.current = []
    eyesClosedWindowRef.current = []
  }

  async function start() {
    if (startingRef.current || running) return
    startingRef.current = true
    cancelStartRef.current = false
    setErrorMessage(null)
    setStatus("loading")
    try {
      if (!(await loadModels())) return setStatus("idle")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      if (cancelStartRef.current) {
        stream.getTracks().forEach((t) => t.stop())
        return setStatus("idle")
      }
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setRunning(true)
      statusWindowRef.current = []
      warmupCyclesRemainingRef.current = CALIBRATION_WARMUP_CYCLES
      resetTracking()
      loopActiveRef.current = true
      runDetection()
    } catch (err) {
      console.error(err)
      setErrorMessage(err instanceof Error ? err.message : "Could not start camera")
      setStatus("error")
    } finally {
      startingRef.current = false
    }
  }

  function stop() {
    if (startingRef.current) {
      cancelStartRef.current = true
      return
    }
    loopActiveRef.current = false
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setRunning(false)
    setStatus("idle")
    statusWindowRef.current = []
    resetTracking()
    warmupCyclesRemainingRef.current = CALIBRATION_WARMUP_CYCLES
  }

  function commitStatus(next: AttentionStatus): AttentionStatus {
    const window = statusWindowRef.current
    window.push(next)
    if (window.length > STATUS_WINDOW) window.shift()

    const counts = new Map<AttentionStatus, number>()
    for (const s of window) counts.set(s, (counts.get(s) ?? 0) + 1)
    let winner: AttentionStatus | null = null
    let winnerCount = 0
    for (const [s, c] of counts) {
      if (c > winnerCount) {
        winner = s
        winnerCount = c
      }
    }
    if (winner && winnerCount >= 2) {
      setStatus(winner)
      onStatusRef.current?.(winner)
      lastCommittedStatusRef.current = winner
    }
    return lastCommittedStatusRef.current
  }

  function commitBoolean(windowRef: { current: boolean[] }, value: boolean): boolean {
    const window = windowRef.current
    window.push(value)
    if (window.length > BOOLEAN_WINDOW) window.shift()
    const trueCount = window.filter(Boolean).length
    return trueCount * 2 > window.length
  }

  async function runDetection() {
    if (!loopActiveRef.current) return
    try {
      await runDetectionInner()
    } catch (err) {
      console.error("detection loop error", err)
      setErrorMessage(err instanceof Error ? err.message : String(err))
      setStatus("error")
      loopActiveRef.current = false
      return
    }
    if (loopActiveRef.current) setTimeout(() => runDetection(), 0)
  }

  async function runDetectionInner() {
    const video = videoRef.current
    if (!video || video.readyState < 2) return

    const result = humanRef.current ? await humanRef.current.detect(video) : null
    const faces = result?.face ?? []

    let objectHit: string | null = null
    let personPresent = false
    if (objectModelRef.current) {
      const predictions = await objectModelRef.current.detect(video)
      personPresent = predictions.some((p) => p.class === "person" && p.score > 0.5)
      const hits = predictions.filter(
        (p) => DISTRACTING_OBJECT_CLASSES.has(p.class) && p.score > objectConfidenceThreshold(p.class),
      )
      if (hits.length > 0) objectHit = hits[0].class
    }

    if (faces.length === 0) {
      resetTracking()
      commitStatus(personPresent ? "looking-away" : "no-face")
    } else if (faces.length > 1) {
      resetTracking()
      commitStatus("multiple-faces")
    } else {
      const face = faces[0]
      const rawYaw = face.rotation?.angle.yaw ?? 0
      const mesh = face.meshRaw && face.meshRaw.length >= 478 ? face.meshRaw : face.mesh
      const rawGazeStrength = getGazeOffset(mesh)

      const yawOffset = smoothed(yawHistoryRef.current, rawYaw, YAW_SMOOTHING_WINDOW)
      const ear = smoothed(earHistoryRef.current, getEyeAspectRatio(mesh), GAZE_SMOOTHING_WINDOW)
      const gazeStrength = smoothed(gazeStrengthHistoryRef.current, rawGazeStrength, GAZE_SMOOTHING_WINDOW)

      if (warmupCyclesRemainingRef.current > 0) {
        warmupCyclesRemainingRef.current -= 1
        commitStatus("calibrating")
        return
      }

      if (!baselineRef.current) {
        const samples = calibrationSamplesRef.current
        samples.yaw.push(yawOffset)
        samples.ear.push(ear)
        samples.gazeStrength.push(gazeStrength)

        if (samples.yaw.length < CALIBRATION_SAMPLES_NEEDED) {
          commitStatus("calibrating")
          return
        }

        const spread = (arr: number[]) => Math.max(...arr) - Math.min(...arr)
        const MAX_YAW_SPREAD = 0.15
        if (spread(samples.yaw) > MAX_YAW_SPREAD && calibrationRestartsRef.current < CALIBRATION_MAX_RESTARTS) {
          calibrationRestartsRef.current += 1
          calibrationSamplesRef.current = { yaw: [], ear: [], gazeStrength: [] }
          commitStatus("calibrating")
          return
        }
        calibrationRestartsRef.current = 0
        const median = (arr: number[]) => {
          const sorted = [...arr].sort((a, b) => a - b)
          const mid = Math.floor(sorted.length / 2)
          return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
        }
        baselineRef.current = {
          yaw: median(samples.yaw),
          ear: median(samples.ear),
          gazeStrength: median(samples.gazeStrength),
        }
      }

      const baseline = baselineRef.current
      const headAway = hasDrifted(yawOffset, baseline.yaw, 0.26)
      const eyesClosed = areEyesClosed(ear, baseline.ear)
      const gazeAway = hasDrifted(gazeStrength, baseline.gazeStrength, 0.13)

      commitBoolean(headAwayWindowRef, headAway)
      commitBoolean(gazeAwayWindowRef, gazeAway)
      commitBoolean(eyesClosedWindowRef, eyesClosed)

      const rawStatus: AttentionStatus = objectHit
        ? "object-detected"
        : headAway
          ? "looking-away"
          : eyesClosed
            ? "eyes-closed"
            : gazeAway
              ? "gaze-away"
              : "engaged"
      commitStatus(rawStatus)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2">
      <div className="relative h-11 w-16 flex-none overflow-hidden rounded-md bg-black">
        <video
          ref={videoRef}
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{ transform: "scaleX(-1)", display: running ? "block" : "none" }}
        />
        {!running && <span className="flex h-full w-full items-center justify-center text-[16px]">📷</span>}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold text-ink">Attention check</p>
        <p className="truncate text-[11.5px] text-ink-faint">
          {running ? STATUS_TEXT[status] : "Off — runs only in your browser, nothing is uploaded"}
        </p>
        {errorMessage && <p className="truncate text-[11px] text-red-600">{errorMessage}</p>}
      </div>

      <button
        type="button"
        onClick={running ? stop : start}
        disabled={status === "loading"}
        className={
          "flex-none rounded-md px-3 py-1.5 text-[12px] font-semibold transition disabled:opacity-50 " +
          (running ? "border border-line text-ink hover:bg-surface" : "bg-brand text-white hover:bg-brand-dark")
        }
      >
        {status === "loading" ? "Loading…" : running ? "Stop" : "Turn on"}
      </button>
    </div>
  )
}
