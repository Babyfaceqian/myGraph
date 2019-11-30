import React from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import './Edit.css';
import { ShapeTypes } from '../constants';
import { getTextDimension } from '../utils';

const Edit = inject("store")(observer(({ store }) => {
  let mode = store.mode;
  if (mode !== 2) return null
  let selectIds = toJS(store.selectIds);
  if (selectIds.length === 0) return null
  let shapes = toJS(store.shapes);
  let id = selectIds[0];
  let shape = shapes[id];
  let textDimension = getTextDimension(shape.type)(shape);

  let style = {
    left: textDimension.x,
    top: textDimension.y,
    width: textDimension.width,
    height: textDimension.height
  }
  let text;
  if (shape.textId) {
    text = shapes[shape.textId].text;
  }
  const handleFinish = (e) => {
    console.log('handleFinish')
    store.changeMode(0);
    let text = e.target.value;
    if (shape.textId) {
      store.modifyShape({
        id: shape.textId,
        text
      });
    } else {
      store.addShape({
        type: ShapeTypes.TEXT,
        parentId: id,
        text
      });
    }
  }
  console.log(11111111)
  return (
    <textarea className="edit" style={style} onBlur={handleFinish} defaultValue={text}></textarea>
  );
}))

export default Edit;
