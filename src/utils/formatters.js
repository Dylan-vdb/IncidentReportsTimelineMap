// Utility functions for formatting dates and locations

// Format date for display
export const formatDate = (datetime) => {
  const date = new Date(datetime);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${day} ${month} ${year}, ${time}`;
};

// Format location for display
export const formatLocation = (location) => {
  return `${location[0].toFixed(4)}, ${location[1].toFixed(4)}`;
};