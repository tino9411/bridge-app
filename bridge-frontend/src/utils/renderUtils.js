//renderUtils.js
// Desc: This file contains utility functions for rendering components
export const conditionalRender = (condition, component) => {
    if (!condition) return null;
    return component;
  };
  