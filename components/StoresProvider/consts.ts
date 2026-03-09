import { StoreName } from "@/components/StoresProvider/types";
import stores from "@/stores";

export const nameByStoreMap = new Map();
for (const name in stores) {
  nameByStoreMap.set(stores[name as StoreName], name);
}
