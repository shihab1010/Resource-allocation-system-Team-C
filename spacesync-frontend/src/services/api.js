import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Resources
export const getResources = () => API.get("/resources");
export const createResource = (data) => API.post("/resources", data);

// Bookings
export const createBooking = (data) => API.post("/bookings", data);
export const getBookings = () => API.get("/bookings");
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);