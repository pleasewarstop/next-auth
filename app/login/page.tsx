import { apiServer } from "@/api/server";
import { meErrorMsg } from "@/api/errorMsg";
import { LoginForm } from "@/features/auth/LoginForm";
import { Page } from "@/components/Page";
import { StoresProvider } from "@/components/StoresProvider";
import { prefetchStores } from "@/components/StoresProvider/prefetchStores";
import { meStore } from "@/stores/me";
import { yearStore } from "@/stores/year";
import s from "./styles.module.scss";

export default async function Home() {
  const serverData = await prefetchStores(
    {
      store: meStore,
      data: apiServer.me(),
      error: meErrorMsg,
    },
    {
      store: yearStore,
      data: new Date().getFullYear(),
    }
  );
  return (
    <StoresProvider serverData={serverData}>
      <Page contentClassName={s.content}>
        <h1 className={s.title}>Login</h1>
        <LoginForm />
      </Page>
    </StoresProvider>
  );
}
