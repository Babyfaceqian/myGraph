import React from 'react';
import { useDragLayer } from 'react-dnd';
import { ShapeTypes } from '../constants';
export default function DragPreview(props) {
  const { item, itemType, currentOffset, isDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  if (!isDragging || !currentOffset) return null
  switch (itemType) {
    case ShapeTypes.RECTANGLE:
        return item.preview(currentOffset);
    case ShapeTypes.CIRCLE:
      return item.preview(currentOffset);
    case ShapeTypes.ANCHOR:
        return item.preview(currentOffset, item);
    case ShapeTypes.LINE:
        return item.preview(currentOffset, item);
    default:
      return null
  }
}