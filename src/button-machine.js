import { Machine } from "xstate";

// using TS with Xstate makes the below "ENUMS" unncessary, it would be provided by Xstate
export const ACTIONS = {
  PRESS: "PRESS",
  ENABLE: "ENABLE",
  DONE: "DONE",
  ERROR: "ERROR",
};
export const STATES = {
  DISABLED: "disabled",
  CLICKED: "clicked",
  ACTIVE: "active",
  PRESSED: "pressed",
  SUCCESS: "success",
  ERROR: "retry",
};

export const buttonMachine = (onSubmit) =>
  Machine(
    {
      id: "submitButtonWithTransitions",
      initial: "disabled",
      states: {
        active: {
          on: {
            HOVER: "hovered",
            PRESS: "pressed",
            CLICK: "clicked",
            DISABLE: "disabled",
            FOCUS: "focused",
          },
        },
        disabled: {
          on: {
            ENABLE: "active",
          },
        },
        hovered: {
          on: {
            HOVEROFF: "active",
            PRESS: "pressed",
          },
        },
        pressed: {
          on: {
            "": "clicked",
          },
        },
        clicked: {
          invoke: {
            id: "asyncFn",
            src: "asyncFn",
            onDone: "success",
            onError: "retry",
          },
        },
        focused: {
          on: {
            PRESS: "pressed",
            BLUR: "active",
          },
        },
        success: {
          type: "final",
        },
        retry: {
          on: {
            HOVER: "hovered",
            PRESS: "pressed",
            CLICK: "clicked",
            DISABLE: "disabled",
            FOCUS: "focused",
          },
        },
      },
    },
    {
      services: {
        asyncFn: onSubmit,
      },
    }
  );
