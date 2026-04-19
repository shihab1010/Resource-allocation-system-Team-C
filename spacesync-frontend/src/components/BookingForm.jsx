import { useState } from "react";

const BookingForm = ({ resource, onSubmit, loading }) => {
  const [requestedBy, setRequestedBy] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!requestedBy.trim() || !date) return;

    onSubmit({
      resource_id: resource.id,
      requested_by: requestedBy,
      booking_date: date
    });

    setRequestedBy("");
    setDate("");
  };

  return (
    <div className="form-container">
      <h3>Booking: {resource.name}</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Requested By"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;