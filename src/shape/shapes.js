import { ShapeTypes } from '../constants';
function getRectangle() {
  return {
    type: null,
    id: null,
    textId: null,
    x: 100,
    y: 100,
    rx: 0,
    ry: 0,
    fill: '#FFFFFF',
    fillOpacity: 1,
    width: 100,
    height: 60,
    stroke: '#000000',
    strokeWidth: 1,
    strokeOpacity: 1,
  }
}

function getCircle() {
  return {
    type: null,
    id: null,
    textId: null,
    cx: 100,
    cy: 100,
    r: 40,
    fill: '#FFFFFF',
    fillOpacity: 1,
    stroke: '#000000',
    strokeWidth: 1,
    strokeOpacity: 1,
  }
}

function getText() {
  return {
    type: null,
    id: null,
    parentId: null,
    x: 100,
    y: 100,
    width: 100,
    height: 60,
    text: '文本',
    fontFamily: 'Comic Sans MS',
    fontSize: 12,
    color: '#000000',
    fontWeight: 'normal',
    textAlign: 'center',
    lineHeight: 1.5,
    verticalAlign: 'middle'
  }
}

function getLine() {
  return {
    type: null,
    id: null,
    points: [{ x: 100, y: 100, pre: false }, { x: 150, y: 150, pre: true }, { x: 200, y: 200, pre: false }],
    fontSize: 12,
    stroke: '#000000',
    strokeWidth: 1,
    strokeOpacity: 1,
  }
}

function getArrowLine() {
  return {
    type: null,
    id: null,
    x1: 100,
    y1: 100,
    x2: 200,
    y2: 200,
    text: '文本',
    fontSize: 12,
    stroke: '#000000',
    strokeWidth: 1,
    strokeOpacity: 1,
  }
}

export function getShape(type) {
  switch (type) {
    case ShapeTypes.RECTANGLE:
      return getRectangle;
    case ShapeTypes.CIRCLE:
      return getCircle;
    case ShapeTypes.TEXT:
      return getText;
    case ShapeTypes.LINE:
      return getLine;
    case ShapeTypes.ARROW_LINE:
      return getArrowLine
  }
}