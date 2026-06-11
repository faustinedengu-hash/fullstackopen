
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