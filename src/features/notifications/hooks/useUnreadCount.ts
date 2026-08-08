import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { inboxService } from "../services/inboxService";

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) { setCount(0); return; }
      try {
        const token = await user.getIdToken();
        const messages = await inboxService.getMyMessages(token);
        setCount(Array.isArray(messages) ? messages.filter((m) => !m.isRead).length : 0);
      } catch { setCount(0); }
    });
    return unsub;
  }, []);

  return count;
};
