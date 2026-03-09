import { useCallback, useRef, useState } from "react";

type Setter<State> = (st: State) => State;

export const useStateWithRef = <T extends object>(initState: T) => {
  const [state, set] = useState<T>(initState);
  const stateRef = useRef(state);
  const setState = useCallback((setter: T | Setter<T>) => {
    if (typeof setter !== "function") {
      stateRef.current = setter;
      return set(setter);
    }
    stateRef.current = setter(stateRef.current);
    set(stateRef.current);
  }, []);

  return [state, setState, stateRef] as const;
};
