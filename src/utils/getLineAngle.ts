const getLineAngle = (a, b) => {
  return (180 / Math.PI) * Math.atan2(a, b);
};

export default getLineAngle;
