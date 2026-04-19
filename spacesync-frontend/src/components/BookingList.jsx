const BookingList = ({ bookings, onDelete }) => {
  return (
    <div className="schedule-wrapper">
      <h2 className="schedule-title">Schedule Viewer</h2>

      <table>
        <thead>
          <tr>
            <th>Resource</th>
            <th>Requested By</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.Resource?.name}</td>
              <td>{b.requested_by}</td>
              <td>{b.booking_date}</td>
              <td>
                <button
                  className="cancel-btn"
                  onClick={() => onDelete(b.id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;