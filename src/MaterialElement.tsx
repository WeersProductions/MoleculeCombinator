import * as React from "react";
import { DragSource } from "react-dnd";
import ItemTypes from "./ItemTypes";

const style = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.5rem 1rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  cursor: "move",
  float: "left"
};

const boxSource = {
  beginDrag(props: any) {
    return {
      name: props.name,
      imageURL: props.imageURL
    };
  },

  endDrag(props: any, monitor: any) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      if (dropResult.box) {
        var found = dropResult.box.state.materialElements.find(
          (element: any) => {
            return element.name == item.name;
          }
        );
        if (found) {
          var newMaterials = dropResult.box.state.materialElements;
          found.count += 1;
          dropResult.box.setState({ materialElements: newMaterials });
        } else {
          dropResult.box.setState({
            materialElements: [
              ...dropResult.box.state.materialElements,
              { name: item.name, imageURL: item.imageURL, count: 1 }
            ]
          });
        }
        dropResult.box.checkRecipe();
      }

      // console.log(`You dropped ${item.name} into ${dropResult.name}!`);
    }
  }
};

export interface IMaterialElementProps extends React.Props<MaterialElement> {
  connectDragSource?: Function;
  isDragging?: boolean;
  name: string;
  imageURL: string;
}

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export class MaterialElement extends React.Component<
  IMaterialElementProps,
  any
> {
  render() {
    const { isDragging, connectDragSource, imageURL } = this.props;
    const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
      <div style={{ ...style, opacity }}>
        <div>{name}</div>
        <img style={{ maxWidth: "100px" }} src={imageURL} />
      </div>
    );
  }
}
