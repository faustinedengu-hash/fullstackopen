// Centralized server-side data management service

export const getLiveTopics = async () => {
  const res = await fetch("http://localhost:3000/api/topics", {
    cache: "no-store"
  })
  
  if (!res.ok) {
    throw new Error("Failed to extract active topics data from backend endpoint")
  }
  
  return res.json()
}

export const getSingleTopic = async (id) => {
  const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
    cache: "no-store"
  })
  if (!res.ok) return null
  return res.json()
}

export const createLiveTopic = async (title) => {
  const res = await fetch("http://localhost:3000/api/topics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  })

  if (!res.ok) {
    throw new Error("Failed to persist new topic payload over backend network")
  }

  return res.json()
}