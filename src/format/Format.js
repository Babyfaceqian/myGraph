import React from 'react';
import { toJS } from 'mobx';
import { inject, observer } from "mobx-react";
import './Format.css';
import { formShapeAdapter, formTextAdapter } from './formAdapter';
const Format = inject("store")(observer(({ store }) => {
  let selectIds = toJS(store.selectIds);
  let shapes = toJS(store.shapes);
  let shape = shapes[selectIds[0]];
  let id = shape.id;
  let type = shape.type;

  const handleShapeChange = function (e, key) {
    store.modifyShape({
      id,
      [key]: e.target.value
    });
  }
  let shapeConfig = formShapeAdapter(type);
  // 文本
  let textId = shape.textId;
  let textObj = textId ? shapes[textId] : [];
  const handleTextChange = function (e, key) {
    store.modifyShape({
      id: textId,
      [key]: e.target.value
    });
  }
  let textConfig = textId ? formTextAdapter() : [];
  return (
    <div className="format">
      {/* 图形 */}
      {shapeConfig.includes('x') && <span className="inlineBox">
        <label>x：</label><input type="number" onChange={(e) => handleShapeChange(e, 'x')} value={shape.x} />
      </span>}
      {shapeConfig.includes('y') && <span className="inlineBox">
        <label>y：</label><input type="number" onChange={(e) => handleShapeChange(e, 'y')} value={shape.y} />
      </span>}
      {shapeConfig.includes('cx') && <span className="inlineBox">
        <label>cx：</label><input type="number" onChange={(e) => handleShapeChange(e, 'cx')} value={shape.cx} />
      </span>}
      {shapeConfig.includes('cy') && <span className="inlineBox">
        <label>cy：</label><input type="number" onChange={(e) => handleShapeChange(e, 'cy')} value={shape.cy} />
      </span>}
      {shapeConfig.includes('r') && <span className="inlineBox">
        <label>r：</label><input type="number" onChange={(e) => handleShapeChange(e, 'r')} value={shape.r} />
      </span>}
      {shapeConfig.includes('height') && <span className="inlineBox">
        <label>高度：</label><input type="number" onChange={(e) => handleShapeChange(e, 'height')} value={shape.height} />
      </span>}
      {shapeConfig.includes('width') && <span className="inlineBox">
        <label>宽度：</label><input type="number" onChange={(e) => handleShapeChange(e, 'width')} value={shape.width} />
      </span>}
      {shapeConfig.includes('rx') && <span className="inlineBox">
        <label>rx：</label><input type="number" onChange={(e) => handleShapeChange(e, 'rx')} value={shape.rx} />
      </span>}
      {shapeConfig.includes('ry') && <span className="inlineBox">
        <label>ry：</label><input type="number" onChange={(e) => handleShapeChange(e, 'ry')} value={shape.ry} />
      </span>}
      {shapeConfig.includes('fill') && <span className="inlineBox">
        <label>填充：</label><input type="color" onChange={(e) => handleShapeChange(e, 'fill')} value={shape.fill} />
      </span>}
      {shapeConfig.includes('fillOpacity') && <span className="inlineBox">
        <label>透明度：</label><input type="range" max={1} min={0} step={0.05} onChange={(e) => handleShapeChange(e, 'fillOpacity')} value={shape.fillOpacity} />
      </span>}
      {shapeConfig.includes('stroke') && <span className="inlineBox">
        <label>边框色：</label><input type="color" onChange={(e) => handleShapeChange(e, 'stroke')} value={shape.stroke} />
      </span>}
      {shapeConfig.includes('strokeWidth') && <span className="inlineBox">
        <label>边框粗细：</label><input type="number" min={0} step={1} onChange={(e) => handleShapeChange(e, 'strokeWidth')} value={shape.strokeWidth} />
      </span>}
      {shapeConfig.includes('strokeOpacity') && <span className="inlineBox">
        <label>透明度：</label><input type="range" max={1} min={0} step={0.05} onChange={(e) => handleShapeChange(e, 'strokeOpacity')} value={shape.strokeOpacity} />
      </span>}
      {/* 字体 */}
      {textConfig.includes('fontSize') && <span className="inlineBox">
        <label>字体大小：</label><input type="number" min={5} step={1} onChange={(e) => handleTextChange(e, 'fontSize')} value={textObj.fontSize} />
      </span>}
      {textConfig.includes('color') && <span className="inlineBox">
        <label>字体颜色：</label><input type="color" onChange={(e) => handleTextChange(e, 'color')} value={textObj.color} />
      </span>}
      {textConfig.includes('fontWeight') && <span className="inlineBox">
        <label>字重：</label><input onChange={(e) => handleTextChange(e, 'fontWeight')} value={textObj.fontWeight} />
      </span>}
      {textConfig.includes('textAlign') && <span className="inlineBox">
        <label>左右对齐：</label><select onChange={(e) => handleTextChange(e, 'textAlign')} value={textObj.textAlign}>
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
        </select>
      </span>}
      {textConfig.includes('verticalAlign') && <span className="inlineBox">
        <label>上下对齐：</label><select onChange={(e) => handleTextChange(e, 'verticalAlign')} value={textObj.verticalAlign}>
          <option value="top">top</option>
          <option value="middle">middle</option>
          <option value="bottom">bottom</option>
        </select>
      </span>}
      {textConfig.includes('lineHeight') && <span className="inlineBox">
        <label>行高：</label><input type="number" min={0} step={0.1} onChange={(e) => handleTextChange(e, 'lineHeight')} value={textObj.lineHeight} />
      </span>}
      {textConfig.includes('fontFamily') && <span className="inlineBox">
        <label>行高：</label><select onChange={(e) => handleTextChange(e, 'fontFamily')} value={textObj.fontFamily}>
          <option value="Helvetica">Helvetica</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Garamond">Garamond</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Lucida Console">Lucida Console</option>
          <option value="Tahoma">Tahoma</option>
        </select>
      </span>}
    </div>
  )
}))
export default Format;