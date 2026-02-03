import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getTodos = () => axios.get(API_URL, getAuthHeader());

export const createTodo = (title) =>
  axios.post(API_URL, { title }, getAuthHeader());

export const toggleTodo = (id) =>
  axios.put(`${API_URL}/${id}`, {}, getAuthHeader());

export const deleteTodo = (id) =>
  axios.delete(`${API_URL}/${id}`, getAuthHeader());
