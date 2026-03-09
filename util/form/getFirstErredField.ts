import { FormState } from "./types";

export function getFirstErredField<Values extends object>(
  formStateRef: FormState<Values>,
) {
  for (const key in formStateRef.errors) {
    if (formStateRef.errors[key]) return key;
  }
  return null;
}
