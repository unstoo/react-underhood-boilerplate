import OwnReact from "../src";
import Component from "../src/Component";

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.onInputHandler = this.onInputHandler.bind(this);
  }

  onInputHandler(e) {
    const { changeHandler } = this.props;
    changeHandler(new Set(e.target.value.split("")));
  }

  render() {
    return <input type="text" onInput={this.onInputHandler} />;
  }
}
