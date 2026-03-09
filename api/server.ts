import fetchApiServer from "@/util/fetchApi/server";
import { createApi } from "./api";

export const apiServer = createApi(fetchApiServer);
