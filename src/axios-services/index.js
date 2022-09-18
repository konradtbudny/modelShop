import axios from "axios";
const baseURL = "http://localhost:4000/api"

/* 
  export async function getUsers() {
    try {
      const { data: users } = await axios.get('/api/users')
      return users;
    } catch(err) {
      console.error(err)
    }
  }
*/

export async function getAPIHealth() {
  try {
    const { data } = await axios.get(`${baseURL}/health`);
    return data;
  } catch (err) {
    console.error(err);
    return { healthy: false };
  }
}