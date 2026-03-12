const errorMsg = (e: any, placeholder: string) =>
  e === null ? null : ((e?.response?.data?.message || placeholder) as string);

export const loginErrText = "Server error. Try again please.";

export const loginErrorMsg = (e: any) => errorMsg(e, loginErrText);

export const productsErrorMsg = (e: any) =>
  errorMsg(e, "Failed to load products");

export const meErrorMsg = (e: any) =>
  e?.status === 401 ? null : errorMsg(e, "Failed to load user");
