export const required = (value: string) => !value && "Required";

export const minChars = (min: number) => (value: string) =>
  value.length < min && `At least ${min} characters`;
