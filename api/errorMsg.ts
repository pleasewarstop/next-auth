export const defaultErrorMsg = "Server error. Try again please.";

export const errorMsg = (e: any, placeholder: string = defaultErrorMsg) =>
  e === null ? null : ((e?.response?.data?.message || placeholder) as string);

export const loginErrorMsg = (e: any) => errorMsg(e);

export const productsErrorMsg = (e: any) =>
  errorMsg(e, "Failed to load products");

export const meErrorMsg = (e: any) =>
  e?.status === 401 ? null : errorMsg(e, "Failed to load user");
