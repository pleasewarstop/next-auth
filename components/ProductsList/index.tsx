"use client";

import { useRef } from "react";
import { TMe, TProduct } from "@/api/types";
import { Product } from "@/components/Product";
import { Spinner } from "@/components/Spinner";
import { LoadingError } from "@/components/LoadingError";
import { useIntersection } from "@/util/useIntersection";
import s from "./styles.module.scss";

interface Props {
  products: TProduct[];
  me: TMe;
  loading: boolean;
  error: string | null;
  onFetchNext: () => void;
}
export function ProductsList({
  products,
  me,
  loading,
  error,
  onFetchNext,
}: Props) {
  const intersectionRef = useRef<HTMLDivElement | null>(null);
  const isIntersectionShown = !(error || loading);
  useIntersection(intersectionRef, onFetchNext, isIntersectionShown);

  return (
    <>
      <div className={s.container}>
        {products.map((product) => (
          <Product product={product} me={me} key={product.id} />
        ))}
      </div>
      <LoadingError error={error} onRetry={onFetchNext} />
      {isIntersectionShown && (
        <div className={s.intersection} ref={intersectionRef} />
      )}
      {loading && <Spinner className={s.spinner} />}
    </>
  );
}
