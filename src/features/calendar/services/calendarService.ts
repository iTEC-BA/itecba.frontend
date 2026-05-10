import { auth } from "@/lib/firebase";

const API_URL = `${import.meta.env.VITE_API_URL}/calendar`;

const getHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const calendarService = {
  getAll: async () => {
    const res = await fetch(API_URL);
    return res.json();
  },
  create: async (event: any) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(event)
    });
    return res.json();
  },
  remove: async (id: string) => {
    return fetch(`${API_URL}/${id}`, { 
      method: "DELETE", 
      headers: await getHeaders() 
    });
  }
};
