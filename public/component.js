import { h } from "preact";

export const HydratedText = ({value}) => {
  return h("p", {}, value);
};
