import { StoreCreator } from "@/components/StoresProvider/types";
import { meStore } from "@/stores/me";
import { productsStore } from "@/stores/products";
import { yearStore } from "@/stores/year";

const stores = {
  meStore,
  productsStore,
  yearStore,
} satisfies Record<string, StoreCreator>;

export default stores;
