"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/app/routes";
import { meStore } from "@/stores/me";
import { logout } from "@/features/auth/actions";
import { PageRow } from "@/components/Page/Row";
import { LoadingError } from "@/components/LoadingError";
import { useStore } from "@/components/StoresProvider/useStore";
import s from "./styles.module.scss";

interface Props {}
export function Header({}: Props) {
  const { me, error } = useStore(meStore)();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className={s.container}>
      <PageRow className={s.content}>
        <Link
          href={routes.home()}
          className={s.logo}
          onClick={() => {
            if (pathname === routes.home()) {
              window.scrollTo(0, 0);
            }
          }}
        >
          <Image width={38} height={38} src="/img/stones.png" alt="logo" />
          Abelohost Shop
        </Link>
        <div className={s.right}>
          <LoadingError className={s.error} error={error} />
          {me ? (
            <>
              <span>
                {me.firstName} {me.lastName}
              </span>
              <span
                className={s.logout}
                onClick={async () => {
                  await logout();
                  router.push(routes.login());
                }}
              >
                Logout
              </span>
            </>
          ) : (
            pathname !== routes.login() && (
              <Link href={routes.login()}>Login</Link>
            )
          )}
        </div>
      </PageRow>
    </header>
  );
}
