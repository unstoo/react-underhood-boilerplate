import reconcile from "./private";

export default class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    const { innerInstance } = this;
    const parentDom = innerInstance.dom.parentNode;
    const newInstance = reconcile(
      parentDom,
      innerInstance,
      innerInstance.element
    );
    this.innerInstance = newInstance;
  }
}
