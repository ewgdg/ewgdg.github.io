/* eslint-disable no-restricted-syntax */
import _axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_CHATBOT_URL
const axios = _axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: false,
})

async function checkHealth() {
  let resp
  try {
    resp = await axios.get("/health", { timeout: 5000 })
  } catch (e) {
    return false
  }
  const {
    data: { status },
  } = resp
  return status === "ok"
}

async function requestReply(messages) {
  let resp
  try {
    resp = await axios.post("/chat", {
      messages: messages,
      conversation_id: null
    })
  } catch (e) {
    return { response: "Error!", type: "error" }
  }

  const { data } = resp

  if (!data || !data.response) {
    return {
      response: "I'm having trouble generating a response right now. Please try again.", type: "error"
    }
  }

  return { response: data.response, type: data.type || "agent" }
}

export { checkHealth, requestReply }
