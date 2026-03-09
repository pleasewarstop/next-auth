"use client";

import { ProductsList } from "@/components/ProductsList";
import { useStore } from "@/components/StoresProvider/useStore";
import { productsStore } from "@/stores/products";

export interface Props {}
export function Products({}: Props) {
  const { products, loading, error, fetchNextIfNeeded } =
    useStore(productsStore)();

  return (
    <ProductsList
      products={products}
      loading={loading}
      error={error}
      onFetchNext={fetchNextIfNeeded}
    />
  );
}
