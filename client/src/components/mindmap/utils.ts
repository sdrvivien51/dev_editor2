import { Position, Node } from '@xyflow/react';

interface NodeWithPosition extends Node {
  position: {
    x: number;
    y: number;
  };
  width?: number;
  height?: number;
}

function getNodeIntersection(intersectionNode: NodeWithPosition, targetNode: NodeWithPosition) {
  const width = intersectionNode.width || 50;
  const height = intersectionNode.height || 50;
  const position = intersectionNode.position;
  const targetPosition = targetNode.position;

  const w = width / 2;
  const h = height / 2;

  const x2 = position.x + w;
  const y2 = position.y + h;
  const x1 = targetPosition.x + (targetNode.width || 50) / 2;
  const y1 = targetPosition.y + (targetNode.height || 50) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

function getEdgePosition(node: NodeWithPosition, intersectionPoint: { x: number; y: number }) {
  const position = node.position;
  const width = node.width || 50;
  const height = node.height || 50;

  const nx = Math.round(position.x);
  const ny = Math.round(position.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= ny + height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

export function getEdgeParams(source: NodeWithPosition, target: NodeWithPosition) {
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
