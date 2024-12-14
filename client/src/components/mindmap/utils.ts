import { Position, Node } from '@xyflow/react';

function getNodeIntersection(node: Node, targetNode: Node) {
  // Get node dimensions
  const nodeWidth = node.width || 150;
  const nodeHeight = node.height || 40;
  
  // Calculate center points
  const sourceX = node.position.x + nodeWidth / 2;
  const sourceY = node.position.y + nodeHeight / 2;
  const targetX = targetNode.position.x + (targetNode.width || 150) / 2;
  const targetY = targetNode.position.y + (targetNode.height || 40) / 2;

  // Calculate the angle between the centers
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx);

  // Find intersection point
  let intersectionX = sourceX;
  let intersectionY = sourceY;

  if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
    // Intersect with left or right side
    const sign = Math.cos(angle) >= 0 ? 1 : -1;
    intersectionX = sourceX + sign * (nodeWidth / 2);
    intersectionY = sourceY + Math.tan(angle) * sign * (nodeWidth / 2);
  } else {
    // Intersect with top or bottom side
    const sign = Math.sin(angle) >= 0 ? 1 : -1;
    intersectionY = sourceY + sign * (nodeHeight / 2);
    intersectionX = sourceX + (sign * nodeHeight / 2) / Math.tan(angle);
  }

  return { x: intersectionX, y: intersectionY };
}

function getEdgePosition(node: Node, intersectionPoint: { x: number; y: number }) {
  const nodeX = node.position.x;
  const nodeY = node.position.y;
  const nodeWidth = node.width || 150;
  const nodeHeight = node.height || 40;
  const threshold = 5;

  if (Math.abs(intersectionPoint.x - nodeX) <= threshold) {
    return Position.Left;
  }
  if (Math.abs(intersectionPoint.x - (nodeX + nodeWidth)) <= threshold) {
    return Position.Right;
  }
  if (Math.abs(intersectionPoint.y - nodeY) <= threshold) {
    return Position.Top;
  }
  if (Math.abs(intersectionPoint.y - (nodeY + nodeHeight)) <= threshold) {
    return Position.Bottom;
  }

  return Position.Right;
}

export function getEdgeParams(source: Node, target: Node) {
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
