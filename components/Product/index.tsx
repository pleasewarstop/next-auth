import Image from "next/image";
import { TMe, TProduct } from "@/api/types";
import { Button } from "@/components/Button";
import s from "./styles.module.scss";

export interface Props {
  product: TProduct;
  me: TMe;
}
export function Product({ product, me }: Props) {
  return (
    <div className={s.container}>
      <div className={s.imgStratch}>
        <div className={s.imgContainer}>
          <Image
            src={product.thumbnail}
            alt={`Image for ${product.title}`}
            fill
          />
        </div>
      </div>

      <div className={s.title} title={product.title}>
        {product.title}
      </div>
      <div className={s.category}>{product.category.toUpperCase()}</div>
      <div className={s.price}>${product.price}</div>

      {me && <Button className={s.button}>Add to cart</Button>}
    </div>
  );
}
