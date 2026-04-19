import { useEffect, useState } from "react";
import ResourceCard from "../components/ResourceCard";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";
import {
  getResources,
  createBooking,
  getBookings,
  deleteBooking
} from "../services/api";

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Load data
  useEffect(() => {
    const load = async () => {
      const r = await getResources();
      const b = await getBookings();
      setResources(r.data);
      setBookings(b.data);
    };
    load();
  }, []);

  // Booking
  const handleBooking = async (data) => {
    try {
      setLoading(true);
      setSuccessMsg("");

      await createBooking(data);

      setSuccessMsg("Booking successful!");

      const res = await getBookings();
      setBookings(res.data);

      setSelectedResource(null);
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete booking
  const handleDelete = async (id) => {
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="container page">
      {/* Resources */}
      <div className="grid">
        {resources.map((r) => (
          <ResourceCard
            key={r.id}
            resource={r}
            onBook={setSelectedResource}
          />
        ))}
      </div>

      {/* Booking Form */}
      {selectedResource && (
        <BookingForm
          resource={selectedResource}
          onSubmit={handleBooking}
          loading={loading}
        />
      )}

      {successMsg && <p className="success">{successMsg}</p>}

      {/* Schedule Viewer */}
      <BookingList bookings={bookings} onDelete={handleDelete} />
    </div>
  );
};

export default Dashboard;