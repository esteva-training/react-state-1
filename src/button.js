import React, { useState } from "react";
import { Debugger } from "./debugger";

export const Button = ({ children, submit, ...rest }) => {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(null);
  const [hasError, setError] = useState(null);
  const submitHandler = async () => {
    if (isLoading) return false; // avoid resubmitting while http request is ongoing
    try {
      setError(null);
      setLoading(true);
      await submit();
      setLoading(false);
      setSuccess(true);      
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      setError("ooops");
    }
  }; // not fun to think all possible combinations, dont miss one, dont create an impossible state such as isLoading and error both true
  if (isLoading)
    return (
      <>
        <Debugger info={{ isLoading, isSuccess, hasError }} />
        <button {...rest} onClick={submitHandler} class="bg-red-200">
          submitting
        </button>
      </>
    );
  if (isSuccess)
    return (
      <>
        <Debugger info={{ isLoading, isSuccess, hasError }} />
        <button {...rest} disabled class="bg-red-200">
          done
        </button>
      </>
    );
  if (isSuccess != null && !isSuccess)
    return (
      <>
        <Debugger info={{ isLoading, isSuccess, hasError }} />
        <button {...rest} onClick={submitHandler} class="bg-red-200">
          try again
        </button>
      </>
    );
  return (
    <>
      <Debugger info={{ isLoading, isSuccess, hasError }} />
      <button {...rest} onClick={submitHandler} class="bg-red-200">
        {children}
      </button>
    </>
  );
};
