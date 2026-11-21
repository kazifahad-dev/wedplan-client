"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MapPin, Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "./service-card";
import { ServiceGridSkeleton } from "./service-card-skeleton";
import { CATEGORIES, POPULAR_LOCATIONS } from "@/lib/constants";
import type { ServicesResponse } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL;
const PAGE_SIZE = 9;

const SELECT_CLASS =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

type Result = { key: string; data?: ServicesResponse; failed?: boolean };

export function ServicesBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);

  
  const urlSearch = params.get("search") ?? "";
  const urlLocation = params.get("location") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const page = Math.max(parseInt(params.get("page") ?? "1") || 1, 1);

  
  const [search, setSearch] = useState(urlSearch);
  const [location, setLocation] = useState(urlLocation);
  const [attempt, setAttempt] = useState(0); 

  
  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== urlSearch || location.trim() !== urlLocation) {
        updateParams({
          search: search.trim() || null,
          location: location.trim() || null,
          page: null, 
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, location, urlSearch, urlLocation, updateParams]);

  
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    if (urlSearch) qs.set("search", urlSearch);
    if (category) qs.set("category", category);
    if (urlLocation) qs.set("location", urlLocation);
    if (sort) qs.set("sort", sort);
    qs.set("page", String(page));
    qs.set("limit", String(PAGE_SIZE));
    return qs.toString();
  }, [urlSearch, category, urlLocation, sort, page]);

  const requestKey = `${queryString}#${attempt}`;
  const [result, setResult] = useState<Result | null>(null);

  
  const loading = result?.key !== requestKey;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API}/api/services?${queryString}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json() as Promise<ServicesResponse>;
      })
      .then((data) => setResult({ key: requestKey, data }))
      .catch((err) => {
        
        if (err.name !== "AbortError") {
          setResult({ key: requestKey, failed: true });
        }
      });

    return () => controller.abort();
  }, [queryString, requestKey]);

  const data = loading ? undefined : result?.data;
  const failed = !loading && result?.failed;
  const hasFilters = Boolean(urlSearch || category || urlLocation || sort);

  function clearFilters() {
    setSearch("");
    setLocation("");
    router.replace(pathname, { scroll: false });
  }

  function goToPage(p: number) {
    updateParams({ page: p > 1 ? String(p) : null });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={topRef} className="scroll-mt-24 space-y-8">
      
      <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Search services
          </label>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by service name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div>
          <label htmlFor="category" className="sr-only">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) =>
              updateParams({ category: e.target.value || null, page: null })
            }
            className={SELECT_CLASS}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="location" className="sr-only">
            Location
          </label>
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location"
            list="location-options"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
          />
          <datalist id="location-options">
            {POPULAR_LOCATIONS.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="sort" className="sr-only">
            Sort by price
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) =>
              updateParams({ sort: e.target.value || null, page: null })
            }
            className={SELECT_CLASS}
          >
            <option value="">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      
      <div className="flex min-h-9 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data
            ? `${data.total} ${data.total === 1 ? "service" : "services"} found`
            : loading
              ? "Loading services..."
              : ""}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>

      
      {loading && <ServiceGridSkeleton count={PAGE_SIZE > 6 ? 6 : PAGE_SIZE} />}

      
      {failed && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-medium text-destructive">
            Failed to load services
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check your connection and try again.
          </p>
          <Button className="mt-4" onClick={() => setAttempt((a) => a + 1)}>
            Try again
          </Button>
        </div>
      )}

      
      {data && data.items.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed p-12 text-center">
          <SearchX className="mb-3 h-10 w-10 text-primary" />
          <p className="font-heading text-xl text-rose-dark">
            No services found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or remove some filters.
          </p>
          {hasFilters && (
            <Button className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

     
      {data && data.items.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>

          
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                disabled={data.page <= 1}
                onClick={() => goToPage(data.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={data.page >= data.totalPages}
                onClick={() => goToPage(data.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}