import { defineBoot } from "#q-app/wrappers";
import axios from "axios";

const REST_URL =
  import.meta.env.VITE_SUPABASE_REST_URL ||
  `${import.meta.env.VITE_SUPABASE_URL}/rest/v1`;

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const api = axios.create({
  baseURL: REST_URL,
  headers: {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers.apikey = ANON_KEY;
  config.headers.Authorization = `Bearer ${ANON_KEY}`;
  return config;
});

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});
