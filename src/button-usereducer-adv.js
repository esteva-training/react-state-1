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

const NEXT_STATE_GRAPH = {
  active: {
    HOVER: "hovered",
    PRESS: "pressed",
    CLICK: "clicked",
    DISABLE: "disabled",
    FOCUS: "focused",
  },
  disabled: {
    ENABLE: "active",
  },
  hovered: {
    HOVEROFF: "active",
    PRESS: "pressed",
  },
  pressed: {
    DONE: "success",
    ERROR: "retry",
  },
  focused: {
    PRESS: "pressed",
    BLUR: "active",
  },
  success: {},
  retry: {
    HOVER: "hovered",
    PRESS: "pressed",
    CLICK: "clicked",
    DISABLE: "disabled",
    FOCUS: "focused",
  },
};

const reducer = (state, event) => {
  const nextState = NEXT_STATE_GRAPH[state][event];
  // console.log(event, state, nextState);
  return nextState !== undefined ? nextState : state;
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
      send(ACTIONS.ERROR); //This no longer creates issues. cant transition to ERROR from DONE.
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
        class="bg-red-200 disabled:opacity-20"
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
