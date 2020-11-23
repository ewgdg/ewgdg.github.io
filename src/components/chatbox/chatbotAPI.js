import _axios from "axios"

const baseURL = "https://qa-chatbot-wdwgobgfwq-nn.a.run.app"
const axios = _axios.create({
  baseURL,
  timeout: 20000,
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
    reply = "error!"
  }
  return reply
}

async function requestReply(message) {
  let resp
  try {
    resp = await axios.get(`/qa/${encodeURIComponent(message)}`)
  } catch (e) {
    return "error!"
  }
  const {
    data: {
      results: { answers },
    },
  } = resp

  if (!answers || answers.length <= 0) {
    return "I don't know."
  }

  let reply = null
  // eslint-disable-next-line no-restricted-syntax
  for (const answer of answers) {
    // validate answer
    if (answer.answer && answer.probability >= 0.5) {
      if (reply === null) {
        reply = answer.answer
      } else {
        reply += `; ${answer.answer}`
      }
    }

    if (answer.probability >= 0.9) {
      break
    }
  }
  if (reply === null) {
    reply = "I don't know."
  }
  return reply
}

export { sayHi, requestReply }
