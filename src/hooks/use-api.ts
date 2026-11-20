"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface State<T> {
  key?: string;
  data?: T;
  error?: string;
}


export function useApi<T>(path: string) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State<T>>({});
  const key = `${path}#${attempt}`;

  useEffect(() => {
    let cancelled = false;
    apiFetch<T>(path)
      .then((data) => {
        if (!cancelled) setState({ key, data });
      })
      .catch((err) => {
        if (!cancelled) {
          
          setState((prev) => ({
            key,
            data: prev.data,
            error: err instanceof Error ? err.message : "Something went wrong",
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const loading = state.key !== key; 
  const reload = useCallback(() => setAttempt((a) => a + 1), []);

  return {
    data: state.data,
    error: loading ? undefined : state.error,
    loading,
    reload, 
  };
}