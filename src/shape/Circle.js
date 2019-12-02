import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ShapeTypes } from '../constants';
import { useDragLayer } from 'react-dnd';

function Circle({ type, id, textId, cx, cy, r, fill, fillOpacity, stroke, strokeWidth, strokeOpacity, onClick, onDoubleClick }) {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type, id, textId, r },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging()
      }
    },
    begin: (monitor) => {
      let offset = monitor.getClientOffset() || {};
      return {
        type,
        id,
        textId,
        r,
        ox: offset.x - cx,
        oy: offset.y - cy,
        preview: (offset, item) => {
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          return (<g >
            <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}  ></circle>
          </g>)
        }
      }
    },
    end: (item, monitor) => {
    }
  });
  const { item, isResizing } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isResizing: !!monitor.isDragging()
  }));
  if (isDragging || (isResizing && item.id === id)) return null
  return <g cursor={"move"} onClick={onClick} onDoubleClick={onDoubleClick}>
    <circle ref={dragRef} cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}  ></circle>
  </g>
}

export default Circle;