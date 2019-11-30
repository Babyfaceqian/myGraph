
import { ShapeTypes } from '../constants';
/**
 * 
 * @param {*} shape 图形数据对象
 */
function getAnchorForRect(shape) {
  let { x, y, width, height } = shape;
  let anchors = [];
  let cx, cy;
  let i = 0;
  cx = x;
  cy = y;
  let wStep = width / 2;
  let hStep = height / 2;
  while (i < 8) {
    if ([1, 2].includes(i)) {
      cx += wStep;
    } else if ([3, 4].includes(i)) {
      cy += hStep;
    } else if ([5, 6].includes(i)) {
      cx -= wStep;
    } else if (7 === i) {
      cy -= hStep;
    }
    anchors[i] = { cx, cy };
    i++;
  }
  return anchors;
}
function getAnchorForCircle(shape) {
  let { cx: x, cy: y, r } = shape;
  let anchors = [];
  let cx, cy;
  let i = 0;
  cx = x - r;
  cy = y - r;
  while (i < 8) {
    if ([1, 2].includes(i)) {
      cx += r;
    } else if ([3, 4].includes(i)) {
      cy += r;
    } else if ([5, 6].includes(i)) {
      cx -= r;
    } else if (7 === i) {
      cy -= r;
    }
    anchors[i] = { cx, cy };
    i++;
  }
  return anchors;
}

function getAnchorForLine(shape) {
  let anchors = [];
  anchors.push({ cx: shape.x1, cy: shape.y1 });
  anchors.push({ cx: shape.x2, cy: shape.y2 });
  return anchors;
}

export function getAnchorPosition(type) {
  switch (type) {
    case ShapeTypes.RECTANGLE:
      return getAnchorForRect;
    case ShapeTypes.CIRCLE:
      return getAnchorForCircle;
    case ShapeTypes.LINE:
      return getAnchorForLine;
  }
}
/**
 * 
 * @param {*} cx 拖拽锚点x轴位置
 * @param {*} cy 拖拽锚点y轴位置
 * @param {*} index 拖拽锚点下标
 * @param {*} shape 图形数据对象
 * @param {*} anchors 锚点集合
 */
function getDimensionForRect(cx, cy, index, shape, anchors) {
  let otherAnchor;
  let x = shape.x;
  let y = shape.y;
  let width = shape.width;
  let height = shape.height;
  if (index > 3) {
    otherAnchor = anchors[index - 4];
  } else {
    otherAnchor = anchors[index + 4];
  }
  if ([0, 2, 4, 6].includes(index)) {
    width = otherAnchor.cx - cx;
    height = otherAnchor.cy - cy;
    x = width < 0 ? otherAnchor.cx : cx;
    y = height < 0 ? otherAnchor.cy : cy;
  } else if ([1, 5].includes(index)) {
    height = otherAnchor.cy - cy;
    y = height < 0 ? otherAnchor.cy : cy;
  } else if ([3, 7].includes(index)) {
    width = otherAnchor.cx - cx;
    x = width < 0 ? otherAnchor.cx : cx;
  }
  width = Math.abs(width);
  height = Math.abs(height);
  return { x, y, width, height }
}
/**
 * 
 * @param {*} cx 拖拽锚点x轴位置
 * @param {*} cy 拖拽锚点y轴位置
 * @param {*} index 拖拽锚点下标
 * @param {*} shape 拖拽图形数据对象
 * @param {*} anchors 锚点集合
 */
function getDimensionForCircle(cx, cy, index, shape, anchors) {
  let otherAnchor;
  let _cx = shape.cx;
  let _cy = shape.cy;
  let r;
  let dx, dy;
  if (index > 3) {
    otherAnchor = anchors[index - 4];
  } else {
    otherAnchor = anchors[index + 4];
  }

  dx = otherAnchor.cx - cx;
  dy = otherAnchor.cy - cy;
  if (Math.abs(dx) > Math.abs(dy)) {
    r = Math.abs(dx) / 2;
  } else {
    r = Math.abs(dy) / 2;
  }

  if ([0, 2, 4, 6].includes(index)) {
    _cx = dx > 0 ? otherAnchor.cx - r : otherAnchor.cx + r;
    _cy = dy > 0 ? otherAnchor.cy - r : otherAnchor.cy + r;
  } else if ([1, 5].includes(index)) {
    _cy = dy > 0 ? otherAnchor.cy - r : otherAnchor.cy + r;
  } else if ([3, 7].includes(index)) {
    _cx = dx > 0 ? otherAnchor.cx - r : otherAnchor.cx + r;
  }
  return { cx: _cx, cy: _cy, r }
}
function getDimensionForLine(cx, cy, index, shape, anchors) {
  let x1, y1, x2, y2;
  if (0 === index) {
    x1 = cx;
    y1 = cy;
    x2 = shape.x2;
    y2 = shape.y2;
  } else {
    x1 = shape.x1;
    y1 = shape.y1;
    x2 = cx;
    y2 = cy;
  }
  return { x1, y1, x2, y2 };
}
/**
 * 
 * @param {*} type 根据类型返回处理函数
 */
export function getDimensionWhenResize(type) {
  switch (type) {
    case ShapeTypes.RECTANGLE:
      return getDimensionForRect;
    case ShapeTypes.CIRCLE:
      return getDimensionForCircle;
    case ShapeTypes.LINE:
      return getDimensionForLine;
  }
}
function getTextDimensionInRect({ x, y, height, width }) {
  return { x, y, height, width };
}
function getTextDimensionInCircle({ cx, cy, r }) {
  let dx = Math.sin(Math.PI * 0.25) * r;
  let width, height;
  width = height = dx * 2;
  let x = cx - dx;
  let y = cy - dx;
  return { x, y, height, width };
}
/**
 * 
 * @param {*} type 根据类型返回处理函数
 */
export function getTextDimension(type) {
  switch (type) {
    case ShapeTypes.RECTANGLE:
      return getTextDimensionInRect;
    case ShapeTypes.CIRCLE:
      return getTextDimensionInCircle;
  }
}