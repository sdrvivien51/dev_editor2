import { Position } from '@xyflow/react';

function getNodeIntersection(intersectionNode: any, targetNode: any) {
  const sourceWidth = intersectionNode?.width || 0;
  const sourceHeight = intersectionNode?.height || 0;
  const sourcePos = intersectionNode?.position || { x: 0, y: 0 };
  const targetPos = targetNode?.position || { x: 0, y: 0 };
  const targetWidth = targetNode?.width || 0;
  const targetHeight = targetNode?.height || 0;

  // Calculate center points
  const sourceCenter = {
    x: sourcePos.x + sourceWidth / 2,
    y: sourcePos.y + sourceHeight / 2,
  };
  const targetCenter = {
    x: targetPos.x + targetWidth / 2,
    y: targetPos.y + targetHeight / 2,
  };

  // Calculate angle between centers
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  const angle = Math.atan2(dy, dx);

  // Calculate intersection points
  const halfWidth = sourceWidth / 2;
  const halfHeight = sourceHeight / 2;
  
  let x = sourceCenter.x;
  let y = sourceCenter.y;

  // Determine intersection point based on angle
  if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
    // Intersects with left or right
    const sign = Math.cos(angle) >= 0 ? 1 : -1;
    x = sourceCenter.x + sign * halfWidth;
    y = sourceCenter.y + Math.tan(angle) * sign * halfWidth;
  } else {
    // Intersects with top or bottom
    const sign = Math.sin(angle) >= 0 ? 1 : -1;
    y = sourceCenter.y + sign * halfHeight;
    x = sourceCenter.x + (sign * halfHeight) / Math.tan(angle);
  }

  return { x, y };
}

function getEdgePosition(node: any, intersectionPoint: { x: number; y: number }) {
  const n = { ...node.measured, ...node.internals.positionAbsolute };
  const threshold = 5;

  if (Math.abs(intersectionPoint.x - n.x) <= threshold) {
    return Position.Left;
  }
  if (Math.abs(intersectionPoint.x - (n.x + n.width)) <= threshold) {
    return Position.Right;
  }
  if (Math.abs(intersectionPoint.y - n.y) <= threshold) {
    return Position.Top;
  }
  if (Math.abs(intersectionPoint.y - (n.y + n.height)) <= threshold) {
    return Position.Bottom;
  }

  return Position.Right;
}

export function getEdgeParams(source: any, target: any) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
