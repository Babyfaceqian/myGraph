import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ShapeTypes } from '../constants';
import { useDragLayer } from 'react-dnd';
import AnchorResize from './AnchorResize';
import { getDimensionWhenResize, getTextDimension, getLinkAnchorPosition, getResizeAnchorPosition } from '../utils';
import AnchorExtend from './AnchorExtend';
const cursorMap = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
const rotateMap = [-90, 0, 90, 180];
function Circle(props) {
  const { type, id, textId, cx, cy, r, fill, fillOpacity, stroke, strokeWidth, strokeOpacity, onClick, onDoubleClick, onMouseEnter, store, isSelected } = props;
  const [isMouseEnter, setMouseEnter] = useState(false);
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

  let resizeAnchors = getResizeAnchorPosition(type)(props);
  let linkAnchors = getLinkAnchorPosition(type)(props);

  const onDrop = function (cx, cy, index) {
    let changes = getDimensionWhenResize(type)(cx, cy, index, props, resizeAnchors);
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
  return <g cursor={"move"} onClick={onClick} onDoubleClick={onDoubleClick} onMouseEnter={() => setMouseEnter(true)}>
    <circle ref={dragRef} cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}  ></circle>
    {
      isSelected && resizeAnchors.map((placement, i) => {
        let { cx, cy } = placement;
        const preview = function (offset, item) {
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          let changes = getDimensionWhenResize(type)(cx, cy, i, props, resizeAnchors);

          let newProps = { ...props, ...changes };
          let newAnchors = getResizeAnchorPosition(type)(newProps);
          let { cx: x, cy: y, r, fill, stroke, fillOpacity, strokeWidth, strokeOpacity } = newProps;
          return (
            [
              <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}></circle>
            ].concat(newAnchors.map((placement, i) => {
              let { cx, cy } = placement;
              return (
                <g cursor={cursorMap[i]}>
                  <circle cx={cx} cy={cy} r={5} fill={"blue"} fillOpacity={0.5}></circle>
                </g>
              )
            })
            ))
        };
        return (
          <AnchorResize key={i} id={id} cursor={cursorMap[i]} cx={cx} cy={cy} onDrop={(cx, cy) => onDrop(cx, cy, i)} preview={preview} />
        )
      })
    }
    {
      isMouseEnter && linkAnchors.map((d, i) => {
        return (
          <AnchorExtend x={d.cx} y={d.cy} rotate={rotateMap[i]} />
        )
      })
    }
  </g>
}

export default Circle;