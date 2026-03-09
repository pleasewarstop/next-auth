export type ErrorType = string | boolean | null | undefined;

type ValidatorFn<T> = (value: T, ...depsValues: unknown[]) => ErrorType;

export type ValidatorObject<
  Values extends object,
  K extends keyof Values,
  Deps extends (keyof Values)[] = (keyof Values)[],
> = {
  deps: Deps;
  validate: ValidatorFn<Values[K]> | ValidatorFn<Values[K]>[];
};

export type Validator<Values extends object, K extends keyof Values> =
  | ValidatorFn<Values[K]>
  | ValidatorObject<Values, K>;

export type Validators<Values extends object> = {
  [K in keyof Values]?: Validator<Values, K> | Validator<Values, K>[];
};

export type FormState<Values extends object, ErrorSubmit = unknown> = {
  values: {
    [K in keyof Values]: Values[K];
  };
  errors: {
    [K in keyof Values]: ErrorType;
  };
  touched: {
    [K in keyof Values]: boolean;
  };
  submitting: boolean;
  submitted: boolean;
  errorSubmit: ErrorSubmit;
};
