/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const PRIMITIVE_ELEMENT = "PRIMITIVE_ELEMENT";
const createPrimitiveElement = text => ({
  type: PRIMITIVE_ELEMENT,
  props: {
    nodeValue: text
  }
});
const isPrimitiveElement = el => {
  const type = typeof el;
  return !!["number", "string", "boolean"].includes(type);
};
const unwrapArray = arr => (Array.isArray(arr[0]) ? arr[0] : arr);

const reconcileChildren = (prevInstance, element) => {
  const parent = prevInstance.dom;
  const childInstances = prevInstance?.childInstances || [];
  const childElements = element?.props?.children || [];
  const maxCount = Math.max(childElements.length, childInstances.length);
  const reconciledInstances = [];
  for (let i = 0; i < maxCount; i += 1) {
    const childInstance = reconcile(
      parent,
      childInstances[i],
      childElements[i]
    );
    reconciledInstances.push(childInstance);
  }

  return reconciledInstances.filter(instance => instance !== null);
};

const isProp = name => name !== "children" && !name.startsWith("on");
const isListener = name => name.startsWith("on");
const getKeys = object => Object.keys(object || {});
const addProps = (dom, props) => {
  getKeys(props)
    .filter(isListener)
    .forEach(eventType => {
      dom.removeEventListener(eventType, props[eventType]);
    });
  getKeys(props)
    .filter(isProp)
    .forEach(key => {
      dom[key] = props[key];
    });
};
const removeProps = (dom, props) => {
  getKeys(props)
    .filter(isListener)
    .forEach(eventType => {
      dom.addEventListener(eventType, props[eventType]);
    });
  getKeys(props)
    .filter(isProp)
    .forEach(key => {
      dom[key] = null;
    });
};
const updateProps = (dom, oldProps, newProps) => {
  removeProps(dom, oldProps);
  addProps(dom, newProps);
};

let rootInstance = null;

function instantiate(element) {
  if (element.type === PRIMITIVE_ELEMENT) {
    const dom = document.createTextNode("");
    dom.nodeValue = element.props.nodeValue;

    return {
      element,
      dom
    };
  }

  const dom = document.createElement(element.type);
  const children = element.props.children || [];
  const childInstances = children.map(child => instantiate(child));
  childInstances.forEach(child => dom.appendChild(child.dom));

  return {
    dom,
    childInstances,
    element
  };
}

function reconcile(parent, prevInstance, element) {
  if (prevInstance == null) {
    const newInstance = instantiate(element);
    parent.appendChild(newInstance.dom);
    return newInstance;
  }
  if (!element) {
    parent.removeChild(prevInstance.dom);
    return null;
  }
  if (element.type !== prevInstance.element.type) {
    const newInstance = instantiate(element);
    parent.replaceChild(newInstance.dom, prevInstance.dom);
    return newInstance;
  }
  if (element.type === PRIMITIVE_ELEMENT) {
    prevInstance.element.props = element.props;
    prevInstance.dom.nodeValue = element.props.nodeValue;
    return prevInstance;
  }
  if (typeof element.type === "string") {
    updateProps(prevInstance, element);
    const reconciled = reconcileChildren(prevInstance, element);
    prevInstance.childInstances = reconciled;
    prevInstance.element = element;
  }
  return prevInstance;
}
class OwnReact {
  static createElement(type, props, ...children) {
    const elements = children.map(el => {
      return isPrimitiveElement(el) ? createPrimitiveElement(el) : el;
    });
    return {
      type,
      props: { ...props, children: unwrapArray(elements) }
    };
  }

  static render(element, parent) {
    const prevInstance = rootInstance;
    const newInstance = reconcile(parent, prevInstance, element);
    rootInstance = newInstance;
  }
}

export default OwnReact;
