import { meStore } from "@/stores/me";
import { yearStore } from "@/stores/year";
import { PageRow } from "@/components/Page/Row";
import { useStore } from "@/components/StoresProvider/useStore";
import s from "./styles.module.scss";

export interface Props {}
export function Footer({}: Props) {
  const { me } = useStore(meStore)();
  const { year } = useStore(yearStore)();

  return (
    <div className={s.container}>
      <PageRow>
        {year} {me && `| Logged as ${me.email}`}
      </PageRow>
    </div>
  );
}
