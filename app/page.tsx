import { apiServer } from "@/api/server";
import { meErrorMsg, productsErrorMsg } from "@/api/errorMsg";
import HomeClient from "@/app/page.client";
import { StoresProvider } from "@/components/StoresProvider";
import { prefetchStores } from "@/components/StoresProvider/prefetchStores";
import { productsStore } from "@/stores/products";
import { yearStore } from "@/stores/year";
import { meStore } from "@/stores/me";

export default async function Home() {
  const initData = await prefetchStores(
    {
      store: meStore,
      data: apiServer.me(),
      error: meErrorMsg,
    },
    {
      store: productsStore,
      data: apiServer
        .products()
        .then((d) => ({ products: d.products, total: d.total })),
      error: productsErrorMsg,
    },
    {
      store: yearStore,
      data: new Date().getFullYear(),
    }
  );

  return (
    <StoresProvider initData={initData}>
      <HomeClient />
    </StoresProvider>
  );
}
