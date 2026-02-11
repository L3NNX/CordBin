// hooks/useAuth.ts
import { useEffect, useState } from "react";
import api, { API_CONFIG } from "../config/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(API_CONFIG.ENDPOINTS.AUTH_VERIFY)
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
