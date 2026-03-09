import { apiServer } from "@/api/server";
import { meErrorMsg, productsErrorMsg } from "@/api/errorMsg";
import { fetchAll } from "@/util/fetchAll";
import HomeClient from "@/app/page.client";

export default async function Home() {
  const [
    { data: me, error: meError },
    { data: initProducts, error: initProductsError },
  ] = await fetchAll(apiServer.me(), apiServer.products());

  return (
    <HomeClient
      me={me}
      meError={meErrorMsg(meError)}
      initProducts={
        initProducts
          ? {
              products: initProducts.products,
              total: initProducts.total,
            }
          : null
      }
      initProductsError={productsErrorMsg(initProductsError)}
      year={new Date().getFullYear()}
    />
  );
}
