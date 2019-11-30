import React from 'react';
import { useDragLayer, useDrag } from 'react-dnd';
export default function Text({ type, id, textId, x1, y1, x2, y2, stroke, strokeWidth, strokeOpacity, onClick }) {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type, id, textId },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging()
      }
    },
    begin: (monitor) => {
      let offset = monitor.getClientOffset() || {};
      let ox1 = offset.x - x1;
      let oy1 = offset.y - y1;
      let ox2 = offset.x - x2;
      let oy2 = offset.y - y2;
      return {
        type,
        id,
        textId,
        ox1,
        oy1,
        ox2,
        oy2,
        x1, y1, x2, y2,
        preview: (offset, item) => {
          let x2 = offset.x + item.x2 - item.x1;
          let y2 = offset.y + item.y2 - item.y1;
          let x1 = offset.x;
          let y1 = offset.y;
          return (
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
            />
          )
        }
      }
    },
    end: (item, monitor) => {
    }
  })
  const { item, isResizing } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isResizing: !!monitor.isDragging()
  }));
  if (isDragging || (isResizing && item.id === id)) return null
  if (isDragging) return null;
  return (
    <g cursor={"move"} onClick={onClick} ref={dragRef}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
      />
    </g >
  )
}