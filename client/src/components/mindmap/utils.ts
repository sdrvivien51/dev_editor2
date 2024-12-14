
export const getEdgeParams = (source: any, target: any) => {
  const sourceCenter = {
    x: (source.position?.x || 0) + (source.width || 0) / 2,
    y: (source.position?.y || 0) + (source.height || 0) / 2,
  };

  const targetCenter = {
    x: (target.position?.x || 0) + (target.width || 0) / 2,
    y: (target.position?.y || 0) + (target.height || 0) / 2,
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
