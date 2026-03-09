"use server";

import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { parseString } from "set-cookie-parser";
import { apiServer } from "@/api/server";
import { TLoginData } from "@/api/types";
import { loginErrorMsg, loginErrText } from "@/api/errorMsg";

const tokenKey = "accessToken";
const refreshTokenKey = "refreshToken";

export async function login(data: TLoginData) {
  try {
    const res = await apiServer.login(data);
    await setTokens(res);
  } catch (e: any) {
    const msg = loginErrorMsg(e) ?? loginErrText;
    throw new Error(msg);
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(tokenKey);
  cookieStore.delete(refreshTokenKey);
}

async function setTokens(res: AxiosResponse) {
  const cookieStore = await cookies();

  res.headers["set-cookie"]?.forEach((cookieString) => {
    const { name, value, sameSite, ...rest } = parseString(cookieString);
    if (![tokenKey, refreshTokenKey].includes(name)) return;

    const sameSiteLower = sameSite?.toLowerCase();
    if (
      typeof sameSiteLower === "string" &&
      sameSiteLower !== "lax" &&
      sameSiteLower !== "strict" &&
      sameSiteLower !== "none"
    ) {
      throw new Error(`Wrong setCookie sameSite option: ${sameSite}`);
    }

    cookieStore.set(name, value, { sameSite: sameSiteLower, ...rest });
  });
}
