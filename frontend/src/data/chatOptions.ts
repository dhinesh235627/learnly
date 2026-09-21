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
