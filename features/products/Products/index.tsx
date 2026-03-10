"use client";

import { ProductsList } from "@/components/ProductsList";
import { useStore } from "@/components/StoresProvider/useStore";
import { productsStore } from "@/stores/products";
import { useEffect } from "react";

export interface Props {}
export function Products({}: Props) {
  const { products, loading, error, fetchNextIfNeeded, abortIfNeeded } =
    useStore(productsStore)();

  useEffect(() => {
    return abortIfNeeded;
  }, [abortIfNeeded]);

  return (
    <ProductsList
      products={products}
      loading={loading}
      error={error}
      onFetchNext={fetchNextIfNeeded}
    />
  );
}
