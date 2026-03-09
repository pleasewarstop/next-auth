import { TMe } from "@/api/types";
import { PageRow } from "@/components/Page/Row";
import s from "./styles.module.scss";

export interface Props {
  me: TMe;
  year: number;
}
export function Footer({ me, year }: Props) {
  return (
    <div className={s.container}>
      <PageRow>
        {year} {me && `| Logged as ${me.email}`}
      </PageRow>
    </div>
  );
}
