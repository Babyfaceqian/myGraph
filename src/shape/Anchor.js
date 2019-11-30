import React from 'react';
import { useDrag } from 'react-dnd';
import { ShapeTypes } from '../constants';
import { useDragLayer } from 'react-dnd';

export default function Anchor({ cx, cy, r = 5, onDrop, cursor, preview, id }) {

  const [{ }, dragRef] = useDrag({
    item: { type: ShapeTypes.ANCHOR, id },
    collect: (monitor) => {
      // 
      // let offset = monitor.getClientOffset() || {};
      // return {
      //   dx: offset.x,
      //   dy: offset.y
      // }
      return {};
    },
    begin: (monitor) => {
      let offset = monitor.getClientOffset() || {};
      return {
        type: ShapeTypes.ANCHOR,
        id,
        ox: offset.x - cx,
        oy: offset.y - cy,
        preview
      }
    },
    end: (item, monitor) => {
      
      if (monitor.didDrop()) {
        let offset = monitor.getDropResult();
        let _cx = offset.x - item.ox;
        let _cy = offset.y - item.oy;
        onDrop(_cx, _cy);
      }
    }
  });
  // 拖拽当前图形时不显示锚点
  const { item, itemType, isDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    // currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));
  if (itemType !== ShapeTypes.ANCHOR && isDragging && item.id === id) return null
  return (
    <g cursor={cursor}>
      <circle ref={dragRef} cx={cx} cy={cy} r={r} fill={"blue"} fillOpacity={0.5}></circle>
    </g>
  )
}