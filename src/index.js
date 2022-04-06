/* eslint-disable max-classes-per-file */
/* eslint-disable no-use-before-define */
import Component from "./Component";
import PRIMITIVE_ELEMENT from "./const";
import reconcile from "./private";

const createPrimitiveElement = primitive => ({
  type: PRIMITIVE_ELEMENT,
  props: {
    nodeValue: primitive
  }
});
const isPrimitiveElement = el => {
  const type = typeof el;
  return !!["number", "string", "boolean"].includes(type);
};
const unwrapArray = arr => {
  const flat = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      flat.push(...item);
    } else {
      flat.push(item);
    }
  });
  return flat;
};

let rootInstance = null;
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

OwnReact.Component = Component;

export default OwnReact;
