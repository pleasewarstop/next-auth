"use client";

import { useEffect } from "react";
import { TMe } from "@/api/types";
import { ProductsList } from "@/components/ProductsList";
import { InitData, useProducts } from "@/stores/products";

export interface Props {
  initProducts: InitData;
  initProductsError: string | null;
  me: TMe;
}
export function Products({ initProducts, initProductsError, me }: Props) {
  useEffect(() => {
    useProducts.getState().init(initProducts, initProductsError);
  }, [initProducts, initProductsError]);

  const { inited, products, loading, error, fetchNextIfNeeded, abortIfNeeded } =
    useProducts();

  useEffect(() => {
    return abortIfNeeded;
  }, [abortIfNeeded]);

  return (
    <ProductsList
      products={inited ? products : initProducts?.products || []}
      me={me}
      loading={loading}
      error={inited ? error : initProductsError}
      onFetchNext={fetchNextIfNeeded}
    />
  );
}
