"use client";

import { useState } from "react";


export function usePage(filterKey: string) {
  const [state, setState] = useState({ key: filterKey, page: 1 });
  const page = state.key === filterKey ? state.page : 1;
  const setPage = (p: number) => setState({ key: filterKey, page: p });
  return [page, setPage] as const;
}