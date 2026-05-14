import { useEffect, useRef, useState } from "react";
import {
  ApiError,
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductFacets,
  type ProductDetail,
  type ProductFacets,
  type ProductsListResult,
  type ProductsQuery,
} from "@/lib/api";
import type { Product } from "@/data/products";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

function initial<T>(): AsyncState<T> {
  return { data: null, loading: true, error: null };
}

/**
 * Lista paginada de produtos. Query é serializada estável.
 * Reload manual via `reload()`.
 */
export function useProducts(query: ProductsQuery) {
  const [state, setState] = useState<AsyncState<ProductsListResult>>(initial);
  const key = JSON.stringify(query);
  const [bump, setBump] = useState(0);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    getProducts(query)
      .then((data) => {
        if (aliveRef.current) setState({ data, loading: false, error: null });
      })
      .catch((err: ApiError) => {
        if (aliveRef.current) setState({ data: null, loading: false, error: err });
      });
    return () => {
      aliveRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, bump]);

  return { ...state, reload: () => setBump((n) => n + 1) };
}

export function useFeaturedProducts(limit = 6) {
  const [state, setState] = useState<AsyncState<Product[]>>(initial);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    getFeaturedProducts(limit)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((err: ApiError) => alive && setState({ data: null, loading: false, error: err }));
    return () => {
      alive = false;
    };
  }, [limit, bump]);

  return { ...state, reload: () => setBump((n) => n + 1) };
}

export function useProductBySlug(slug: string | undefined) {
  const [state, setState] = useState<AsyncState<ProductDetail>>(initial);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    if (!slug) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    getProductBySlug(slug)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((err: ApiError) => alive && setState({ data: null, loading: false, error: err }));
    return () => {
      alive = false;
    };
  }, [slug, bump]);

  return { ...state, reload: () => setBump((n) => n + 1) };
}

export function useProductFacets() {
  const [state, setState] = useState<AsyncState<ProductFacets>>(initial);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    getProductFacets()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((err: ApiError) => alive && setState({ data: null, loading: false, error: err }));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
