import cn from "classnames";
import s from "./styles.module.scss";

export interface Props {
  error: string | null;
  className?: string;
  onRetry?: () => void;
}
export function LoadingError({ error, className, onRetry }: Props) {
  if (!error) return null;

  return (
    <div className={cn(s.container, className)}>
      {error}
      {onRetry && (
        <span className={s.retry} onClick={onRetry}>
          Try again
        </span>
      )}
    </div>
  );
}
