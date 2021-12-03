import React, { useReducer, useEffect } from "react";
import { Debugger } from "./debugger";

// TS => enums
export const ACTIONS = {
  PRESS: "PRESS",
  ENABLE: "ENABLE",
  DONE: "DONE",
  ERROR: "ERROR",
};

export const STATES = {
  DISABLED: "disabled",
  ACTIVE: "active",
  PRESSED: "pressed",
  SUCCESS: "success",
  ERROR: "retry",
};

const reducer = (state, event) => {
  switch (event) {
    case ACTIONS.ENABLE:
      return STATES.ACTIVE;
    case ACTIONS.PRESS:
      return STATES.PRESSED;
    case ACTIONS.DONE:
      return STATES.SUCCESS;
    default:
      return STATES.ERROR;
  }
};

export const Button = ({ children, submit, disabled, ...rest }) => {
  const [current, send] = useReducer(reducer, "disabled");

  useEffect(() => {
    if (!disabled) send(ACTIONS.ENABLE);
  }, [disabled]);

  async function submitHandler() {
    if (current === STATES.PRESSED) return false; // avoid resubmitting while http request is ongoing
    try {
      send(ACTIONS.PRESS);
      await submit();
      send(ACTIONS.DONE);
      //send(ACTIONS.ERROR); // problem is we can send any action in whatever state. we can make mistakes
    } catch (error) {
      send(ACTIONS.ERROR);
    }
  }

  return (
    <div>
      <Debugger info={{ state: current }} />
      <button
        onClick={() => submitHandler()}
        className={`button-${current}`}
        disabled={disabled || current === STATES.SUCCESS}
        class="bg-red-200"
      >
        {current === STATES.PRESSED && <span>submitting</span>}
        {current === STATES.SUCCESS && <span>done</span>}
        {current === STATES.ERROR && <span>try again</span>}
        {current === STATES.DISABLED && children}
        {current === STATES.ACTIVE && children}
      </button>
    </div>
  );
};
