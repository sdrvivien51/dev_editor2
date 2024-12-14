import { Node, Edge } from '@xyflow/react';

interface ClosestNode {
  distance: number;
  node: Node | null;
}

export function getClosestEdge(
  node: Node,
  nodes: Node[],
  minDistance: number
): Edge | null {
  const closestNode = nodes.reduce<ClosestNode>(
    (closest, targetNode) => {
      if (targetNode.id !== node.id) {
        const dx = targetNode.position.x - node.position.x;
        const dy = targetNode.position.y - node.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < closest.distance && distance < minDistance) {
          return {
            distance,
            node: targetNode
          };
        }
      }
      return closest;
    },
    { distance: Number.MAX_VALUE, node: null }
  );

  if (!closestNode.node) return null;

  return {
    id: `${node.id}-${closestNode.node.id}`,
    source: node.id,
    target: closestNode.node.id,
    type: 'floating',
  } as Edge;
}
