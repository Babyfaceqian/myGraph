import React from 'react';
import { useDragLayer, useDrag } from 'react-dnd';
import { getPathByPoints } from '../utils';
import AnchorResize from './AnchorResize';
import { getDimensionWhenResize, getTextDimension, getResizeAnchorPosition, getPointsWithPre } from '../utils';
export default function Line(props) {
  const { type, id, textId, points, stroke, strokeWidth, strokeOpacity, onClick, store, isSelected } = props;
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
            <path
              d={d}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
              fill={'none'}
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
  let anchors = getResizeAnchorPosition(type)(props);
  let d = getPathByPoints(points);
  const onDrop = function (cx, cy, index) {
    let changes = getDimensionWhenResize(type)(cx, cy, index, props, anchors);
    changes.points = getPointsWithPre(changes.points);
    store.modifyShape({ id, ...changes });
    // 文本
    if (textId) {
      let textDimension = getTextDimension(type)(changes);
      store.modifyShape({
        id: textId,
        x: textDimension.x,
        y: textDimension.y,
        width: textDimension.width,
        height: textDimension.height,
      });
    }
  }
  return (
    <g cursor={"move"} onClick={onClick} ref={dragRef}>
      <path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        fill={'none'}
      />
      {
        isSelected && anchors.map((placement, i) => {
          let { cx, cy, pre } = placement;
          const preview = function (offset, item) {
            let cx = offset.x - item.ox;
            let cy = offset.y - item.oy;
            let changes = getDimensionWhenResize(type)(cx, cy, i, props, anchors);
            let newProps = { ...props, ...changes };
            let newAnchors = getResizeAnchorPosition(type)(newProps);
            let { points, stroke, strokeWidth, strokeOpacity } = newProps;
            let d = getPathByPoints(points);
            return (
              [
                <path
                  d={d}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  fill={'none'}
                />
              ].concat(newAnchors.map((placement, i) => {
                let { cx, cy, pre } = placement;
                let fillOpacity = pre ? 0.15 : 0.5;
                return (
                  <g cursor={'pointer'}>
                    <circle cx={cx} cy={cy} r={5} fill={"blue"} fillOpacity={fillOpacity}></circle>
                  </g>
                )
              })
              ))
          };
          return (
            <AnchorResize key={i} id={id} cursor={'pointer'} cx={cx} cy={cy} onDrop={(cx, cy) => onDrop(cx, cy, i)} preview={preview} pre={pre} />
          )
        })
      }
    </g >
  )
}