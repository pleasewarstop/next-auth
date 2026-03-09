"use client";

import { Page } from "@/components/Page";
import { Products } from "@/features/products/Products";
import { useStore } from "@/components/StoresProvider/useStore";
import { productsStore } from "@/stores/products";

interface Props {}
export default function HomeClient({}: Props) {
  const hasFooter = useStore(productsStore)((p) =>
    Boolean(p.products.length === p.total || p.error || p.refetching)
  );
  return (
    <Page hasFooter={hasFooter}>
      <h1>Latest Products</h1>
      <Products />
    </Page>
  );
}
