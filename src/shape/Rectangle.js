import React, { useState } from 'react';
import { useDrag, useDragLayer } from 'react-dnd';
import { ShapeTypes } from '../constants';
import AnchorResize from '../shape/AnchorResize';
import { getDimensionWhenResize, getTextDimension, getResizeAnchorPosition, getLinkAnchorPosition } from '../utils';
import AnchorExtend from './AnchorExtend';
const cursorMap = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];
const rotateMap = [-90, 0, 90, 180];
function Rectangle(props) {
  let { type, id, textId, x, y, rx, ry, fill, fillOpacity, width, height, stroke, strokeWidth, strokeOpacity, onClick, onDoubleClick, store, isSelected } = props;
  const [isMouseEnter, setMouseEnter] = useState(false);
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

  if (isDragging || (isAnyDragging && item.id === id)) return null;

  let resizeAnchors = getResizeAnchorPosition(type)({ x, y, width, height });
  let linkAnchors = getLinkAnchorPosition(type)({ x, y, width, height });
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


  return <g ref={dragRef} cursor={"move"} onClick={onClick} onDoubleClick={onDoubleClick} onMouseEnter={() => setMouseEnter(true)} >
    <rect x={x} y={y} rx={rx} ry={ry} width={width} height={height} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}  ></rect>
    {
      isSelected && resizeAnchors.map((placement, i) => {
        let { cx, cy } = placement;
        const preview = function (offset, item) {
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          let changes = getDimensionWhenResize(type)(cx, cy, i, props, resizeAnchors);

          let newProps = { ...props, ...changes };
          let newAnchors = getResizeAnchorPosition(type)(newProps);
          let { x, y, rx, ry, width, height, fill, stroke, fillOpacity, strokeWidth, strokeOpacity } = newProps;
          return (
            [
              <rect x={x} y={y} rx={rx} ry={ry} width={width} height={height} fill={fill} stroke={stroke} fillOpacity={fillOpacity} strokeWidth={strokeWidth} strokeOpacity={strokeOpacity}></rect>
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

export default Rectangle;