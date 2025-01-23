export const CONFIG = {
  urls: {},
  inputs: {},
  selectors: {
    id: {
      format: "#ElementId",
    },
    tags: {
      containerAndChildTag: "container div",
      containerDirectChild: "container > div",
    },
    class: {
      class: ".ClassName",
      containerAndChildWithClass: "container .childClass",
      containerAndChildWithTagAndClass: "container div.childClass",
      containerWithClassAndChildWithTagAndClass:
        "container.containerClass div.childClass",
    },
    attribute: {
      attribute: "[attribute=value]",
      containerAndChildWithAttribute: "container [attribute=value]",
      containerWithAttributeAndChildTag: "container[attribute=value] div",
      containerWithAttributeAndChildTagWithAttribute:
        "container[attribute=value] div[attribute=value]",
    },
  },
} as const;
