
export const getEdgeParams = (source: any, target: any) => {
  const sourceCenter = {
    x: source.positionAbsolute.x + source.width / 2,
    y: source.positionAbsolute.y + source.height / 2,
  };

  const targetCenter = {
    x: target.positionAbsolute.x + target.width / 2,
    y: target.positionAbsolute.y + target.height / 2,
  };

  const { x: sx, y: sy } = sourceCenter;
  const { x: tx, y: ty } = targetCenter;

  return {
    sx,
    sy,
    tx,
    ty,
  };
};
