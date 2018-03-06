import * as React from "react";
import { render } from "react-dom";
import { Container } from "./Container";

const styles = {
  fontFamily: "Mina",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <div style={{ fontSize: "1.5rem", margin: "5px" }}>Get 19.733 MeV</div>
    <Container />
  </div>
);

render(<App />, document.getElementById("root"));
