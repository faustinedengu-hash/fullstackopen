import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// This function updates our private token variable
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// This sends the POST request with the Authorization header
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, create, setToken }