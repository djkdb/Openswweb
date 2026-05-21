const api = {
  token: () => localStorage.getItem('classfc_token') || '',

  headers: function(json) {
    const h = {};
    if (json) h['Content-Type'] = 'application/json';
    const t = api.token();
    if (t) h['Authorization'] = 'Bearer ' + t;
    return h;
  },

  get: async function(path) {
    const r = await fetch(window.API_BASE + path, { headers: api.headers(false) });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.error || ('HTTP ' + r.status));
    }
    return r.json();
  },

  post: async function(path, body) {
    const r = await fetch(window.API_BASE + path, {
      method: 'POST',
      headers: api.headers(true),
      body: JSON.stringify(body || {})
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.error || ('HTTP ' + r.status));
    }
    return r.json();
  },

  put: async function(path, body) {
    const r = await fetch(window.API_BASE + path, {
      method: 'PUT',
      headers: api.headers(true),
      body: JSON.stringify(body || {})
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.error || ('HTTP ' + r.status));
    }
    return r.json();
  },

  del: async function(path) {
    const r = await fetch(window.API_BASE + path, {
      method: 'DELETE',
      headers: api.headers(false)
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.error || ('HTTP ' + r.status));
    }
    return r.json();
  }
};
