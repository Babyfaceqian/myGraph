import React from 'react';
import { useDrag } from 'react-dnd';
import { ShapeTypes } from '../constants';
import { useDragLayer } from 'react-dnd';

function Rectangle({ type, id, textId, x, y, rx, ry, fill, fillOpacity, width, height, stroke, strokeWidth, strokeOpacity, onClick, onDoubleClick, onMouseEnter }) {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type, id, textId },
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
        ox: offset.x - x,
        oy: offset.y - y,
        preview: (offset, item) => {
          let x = offset.x - item.ox;
          let y = offset.y - item.oy;
          return (<g>
            <rect x={x} y={y} rx={rx} ry={ry} width={width} height={height} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}  ></rect>
          </g>)
        }
      }
    },
    end: (item, monitor) => {
      // if (monitor.didDrop()) {
      //   let result = monitor.getDropResult();
      //   
      // }
    }
  });
  const { item, isAnyDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isAnyDragging: !!monitor.isDragging()
  }));

  if (isDragging || (isAnyDragging && item.id === id)) return null
  return <g ref={dragRef} cursor={"move"} onClick={onClick} onDoubleClick={onDoubleClick} onMouseEnter={onMouseEnter}>
    <rect x={x} y={y} rx={rx} ry={ry} width={width} height={height} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}  ></rect>
  </g>
}

export default Rectangle;