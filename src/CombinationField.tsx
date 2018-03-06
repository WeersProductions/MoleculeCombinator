import * as React from "react";
import { DropTarget } from "react-dnd";
import ItemTypes from "./ItemTypes";
import { MaterialElement } from "./MaterialElement";

const style = {
  height: "80%",
  width: "100%",
  marginBottom: "1rem",
  color: "white",
  padding: "1rem"
};

let box: any = null;

const boxTarget = {
  drop() {
    return { name: "Combinator", box };
  }
};

interface ICombinationFieldProps extends React.Props<CombinationField> {
  connectDropTarget?: Function;
  isOver?: boolean;
  canDrop?: boolean;
  materialElements?: Array<MaterialData>;
}

interface MaterialData {
  name: string;
  imageURL: string;
  count: number;
}

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export class CombinationField extends React.Component<
  ICombinationFieldProps,
  any
> {
  constructor(props) {
    super(props);

    box = this;

    this.state = { materialElements: [] };
  }

  removeElement(element: MaterialData) {
    return () => {
      this.setState({
        materialElements: this.state.materialElements.filter(
          (e: MaterialData) => e !== element
        )
      });
    };
  }

  renderElement(element: MaterialData) {
    return (
      <div key={element.name} onClick={this.removeElement(element)}>
        <img style={{ maxWidth: "100px" }} src={element.imageURL} />
        <div>{element.count}</div>
      </div>
    );
  }

  renderMaterial(element: MaterialData) {
    return (
      <div>
        <MaterialElement name={element.name} imageURL={element.imageURL} />
      </div>
    );
  }

  checkRecipe(): any {
    var data: Array<MaterialData> = this.state.materialElements;
    if (this.hasElement(data, "Water", 2)) {
      this.removeElements(data, "Water", 2);
      data = this.addElement(
        data,
        "Deuterium",
        1,
        "https://image.ibb.co/daLqf7/h2.png"
      );
      this.energy += 3.02;
    }
    if (
      this.hasElement(data, "Water", 1) &&
      this.hasElement(data, "Deuterium", 1)
    ) {
      this.removeElements(data, "Water", 1);
      this.removeElements(data, "Deuterium", 1);
      data = this.addElement(
        data,
        "Helium",
        1,
        "https://image.ibb.co/bKwVf7/He3.png"
      );
      this.energy += 1.56;
    }
    if (this.hasElement(data, "Deuterium", 2)) {
      this.removeElements(data, "Deuterium", 2);
      data = this.addElement(
        data,
        "Tritium",
        1,
        "https://image.ibb.co/cbwCcn/h3.png"
      );
      this.energy += 4.23;
    }
    if (this.hasElement(data, "Helium", 2)) {
      this.removeElements(data, "Helium", 2);
      data = this.addElement(
        data,
        "Water",
        2,
        "https://image.ibb.co/kAoMnn/h1.png"
      );
      data = this.addElement(
        data,
        "Helium4",
        1,
        "https://image.ibb.co/mErwL7/He4.png"
      );
      this.energy += 1.23;
    }
    if (this.hasElement(data, "Tritium", 2)) {
      this.removeElements(data, "Tritium", 2);
      data = this.addElement(
        data,
        "Helium4",
        1,
        "https://image.ibb.co/mErwL7/He4.png"
      );
      this.energy += 2.123;
    }
    if (
      this.hasElement(data, "Helium", 1) &&
      this.hasElement(data, "Tritium", 1)
    ) {
      this.removeElements(data, "Helium", 1);
      this.removeElements(data, "Helium", 1);
      data = this.addElement(
        data,
        "Helium4",
        1,
        "https://image.ibb.co/mErwL7/He4.png"
      );
      this.energy += 4.34;
    }

    if (
      this.hasElement(data, "Deuterium", 1) &&
      this.hasElement(data, "Tritium", 1)
    ) {
      this.removeElements(data, "Deuterium", 1);
      this.removeElements(data, "Tritium", 1);
      this.addElement(
        data,
        "Helium4",
        1,
        "https://image.ibb.co/mErwL7/He4.png"
      );
      this.energy += 3.23;
    }

    this.setState({ materialElements: data });

    if (Math.abs(this.energy - 19.733) < 0.1) {
      this.finished = true;
      this.forceUpdate();
    }
  }

  finished = false;

  hasElement(data: Array<MaterialData>, name: string, amount: number): boolean {
    var found = data.find((element: any) => {
      return element.name == name && element.count >= amount;
    });
    if (found) {
      return true;
    } else {
      return false;
    }
  }

  removeElements(data: Array<MaterialData>, name: string, amount: number) {
    var found = data.find((element: any) => {
      return element.name == name;
    });
    if (!found) {
      return;
    }
    if (found.count > amount) {
      found.count -= amount;
    } else {
      var index = data.indexOf(found);
      if (index > -1) {
        data.splice(index, 1);
      }
    }
  }

  addElement(
    data: Array<MaterialData>,
    name: string,
    amount: number,
    imageURL: string
  ): Array<MaterialData> {
    var found1 = data.find((element: any) => {
      return element.name == name;
    });
    var result;
    if (found1) {
      found1.count += amount;
      result = [...data];
    } else {
      result = [...data, { name: name, imageURL: imageURL, count: amount }];
    }

    var found = this.unlockedMaterials.find((element: MaterialData) => {
      return element.name == name;
    });
    if (!found) {
      this.unlockedMaterials = [
        ...this.unlockedMaterials,
        { name: name, imageURL: imageURL, count: 1 }
      ];
    }
    return result;
  }

  unlockedMaterials: Array<MaterialData> = [
    { name: "Water", imageURL: "https://image.ibb.co/ccCstS/h1.png", count: 1 }
  ];

  energy = 0;

  render() {
    if (this.finished) {
      return <div>52.238917, 6.862944</div>;
    }

    const { canDrop, isOver, connectDropTarget } = this.props;
    const { materialElements } = this.state;
    const isActive = canDrop && isOver;

    let backgroundColor = "#222";
    if (isActive) {
      backgroundColor = "darkgreen";
    } else if (canDrop) {
      backgroundColor = "darkkhaki";
    }

    const elements: Array<JSX.Element> = [];
    if (materialElements) {
      materialElements.forEach((value: MaterialData) => {
        elements.push(this.renderElement(value));
      });
    }

    const materials: Array<JSX.Element> = [];
    if (this.unlockedMaterials) {
      this.unlockedMaterials.forEach((value: MaterialData) => {
        materials.push(this.renderMaterial(value));
      });
    }

    return connectDropTarget(
      <div style={{ ...style }}>
        <div style={{ color: "black" }}>Current: {this.energy} MeV</div>
        <div style={{ ...style, backgroundColor }}>
          <div style={{ marginBottom: "50px" }}>
            {isActive ? "Release to drop" : "Drag an element here"}
          </div>
          <div>{elements}</div>
        </div>
        <div>{materials}</div>
      </div>
    );
  }
}
