import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = 'legal_journal_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- Auth ----------
export const loginApi = async (email, password) => {
  const { data } = await axios.post(`${API}/auth/login`, { email, password });
  return data;
};

export const getMeApi = async () => {
  const { data } = await axios.get(`${API}/auth/me`, { headers: authHeaders() });
  return data;
};

// ---------- Entries ----------
export const getEntriesApi = async (practicum = 'practicum1', week = 'all') => {
  const { data } = await axios.get(`${API}/entries`, {
    params: { practicum, week },
  });
  return data;
};

export const createEntryApi = async (entry) => {
  const { data } = await axios.post(`${API}/entries`, entry, { headers: authHeaders() });
  return data;
};

export const updateEntryApi = async (id, entry) => {
  const { data } = await axios.put(`${API}/entries/${id}`, entry, { headers: authHeaders() });
  return data;
};

export const deleteEntryApi = async (id) => {
  const { data } = await axios.delete(`${API}/entries/${id}`, { headers: authHeaders() });
  return data;
};

// ---------- Stats ----------
export const getStatsApi = async () => {
  const { data } = await axios.get(`${API}/stats`);
  return data;
};

// ---------- Error formatting ----------
export const formatApiError = (detail) => {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
};

// ---------- Image compression helper ----------
export const compressImage = (file, maxSize = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
