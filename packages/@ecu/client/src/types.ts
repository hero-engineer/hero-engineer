export type EcuType = {
  hoveredIndex: string;
  dragIndex: string;
  dragHoveredIndex: string;
  dragRect: DOMRect;
  dragMousePosition: { x: number; y: number };
  createEditorId: () => number
}
