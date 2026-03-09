import cn from "classnames";
import s from "./styles.module.scss";

interface Props {
  size?: number;
  className?: string;
}
export function Spinner({ size = 24, className }: Props) {
  return (
    <div
      className={cn(className, s.container)}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
