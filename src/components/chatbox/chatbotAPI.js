/* eslint-disable no-restricted-syntax */
import _axios from "axios"

const baseURL = "https://qa-chatbot.xianzzz.com/"
const axios = _axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: false,
})

async function sayHi() {
  let resp
  try {
    resp = await axios.get("/hi")
  } catch (e) {
    // console.error(e)
    resp = { data: { status: "error" } }
  }
  let reply
  const {
    data: { status },
  } = resp
  if (status === "ok") {
    reply = "Hi!"
  } else {
    reply = "Service not available."
  }
  return reply
}

async function requestReply(message) {
  let resp
  try {
    resp = await axios.get(`/qa/${encodeURIComponent(message)}`)
  } catch (e) {
    return "Error!"
  }
  const {
    data: {
      results: { answers },
    },
  } = resp

  const noreply = "I don't understand."

  if (!answers || answers.length <= 0) {
    return noreply
  }

  let reply = null
  let maxProb = null
  // const answerSet = new Set()

  for (const answer of answers) {
    if (
      answer.probability >= 0.67 &&
      (!maxProb || answer.probability > maxProb)
    ) {
      maxProb = answer.probability
      reply = answer.answer
    }
  }

  if (reply === null) {
    reply = noreply
  }
  return reply
}

export { sayHi, requestReply }
