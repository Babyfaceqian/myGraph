import React from 'react';
import { useDragLayer } from 'react-dnd';
import './Text.css';
export default function Text({ type, id, parentId, x, y, width, height, text, fontSize, color, fontWeight, textAlign, lineHeight, verticalAlign }) {
  const { item, isDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isDragging: !!monitor.isDragging()
  }));
  
  if (isDragging && item.id === parentId) return null;
  // 上下对齐
  let justifyContent = verticalAlign === 'middle' ? 'center' : (verticalAlign === 'top' ? 'flex-start' : 'flex-end');
  return (
    <g style={{ pointerEvents: 'none' }}>
      <foreignObject x={x} y={y} width={width} height={height}>
        <div xmlns="http://www.w3.org/1999/xhtml" className="textWrapper" style={{
          justifyContent
        }}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{
            fontSize,
            color,
            fontWeight,
            textAlign,
            lineHeight
          }}>
            {text}
          </div>
        </div>
      </foreignObject>
    </g>
  )
}