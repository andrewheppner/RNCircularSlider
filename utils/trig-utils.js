export const calculateAngleFromXAxis = (cx, cy, radius, point) => {
  const zeroPoint = { x: cx + radius, y: cy };
  let angle =
    Math.atan2(point.y - zeroPoint.y, point.x - zeroPoint.x) * (180 / Math.PI);
  if (angle < 0) {
    angle += 360;
  }
  return angle;
};

// degrees = degrees from x-axis moving in counter-clockwise
export const calculatePointOnCircle = (cx, cy, radius, degrees) => {
  const radians = degrees * (Math.PI / 180);
  const newPoint = {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
  return newPoint;
};
