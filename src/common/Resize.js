import React from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { ShapeTypes } from '../constants';
import AnchorResize from '../shape/anchorResize';
import { getResizeAnchorPosition, getDimensionWhenResize, getTextDimension, getPathByPoints, getPointsWithPre } from '../utils';
import { useDragLayer } from 'react-dnd'

const cursorMap = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize'];

const Resize = inject("store")(observer(({ store }) => {
  const selectIds = toJS(store.selectIds);
  const shapes = toJS(store.shapes);
  const { item, isDragging } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isDragging: !!monitor.isDragging()
  }))
  if (selectIds.length === 0) return null
  let shape = shapes[selectIds[0]];
  let shapeType = shape.type;
  let id = shape.id;
  let anchors = getResizeAnchorPosition(shapeType)(shape);
  const onDrop = function (cx, cy, type, index) {
    let changes = getDimensionWhenResize(type)(cx, cy, index, shape, anchors);
    console.log('changes', changes);
    if ([ShapeTypes.LINE, ShapeTypes.ARROW_LINE].includes(type)) {
      changes.points = getPointsWithPre(changes.points);
    }
    store.modifyShape({ id, ...changes });
    // 文本
    if (shape.textId) {
      let textDimension = getTextDimension(shapeType)(changes);
      store.modifyShape({
        id: shape.textId,
        x: textDimension.x,
        y: textDimension.y,
        width: textDimension.width,
        height: textDimension.height,
      });
    }
  }

  if (!!isDragging && item.id === id) return null
  switch (shapeType) {
    case ShapeTypes.RECTANGLE:
      return anchors.map((placement, i) => {
        let { cx, cy } = placement;
        const preview = function (offset, item) {
          console.log('preview offset', offset);
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          let changes = getDimensionWhenResize(shapeType)(cx, cy, i, shape, anchors);

          let newShape = { ...shape, ...changes };
          let newAnchors = getResizeAnchorPosition(shapeType)(newShape);
          let { x, y, rx, ry, width, height, fill, stroke, fillOpacity, strokeWidth, strokeOpacity } = newShape;
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
          <AnchorResize key={i} id={id} cursor={cursorMap[i]} cx={cx} cy={cy} onDrop={(cx, cy) => onDrop(cx, cy, ShapeTypes.RECTANGLE, i)} preview={preview} />
        )
      });
    case ShapeTypes.CIRCLE:
      return anchors.map((placement, i) => {
        let { cx, cy } = placement;
        const preview = function (offset, item) {
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          let changes = getDimensionWhenResize(shapeType)(cx, cy, i, shape, anchors);

          let newShape = { ...shape, ...changes };
          let newAnchors = getResizeAnchorPosition(shapeType)(newShape);
          let { cx: x, cy: y, r, fill, stroke, fillOpacity, strokeWidth, strokeOpacity } = newShape;
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
          <AnchorResize key={i} id={id} cursor={cursorMap[i]} cx={cx} cy={cy} onDrop={(cx, cy) => onDrop(cx, cy, ShapeTypes.CIRCLE, i)} preview={preview} />
        )
      })
    case ShapeTypes.LINE:
      return anchors.map((placement, i) => {
        let { cx, cy, pre } = placement;
        const preview = function (offset, item) {
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          let changes = getDimensionWhenResize(shapeType)(cx, cy, i, shape, anchors);
          let newShape = { ...shape, ...changes };
          let newAnchors = getResizeAnchorPosition(shapeType)(newShape);
          let { points, stroke, strokeWidth, strokeOpacity } = newShape;
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
          <AnchorResize key={i} id={id} cursor={'pointer'} cx={cx} cy={cy} onDrop={(cx, cy) => onDrop(cx, cy, ShapeTypes.LINE, i)} preview={preview} pre={pre} />
        )
      });
    case ShapeTypes.ARROW_LINE:
      return anchors.map((placement, i) => {
        let { cx, cy, pre } = placement;
        const preview = function (offset, item) {
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          let changes = getDimensionWhenResize(shapeType)(cx, cy, i, shape, anchors);
          let newShape = { ...shape, ...changes };
          let newAnchors = getResizeAnchorPosition(shapeType)(newShape);
          let { points, id, stroke, strokeWidth, strokeOpacity } = newShape;
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
                  markerEnd={`url(#arrow-${newShape.id})`}
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
          <AnchorResize key={i} id={id} cursor={'pointer'} cx={cx} cy={cy} onDrop={(cx, cy) => onDrop(cx, cy, ShapeTypes.LINE, i)} preview={preview} pre={pre} />
        )
      });
  }
}))

export default Resize;