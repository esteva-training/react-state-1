import React from "react";
import { useMachine } from "@xstate/react";
import { buttonMachine, ACTIONS, STATES } from "./button-machine";
import { Debugger } from "./debugger";

export const Button = ({ children, submit, disabled, ...rest }) => {
  const machine = buttonMachine(submit);
  const [current, send] = useMachine(machine);
  if (!disabled) send(ACTIONS.ENABLE);
  return (
    <>
      <Debugger
        info={{
          state: current.value,
          event: current.event,
          history: current.historyValue,
        }}
      />
      <button
        onClick={() => send(ACTIONS.PRESS)}
        className={`button-${current.value}`}
        disabled={disabled || current.matches(STATES.SUCCESS)}
        class="bg-red-200"
      >
        {current.matches(STATES.CLICKED) && <span>submitting</span>}
        {current.matches(STATES.SUCCESS) && <span>done</span>}
        {current.matches(STATES.ERROR) && <span>try again</span>}
        {current.matches(STATES.DISABLED) && children}
        {current.matches(STATES.ACTIVE) && children}
      </button>
    </>
  );
};
