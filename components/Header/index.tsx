"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { TMe } from "@/api/types";
import { routes } from "@/app/routes";
import { logout } from "@/features/auth/actions";
import { PageRow } from "@/components/Page/Row";
import { LoadingError } from "@/components/LoadingError";
import s from "./styles.module.scss";

interface Props {
  me: TMe;
  meError: string | null;
}
export function Header({ me, meError }: Props) {
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
          <LoadingError className={s.error} error={meError} />
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
