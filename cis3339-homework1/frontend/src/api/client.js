// One place for all HTTP calls to the Express API.
// Throws an Error with the server's message when something goes wrong.
async function request(path, { method = 'GET', body } = {}) {
  const options = { method, headers: {} }

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`/api${path}`, options)
  } catch {
    // fetch itself fails only when the server can't be reached at all
    throw new Error('Cannot reach the server. Is it running?')
  }

  // Read the JSON body (if any); don't crash if there isn't one
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // Use the message from our Express error handler, e.g. "A student with that ID already exists"
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}