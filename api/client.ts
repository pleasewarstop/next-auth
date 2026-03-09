import fetchApiClient from "@/util/fetchApi/client";
import { createApi } from "./api";

export const api = createApi(fetchApiClient);
