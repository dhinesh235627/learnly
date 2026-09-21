// Reserved for real chatbot backend integration (see backend/src/functions/chat.js).
// The widget is currently static — quick replies use canned responses from
// data/chatOptions.ts and never call this. Wire it in once there's a real
// chat backend to talk to.
export async function sendMessage(_text: string): Promise<string> {
  throw new Error("chatApi.sendMessage is not implemented yet")
}
