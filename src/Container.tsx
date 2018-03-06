import * as React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { CombinationField } from "./CombinationField";

export class Container extends React.Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowX: "hidden"
          }}
        >
          <CombinationField />
        </div>
      </DragDropContextProvider>
    );
  }
}
