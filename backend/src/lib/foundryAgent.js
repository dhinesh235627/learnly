import { DefaultAzureCredential } from "@azure/identity"
import { AIProjectClient } from "@azure/ai-projects"

let projectClient
const clientsByAgent = new Map()

/** Lazily creates (and caches) an OpenAI client bound to the given Foundry agent. */
export function getAgentClient(agentName) {
  if (!clientsByAgent.has(agentName)) {
    if (!projectClient) {
      const endpoint = process.env.FOUNDRY_PROJECT_ENDPOINT
      if (!endpoint) throw new Error("FOUNDRY_PROJECT_ENDPOINT is not configured")
      projectClient = new AIProjectClient(endpoint, new DefaultAzureCredential())
    }
    clientsByAgent.set(agentName, projectClient.getOpenAIClient({ azureConfig: { allowPreview: true, agentName } }))
  }
  return clientsByAgent.get(agentName)
}
