import OwnReact from "../src";
import List, { getData } from "./List";

const root = document.getElementById("root");

const renderApp = data => {
  // eslint-disable-next-line react/no-deprecated
  OwnReact.render(List(data), root);
};
renderApp(getData());
setInterval(() => {
  renderApp(getData());
}, 5000);
