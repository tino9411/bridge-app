export const conditionalRender = (condition, component) => {
    if (!condition) return null;
    return component;
  };
  