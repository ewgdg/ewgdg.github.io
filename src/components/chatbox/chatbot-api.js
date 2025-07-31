/* eslint-disable no-restricted-syntax */
import _axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_CHATBOT_URL
const axios = _axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: false,
})

async function sayHi() {
  let resp
  try {
    resp = await axios.get("/health", { timeout: 1500 })
  } catch (e) {
    // console.error(e)
    resp = { data: { status: "error" } }
  }
  let reply = ""
  const {
    data: { status },
  } = resp
  if (status === "ok") {
    // reply = "Hi!"
  } else {
    reply = "Service not available."
  }
  return reply
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
    return { response: "I don't understand.", type: "error" }
  }

  return { response: data.response, type: data.type || "agent" }
}

export { sayHi, requestReply }
