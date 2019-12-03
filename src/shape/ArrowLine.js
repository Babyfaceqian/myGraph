import React from 'react';
import { useDragLayer, useDrag } from 'react-dnd';
import { getPathByPoints } from '../utils';
export default function ArrowLine({ type, id, textId, points, stroke, strokeWidth, strokeOpacity, onClick }) {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type, id, textId },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging()
      }
    },
    begin: (monitor) => {
      let beginOffset = monitor.getClientOffset() || {};
      return {
        type,
        id,
        textId,
        points,
        beginOffset,
        preview: (offset, item) => {
          let points = item.points;
          let dx = offset.x - item.beginOffset.x;
          let dy = offset.y - item.beginOffset.y;
          let newPoints = points.map(d => {
            return {
              x: d.x + dx,
              y: d.y + dy
            }
          });
          let d = getPathByPoints(newPoints);
          return (
            <g>
              <defs>
                <marker id={`arrow-${id}`} markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth" fill={stroke} fillOpacity={strokeOpacity}> <path d="M0,0 L0,6 L9,3 z" /> </marker>
              </defs>
              <path
                d={d}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                fill={'none'}
                markerEnd={`url(#arrow-${item.id})`}
              />
            </g>
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
  let d = getPathByPoints(points);
  return (
    <g cursor={"move"} onClick={onClick} ref={dragRef}>
      <defs>
        <marker id={`arrow-${id}`} markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth" fill={stroke} fillOpacity={strokeOpacity}> <path d="M0,0 L0,6 L9,3 z" /> </marker>
      </defs>
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        fill={'none'}
        markerEnd={`url(#arrow-${id})`}
      />
    </g >
  )
}