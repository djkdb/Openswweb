window.API_BASE = (function() {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1' || h === '') {
    return 'http://127.0.0.1:3001';
  }
  return 'https://classfc-api.onrender.com';
})();
