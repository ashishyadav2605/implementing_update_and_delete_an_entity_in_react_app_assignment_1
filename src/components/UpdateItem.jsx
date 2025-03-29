import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UpdateItem = ({ apiUri, doorId }) => {
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoor = async () => {
      try {
        const response = await fetch(`${apiUri}/${doorId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch door: ${response.status} ${response.statusText}`);
        }
        const doorData = await response.json();
        setItem(doorData);
        setFormData({ name: doorData.name || '' });
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoor();
  }, [apiUri, doorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUri}/${doorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update door');
      const updatedDoor = await response.json();
      setItem(updatedDoor);
      setResponseMessage('Door updated successfully!');
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponseMessage('');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {item ? (
        <>
          <h2>Update Door #{item.id}</h2>
          <p>Current Name: {item.name}</p>
          {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Door Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter door name"
              />
            </div>
            <button type="submit">Update Door</button>
          </form>
        </>
      ) : (
        <p>No item data available</p>
      )}
    </div>
  );
};

UpdateItem.propTypes = {
  apiUri: PropTypes.string.isRequired,
  doorId: PropTypes.number.isRequired,
};

UpdateItem.defaultProps = {
  doorId: 1,
};

export default UpdateItem;