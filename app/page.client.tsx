"use client";

import { Page } from "@/components/Page";
import { Products } from "@/features/products/Products";
import { TMe } from "@/api/types";
import { InitData, useProducts } from "@/stores/products";

interface Props {
  me: TMe;
  meError: string | null;
  initProducts: InitData;
  initProductsError: string | null;
  year: number;
}
export default function HomeClient({
  me,
  initProducts,
  meError,
  initProductsError,
  year,
}: Props) {
  const hasFooter = useProducts((p) =>
    Boolean(p.products.length === p.total || p.error || p.refetching)
  );
  return (
    <Page me={me} meError={meError} year={year} hasFooter={hasFooter}>
      <h1>Latest Products</h1>
      <Products
        initProducts={initProducts}
        initProductsError={initProductsError}
        me={me}
      />
    </Page>
  );
}
