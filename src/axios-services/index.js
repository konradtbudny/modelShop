import axios from "axios";
const baseURL = "http://localhost:4000/api";

export async function getAPIHealth() {
  try {
    const { data } = await axios.get(`${baseURL}/health`);
    return data;
  } catch (err) {
    console.error(err);
    return { healthy: false };
  }
}

export async function registerUser(firstName, lastName, password, email, contactNumber) {
  try {
    const response = await fetch(`${baseURL}/user/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, password, email, contactNumber })
    });
    const data = await response.json();
    localStorage.setItem("token",data.token);
    localStorage.setItem("email",data.user.email);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${baseURL}/user/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    localStorage.setItem("email",data.user.email);
    localStorage.setItem("token",data.token);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMe(email) {
  try {
    const response = await fetch(`${baseURL}/user/me/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.token}` },
      body: JSON.stringify({ email })
    });
    const data = response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getItems() {
  try {
    const response = await fetch(`${baseURL}/item/`, { method: 'GET' });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getItemById(id) {
  try {
    const response = await fetch(`${baseURL}/item/${id}`, { method: 'GET' });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getOrder(id) {
  try {
    const response = await fetch(`${baseURL}/order/${id}`, { method: 'GET' });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderItem(id) {
  try {
    const response = await fetch(`${baseURL}/orderItem/${id}`, { method: 'GET' });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addOrderItem(orderId, itemId, price, quantity) {
  try {
    const response = await fetch(`${baseURL}/orderItem/addOrder`, {
      method: 'POST',
      headers: { "Content-Type": "applicaiton/json" },
      body: JSON.stringify({ orderId, itemId, price, quantity })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateOrderItem(id, price, quantity) {
  try {
    const response = await fetch(`${baseURL}/orderItem/${id}/update`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price, quantity })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteOrderItem(id) {
  try {
    const response = await fetch(`${baseURL}/orderItem/${id}/delete`, { method: 'DELETE' });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}