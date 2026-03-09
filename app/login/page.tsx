import { apiServer } from "@/api/server";
import { meErrorMsg } from "@/api/errorMsg";
import { LoginForm } from "@/features/auth/LoginForm";
import { Page } from "@/components/Page";
import { fetchAll } from "@/util/fetchAll";
import s from "./styles.module.scss";

export default async function Home() {
  const [{ data: me, error: meError }] = await fetchAll(apiServer.me());

  return (
    <Page
      me={me}
      meError={meErrorMsg(meError)}
      contentClassName={s.content}
      year={new Date().getFullYear()}
    >
      <h1 className={s.title}>Login</h1>
      <LoginForm />
    </Page>
  );
}
