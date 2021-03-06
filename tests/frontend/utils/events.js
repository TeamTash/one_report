export const createBubbledEvent = (type, props = {}) => {
  const event = new Event(type, {bubbles: true});
  Object.assign(event, props);
  return event;
};

function createClientXY(x, y) {
  return {clientX: x, clientY: y};
}

export function createStartTouchEventObject({x = 0, y = 0}) {
  return {touches: [createClientXY(x, y)]};
}

export function createMoveTouchEventObject({x = 0, y = 0}) {
  return {changedTouches: [createClientXY(x, y)]};
}
