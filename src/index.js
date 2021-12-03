import "./styles.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "./button";
import { Button as XButton } from "./button-xstate";
import { Button as URButton } from "./button-usereducer-simple";
import { Button as URAButton } from "./button-usereducer-adv";

function App() {
  const [data, setData] = useState(null);
  let effectCount = 0;

  async function submitWithChance() {
    return new Promise((resolve, reject) => {
      effectCount++;
      console.log(effectCount);
      setTimeout(() => (Math.random() < 0.5 ? reject() : resolve()), 1000);
    });
  }
  return (
    <div className="poc">
      <label>
        <span>Type something to enable the buttons </span>
        <input
          type="text"
          name="username"
          onChange={(evt) => setData(evt.target.value)}
        />
      </label>
      <div>
        <Button
          submit={submitWithChance}
          disabled={data === null || data === ""}
        >
          Submit
        </Button>
        <URButton
          className="button-disabled"
          submit={submitWithChance}
          disabled={data === null || data === ""}
        >
          Simple reducer submit
        </URButton>
        <URAButton
          className="button-disabled"
          submit={submitWithChance}
          disabled={data === null || data === ""}
        >
          Adv reducer submit
        </URAButton>
        <XButton
          className="button-disabled"
          submit={submitWithChance}
          disabled={data === null || data === ""}
        >
          Xstate submit
        </XButton>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
