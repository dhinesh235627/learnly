export type ChatOption = {
  id: string
  label: string
  reply: string
}

export const CHAT_WELCOME = "Welcome 👋"
export const CHAT_SUBTITLE = "How can we help you today?"

export const CHAT_OPTIONS: ChatOption[] = [
  {
    id: "browse-courses",
    label: "I want to browse courses",
    reply: "You can explore every Azure, AWS, Google Cloud, and SAP course from the homepage — head to \"My learning\" to get started.",
  },
  {
    id: "course-help",
    label: "I need help with a course",
    reply: "Sorry to hear you're stuck! Drop your question in the Q&A tab on the lecture, or email support@learnly.example and we'll follow up.",
  },
  {
    id: "billing",
    label: "I have a billing question",
    reply: "For billing and refund questions, email support@learnly.example with your order details and we'll get back to you shortly.",
  },
]

export const CHAT_DISCLAIMER = "Your chat conversation may be recorded for quality purposes."

const FALLBACK_REPLY =
  "Thanks for the message! This is just a prototype for now, so I can only help with a few topics — try asking about courses, a specific course, or billing — or email support@learnly.example and a real person will follow up."

// "help" is deliberately excluded from course-help — it's too generic and
// shows up in unrelated requests ("can you help with my refund?"), so it
// would win almost every match regardless of actual topic.
const TOPIC_KEYWORDS: Record<string, string[]> = {
  "browse-courses": ["course", "courses", "browse", "catalog", "azure", "aws", "sap", "gcp", "cloud", "certif", "learn"],
  "course-help": ["stuck", "video", "lecture", "question", "bug", "broken", "issue", "problem", "confus", "not working"],
  billing: ["bill", "refund", "payment", "paid", "price", "pricing", "charge", "invoice", "subscription", "cost", "money"],
}

/** Shallow prototype matcher — scores keyword overlap per topic, no real NLP/backend. */
export function matchReply(input: string): string {
  const lower = input.toLowerCase()
  let bestId: string | null = null
  let bestScore = 0

  for (const [id, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      bestId = id
    }
  }

  const option = bestId ? CHAT_OPTIONS.find((o) => o.id === bestId) : undefined
  return option?.reply ?? FALLBACK_REPLY
}
