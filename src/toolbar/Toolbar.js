import React from 'react';
import { inject, observer } from "mobx-react";
import './Toolbar.css';
import { ShapeTypes } from '../constants';
const Toolbar = inject("store")(observer(({ store }) => {
  const addShape = function (type) {
    store.addShape({
      type
    })
  }
  return (
    <div className="toolbar">
      <button onClick={() => addShape(ShapeTypes.RECTANGLE)}>矩形</button>
      <button onClick={() => addShape(ShapeTypes.CIRCLE)}>圆形</button>
      <button onClick={() => addShape(ShapeTypes.LINE)}>直线</button>
    </div>
  )
}))
export default Toolbar;