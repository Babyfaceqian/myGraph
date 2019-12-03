import React, { useState } from 'react';
import { useDragLayer } from 'react-dnd';

export default function AnchorExtend({ x, y, rotate }) {
  let [isOver, setIsOver] = useState(false);
  let fillOpacity = isOver ? 1 : 0.15;
  // 拖拽当前图形时不显示锚点
  const { item, isDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging()
  }));
  if (isDragging) return null
  return (
    <g cursor={'pointer'} transform={`translate(${x} ${y}) rotate(${rotate})`} fill={'#999'} fillOpacity={fillOpacity} onMouseEnter={() => setIsOver(true)} onMouseLeave={() => setIsOver(false)}>
      <polygon points="0,-2 8,-2 8,-4 14,0 8,4 8,2 0,2" />
    </g>
  )
}