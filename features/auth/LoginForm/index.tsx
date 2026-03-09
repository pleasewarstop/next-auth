"use client";

import { RefObject, useRef } from "react";
import { useRouter } from "next/navigation";
import cn from "classnames";
import { routes } from "@/app/routes";
import { TLoginData } from "@/api/types";
import { login } from "@/features/auth/actions";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { FormError } from "@/components/FormError";
import { Spinner } from "@/components/Spinner";
import { useForm } from "@/util/form/useForm";
import { getFirstErredField } from "@/util/form/getFirstErredField";
import { Validators } from "@/util/form/types";
import { minChars, required } from "@/util/validators";
import s from "./styles.module.scss";

const initValues: TLoginData = {
  username: "",
  password: "",
};

const validators: Validators<typeof initValues> = {
  username: [required, minChars(3)],
  password: [required, minChars(3)],
};

interface Props {
  className?: string;
}
export function LoginForm({ className }: Props) {
  const { field, submit, submitting, submitted, stateRef, errorSubmit } =
    useForm({
      initValues,
      validators,
      onSubmit: login,
    });
  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const refs = {
    username: usernameRef,
    password: passwordRef,
  } satisfies Record<
    keyof typeof initValues,
    RefObject<HTMLInputElement | null>
  >;

  return (
    <form
      className={cn(s.form, className)}
      onSubmit={async (e) => {
        try {
          const isValid = await submit(e);
          if (!isValid) {
            const erredFieldName = getFirstErredField(stateRef.current);
            if (erredFieldName !== null) {
              refs[erredFieldName].current?.focus();
            }
          } else {
            router.push(routes.home());
          }
        } catch {}
      }}
    >
      <Input
        {...field("username")}
        ref={usernameRef}
        placeholder="Name"
        autofocus
      />
      <Input
        {...field("password")}
        ref={passwordRef}
        type="password"
        placeholder="Password"
      />
      <Button disabled={submitting || submitted}>
        <span className={s.relative}>
          Login
          {submitting && <Spinner className={s.spinner} size={14} />}
        </span>
      </Button>
      <FormError error={(errorSubmit as any)?.message} className={s.error} />
    </form>
  );
}
