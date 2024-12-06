import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3333/", // backend url
});

// interceptor to handle 401 errors (unauthorized) globally
API.interceptors.response.use(
  (response) => response, // Return the response if successful
  (error) => {
    if (error.response?.status === 401) {
      // if unauthorized, redirect to login
      window.location.href = "/signin";
    }
    return Promise.reject(error); // reject other errors
  }
);

export default API;
