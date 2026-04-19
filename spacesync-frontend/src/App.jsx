import { useState, useEffect } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export default function App() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    resource_id: "",
    requested_by: "",
    booking_date: "",
  });

  const [loading, setLoading] = useState(false);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchResources();
    fetchBookings();

    // 🔥 FIX: auto refresh bookings so "denied" shows instantly
    const interval = setInterval(() => {
      fetchBookings();
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchResources = async () => {
    try {
      const res = await API.get("/resources");
      setResources(res.data);
    } catch (err) {
      console.log("Failed to fetch resources");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.log("Failed to fetch bookings");
    }
  };

  // ---------------- FORM HANDLER ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- BOOKING ----------------
  const handleBook = async (e) => {
    e.preventDefault();

    if (!form.resource_id || !form.requested_by || !form.booking_date) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/bookings", form);

      alert(res.data.message || "Booking created");

      await fetchBookings(); // refresh immediately

      setForm({
        resource_id: "",
        requested_by: "",
        booking_date: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE BOOKING ----------------
  const handleDelete = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  // ---------------- RESOURCE NAME ----------------
  const getResourceName = (id) => {
    return resources.find((r) => r.id === id)?.name || "Unknown";
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>SpaceSync</h2>
        <p className="tag">Resource System</p>

        <div className="menu">
          <p>📊 Dashboard</p>
          <p>📦 Resources</p>
          <p>📅 Bookings</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <h1>Dashboard</h1>
          <p>Manage resources and bookings</p>
        </div>

        {/* GRID */}
        <div className="grid">
          {/* FORM */}
          <div className="card">
            <h3>Create Booking</h3>

            <form onSubmit={handleBook}>
              <select
                name="resource_id"
                value={form.resource_id}
                onChange={handleChange}
              >
                <option value="">Select Resource</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <input
                name="requested_by"
                placeholder="Requested By"
                value={form.requested_by}
                onChange={handleChange}
              />

              <input
                type="date"
                name="booking_date"
                value={form.booking_date}
                onChange={handleChange}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Booking..." : "Book Resource"}
              </button>
            </form>
          </div>

          {/* RESOURCES */}
          <div className="card">
            <h3>Resources</h3>

            {resources.map((r) => (
              <div key={r.id} className="item">
                <b>{r.name}</b>
                <span>{r.type}</span>
                <small>Capacity: {r.capacity}</small>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="card full">
          <h3>Schedule Viewer</h3>

          {bookings.length === 0 ? (
            <p className="muted">No bookings yet</p>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="booking">
                <div>
                  <b>
                    {b.resource_name || getResourceName(b.resource_id)}
                  </b>
                  <p>{b.requested_by}</p>
                </div>

                <div>
                  <p>{b.booking_date}</p>

                  <span
                    className={
                      b.status === "confirmed"
                        ? "status-confirmed"
                        : "status-denied"
                    }
                  >
                    {b.status}
                  </span>

                  <button
                    className="delete"
                    onClick={() => handleDelete(b.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}