import { useMemo, SubmitEvent, useRef } from "react";
import { useStateWithRef } from "@/util/useStateWithRef";
import { isPromise } from "@/util/isPromise";
import { ErrorType, FormState, ValidatorObject, Validators } from "./types";

interface Props<Values extends object, SubmitReturn> {
  initValues: Values;
  validators: Validators<Values>;
  onSubmit?: (values: Values) => SubmitReturn;
}

export const useForm = <Values extends object, SubmitReturn = any>({
  initValues,
  validators,
  onSubmit,
}: Props<Values, SubmitReturn>) => {
  const initState = useMemo(() => {
    const result = {
      values: {},
      errors: {},
      touched: {},
      submitting: false,
      errorSubmit: null,
      submitted: false,
    } as FormState<Values>;

    for (const key in initValues) {
      result.values[key] = initValues[key];
      result.errors[key] = null;
      result.touched[key] = false;
    }
    return result;
  }, [initValues]);
  const wasChangedRef = useRef(false);

  const [state, setStateWithRef, stateRef] =
    useStateWithRef<FormState<Values>>(initState);

  function getRelatedErrors<Name extends keyof Values>(
    name: Name,
    values: Values
  ) {
    const errors: Partial<Record<keyof Values, ErrorType>> = {};
    for (const vNameKey in validators) {
      const vName = vNameKey as keyof Values;
      if (vName === name) {
        errors[name] = getError(name, values);
      } else {
        const arr = Array.isArray(validators[vName])
          ? validators[vName]
          : [validators[vName]];
        const isDep = arr.some((validator) => validator?.deps?.includes(name));

        if (isDep) errors[vName] = getError(vName, values);
      }
    }
    return errors;
  }

  function getError<Name extends keyof Values>(
    name: Name,
    values: Values
  ): ErrorType {
    const value = values[name];
    if (Array.isArray(validators[name])) {
      for (const validator of validators[name]) {
        const error =
          typeof validator === "function"
            ? validator(value)
            : getErrorFromObject(name, values, validator);
        if (error) return error;
      }
    } else if (typeof validators[name] === "function") {
      return validators[name]?.(value);
    } else if (validators[name]) {
      return getErrorFromObject(name, values, validators[name]);
    }
  }

  function getErrorFromObject<Name extends keyof Values>(
    name: Name,
    values: Values,
    validatorObj: ValidatorObject<Values, Name>
  ): ErrorType {
    const depsValues = validatorObj.deps.map((dep) => values[dep]);
    if (Array.isArray(validatorObj.validate)) {
      for (const validate of validatorObj.validate) {
        const error = validate(values[name], ...depsValues);
        if (error) return error;
      }
    } else return validatorObj.validate(values[name], ...depsValues);
  }

  function field<Name extends keyof Values>(name: Name) {
    return {
      value: state.values[name],
      onChange(value: Values[typeof name]) {
        wasChangedRef.current = true;

        setStateWithRef((st) => {
          const values = {
            ...st.values,
            [name]: value,
          };
          return {
            ...st,
            values,
            errors: {
              ...st.errors,
              ...getRelatedErrors(name, values),
            },
          };
        });
      },
      onBlur() {
        if (!state.touched[name])
          setStateWithRef((st) => ({
            ...st,
            touched: wasChangedRef.current
              ? {
                  ...st.touched,
                  [name]: true,
                }
              : st.touched,
            errors: {
              ...st.errors,
              ...getRelatedErrors(name, st.values),
            },
          }));
      },
      error: state.touched[name] && state.errors[name],
      valid: Boolean(state.touched[name] && !state.errors[name]),
    };
  }

  function submit(e?: SubmitEvent<HTMLFormElement>) {
    e?.preventDefault();

    const errors = {} as typeof stateRef.current.errors;
    for (const name in validators) {
      errors[name] = getError(name, stateRef.current.values);
    }
    if (Object.values(errors).filter(Boolean).length) {
      const newState = {
        values: stateRef.current.values,
        errors: errors,
        touched: {},
        submitting: stateRef.current.submitting,
        errorSubmit: stateRef.current.errorSubmit,
        submitted: stateRef.current.submitted,
      } as FormState<Values>;

      for (const name in state.values) {
        newState.touched[name] = true;
      }

      setStateWithRef(newState);
      return false;
    }
    const submitResult = onSubmit?.(stateRef.current.values) || true;
    if (!isPromise(submitResult)) {
      if (stateRef.current.errorSubmit) {
        setStateWithRef({
          ...stateRef.current,
          errorSubmit: null,
        });
      }
      return submitResult;
    }

    setStateWithRef({
      ...stateRef.current,
      submitting: true,
      errorSubmit: null,
    });
    return submitResult
      .then((res) => {
        setStateWithRef({
          ...stateRef.current,
          submitting: false,
          submitted: true,
        });
        return res || true;
      })
      .catch((e) => {
        setStateWithRef({
          ...stateRef.current,
          submitting: false,
          errorSubmit: e,
        });
        throw e;
      });
  }

  return {
    field,
    submit,
    stateRef,
    errorSubmit: state.errorSubmit,
    submitting: state.submitting,
    submitted: state.submitted,
    setState: setStateWithRef,
  };
};
