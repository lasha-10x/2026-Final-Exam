import { useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import type { FieldErrors } from "@/utils/validation";

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Generic controlled-form hook. Values live in useState, inputs are driven by value/onChange,
// the form submits through onSubmit + preventDefault, and errors show after blur or a submit attempt.
export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate: (values: T) => FieldErrors<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [validate, values]);

  function handleChange(e: ChangeEvent<FieldElement>): void {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e: FocusEvent<FieldElement>): void {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function setFieldValue(name: keyof T, value: string): void {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function fieldError(name: keyof T): string | undefined {
    return touched[name] === true || submitted ? errors[name] : undefined;
  }

  function handleSubmit(onValid: (values: T) => void) {
    return (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault(); // no page reload
      setSubmitted(true);
      if (Object.keys(errors).length === 0) onValid(values);
    };
  }

  function reset(next: T = initialValues): void {
    setValues(next);
    setTouched({});
    setSubmitted(false);
  }

  return { values, errors, fieldError, handleChange, handleBlur, handleSubmit, setFieldValue, reset };
}
