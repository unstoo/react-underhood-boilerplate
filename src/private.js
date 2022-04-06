/* eslint-disable no-param-reassign */
import PRIMITIVE_ELEMENT from "./const";

const isProp = name => name !== "children" && !name.startsWith("on");
const isListener = name => name.startsWith("on");
const getKeys = object => Object.keys(object || {});
const getProps = object => getKeys(object).filter(isProp);
const getListeners = object => getKeys(object).filter(isListener);
const addProps = (dom, props) => {
  getListeners(props).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  });
  getProps(props).forEach(key => {
    dom[key] = props[key];
  });
};
const removeProps = (dom, props) => {
  getListeners(props).forEach(eventType => {
    dom.removeEventListener(eventType, props[eventType]);
  });
  getProps(props).forEach(key => {
    dom[key] = null;
  });
};
const updateProps = (dom, oldProps, newProps) => {
  removeProps(dom, oldProps);
  addProps(dom, newProps);
};

const reconcileChildren = (prevInstance, element) => {
  const parent = prevInstance.dom;
  const childInstances = prevInstance?.childInstances || [];
  const childElements = element?.props?.children || [];
  const maxCount = Math.max(childElements.length, childInstances.length);
  const reconciledInstances = [];
  for (let i = 0; i < maxCount; i += 1) {
    // eslint-disable-next-line no-use-before-define
    const childInstance = reconcile(
      parent,
      childInstances[i],
      childElements[i]
    );
    reconciledInstances.push(childInstance);
  }

  return reconciledInstances.filter(instance => instance !== null);
};
function instantiate(element) {
  if (element.type === PRIMITIVE_ELEMENT) {
    const dom = document.createTextNode("");
    dom.nodeValue = element.props.nodeValue;

    return {
      element,
      dom
    };
  }
  if (typeof element.type === "string") {
    const dom = document.createElement(element.type);
    addProps(dom, element.props);
    const children = element.props.children || [];
    const childInstances = children.map(child => instantiate(child));
    childInstances.forEach(child => dom.appendChild(child.dom));

    return {
      dom,
      childInstances,
      element
    };
  }

  const { type: Component, props } = element;
  const instance = {};
  const component = new Component(props);
  component.innerInstance = instance;
  const childElement = component.render();
  const childInstance = instantiate(childElement);

  Object.assign(instance, {
    component,
    dom: childInstance.dom,
    element,
    childInstance
  });

  return instance;
}

export default function reconcile(parent, prevInstance, element) {
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
    updateProps(prevInstance.dom, prevInstance.element.props, element.props);
    const reconciled = reconcileChildren(prevInstance, element);
    prevInstance.childInstances = reconciled;
    prevInstance.element = element;
    return prevInstance;
  }

  const { dom, component, childInstance: prevChildInstance } = prevInstance;
  component.props = element.props;
  const newChildElement = component.render();
  const newChildInstance = reconcile(
    dom.parentNode,
    prevChildInstance,
    newChildElement
  );
  prevInstance.dom = newChildInstance?.dom || null;
  prevInstance.childInstance = newChildInstance;
  return prevInstance;
}
