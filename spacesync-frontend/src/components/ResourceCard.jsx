const ResourceCard = ({ resource, onBook }) => {
  return (
    <div className="card">
      <h3>{resource.name}</h3>
      <p>Type: {resource.type}</p>
      <p>Capacity: {resource.capacity}</p>
      <button onClick={() => onBook(resource)}>Book Now</button>
    </div>
  );
};

export default ResourceCard;