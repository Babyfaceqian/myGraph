import React from 'react';
import { useDragLayer } from 'react-dnd';
import { ShapeTypes } from '../constants';
export default function DragPreview(props) {
  const { item, itemType, currentOffset, isDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging()
  }))

  if (!isDragging || !currentOffset) return null
  return item.preview(currentOffset, item);
}