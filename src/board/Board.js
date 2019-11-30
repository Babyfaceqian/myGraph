import React from 'react';
import { useDrop } from 'react-dnd';
import Rectangle from '../shape/Rectangle';
import Circle from '../shape/Circle';
import Text from '../shape/Text';
import Resize from '../common/Resize';
import Line from '../shape/Line';
import { ShapeTypes } from '../constants';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import DragPreview from '../shape/DragPreview';
import { getTextDimension } from '../utils';

function handleShapeClick(e, id, store) {
  console.log('EVENT: handleShapeClick')
  e.stopPropagation();
  store.select([id]);
}
function handleBoardClick(store) {
  store.select([]);
  store.changeMode(0);
}
function handleShapeDoubleClick(e, id, store) {
  e.stopPropagation();
  store.changeMode(2);
}
const Board = inject("store")(observer(({ store }) => {
  const shapes = toJS(store.shapes);
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: Object.values(ShapeTypes),
    drop: (item, monitor) => {
      let type = item.type;
      let offset = monitor.getClientOffset() || {};
      switch (type) {
        case ShapeTypes.RECTANGLE:
          let x = offset.x - item.ox;
          let y = offset.y - item.oy;
          store.modifyShape({
            id: item.id,
            x,
            y
          })
          item.textId && store.modifyShape({
            id: item.textId,
            x,
            y
          })
          break;
        case ShapeTypes.CIRCLE:
          let cx = offset.x - item.ox;
          let cy = offset.y - item.oy;
          store.modifyShape({
            id: item.id,
            cx,
            cy
          })
          if (item.textId) {
            let textDimension = getTextDimension(type)({ cx, cy, r: item.r });
            item.textId && store.modifyShape({
              id: item.textId,
              x: textDimension.x,
              y: textDimension.y
            });
          }
          break;
        case ShapeTypes.ANCHOR:
          return offset;
        case ShapeTypes.LINE:
          let x1 = offset.x - item.ox1;
          let y1 = offset.y - item.oy1;
          let x2 = offset.x - item.ox2;
          let y2 = offset.y - item.oy2;
          store.modifyShape({
            id: item.id,
            x1, y1, x2, y2
          })
        // if (item.textId) {
        //   let textDimension = getTextDimension(type)({ x1,y1,x2,y2 });
        //   item.textId && store.modifyShape({
        //     id: item.textId,
        //     x: textDimension.x,
        //     y: textDimension.y
        //   });
        // }
      }
    },
    collect: monitor => {
      return {
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }
    },
  })

  // 模式
  let mode = store.mode;

  return (
    <svg width="100%" height="100%" ref={drop} onClick={() => handleBoardClick(store)}>
      {Object.keys(shapes).map(key => {
        let shape = shapes[key];
        switch (shape.type) {
          case ShapeTypes.RECTANGLE:
            return <Rectangle key={key} {...shape} onClick={(e) => handleShapeClick(e, key, store)} onDoubleClick={e => handleShapeDoubleClick(e, key, store)} />;
          case ShapeTypes.CIRCLE:
            return <Circle key={key} {...shape} onClick={(e) => handleShapeClick(e, key, store)} onDoubleClick={e => handleShapeDoubleClick(e, key, store)} />;
          case ShapeTypes.TEXT:
            return <Text key={key} {...shape} />;
          case ShapeTypes.LINE:
            return <Line key={key} {...shape} onClick={(e) => handleShapeClick(e, key, store)} />;
        }
      })}
      <Resize />
      <DragPreview />
    </svg>
  );
}))

export default Board;
