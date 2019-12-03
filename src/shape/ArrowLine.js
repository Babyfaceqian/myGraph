import React from 'react';
import { useDragLayer, useDrag } from 'react-dnd';
import { getPathByPoints, getTextDimension, getPointsWithPre, getDimensionWhenResize, getResizeAnchorPosition } from '../utils';
import AnchorResize from './AnchorResize';
export default function ArrowLine(props) {
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
  let anchors = getResizeAnchorPosition(type)(props);
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
      {
        isSelected && anchors.map((placement, i) => {
          let { cx, cy, pre } = placement;
          const preview = function (offset, item) {
            let cx = offset.x - item.ox;
            let cy = offset.y - item.oy;
            let changes = getDimensionWhenResize(type)(cx, cy, i, props, anchors);
            let newProps = { ...props, ...changes };
            let newAnchors = getResizeAnchorPosition(type)(newProps);
            let { points, id, stroke, strokeWidth, strokeOpacity } = newProps;
            let d = getPathByPoints(points);
            return (
              [
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
                    markerEnd={`url(#arrow-${id})`}
                  />
                </g>
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