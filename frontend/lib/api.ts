import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3333/", // backend url
});

export default API;
