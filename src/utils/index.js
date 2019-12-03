
import { ShapeTypes } from '../constants';
/**
 * 
 * @param {*} shape 图形数据对象
 */
function getResizeAnchorForRect(shape) {
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
function getResizeAnchorForCircle(shape) {
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

function getResizeAnchorForLine(shape) {
  let anchors = shape.points.map(d => {
    return {
      cx: d.x,
      cy: d.y,
      pre: d.pre
    };
  })
  return anchors;
}

function getResizeAnchorForArrowLine(shape) {
  let anchors = shape.points.map(d => {
    return {
      cx: d.x,
      cy: d.y,
      pre: d.pre
    };
  })
  return anchors;
}

export function getResizeAnchorPosition(type) {
  switch (type) {
    case ShapeTypes.RECTANGLE:
      return getResizeAnchorForRect;
    case ShapeTypes.CIRCLE:
      return getResizeAnchorForCircle;
    case ShapeTypes.LINE:
      return getResizeAnchorForLine;
    case ShapeTypes.ARROW_LINE:
      return getResizeAnchorForArrowLine;
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
  let points = shape.points;
  let newPoints = points.map((d, i) => {
    let pre = d.pre;
    let x = d.x;
    let y = d.y;
    if (index === i) {
      x = cx;
      y = cy;
      pre = false;
      return { x, y, pre };
    }
    if (pre) {
      let prevPoint = index === i - 1 ? { x: cx, y: cy } : points[i - 1];
      let nextPoint = index === i + 1 ? { x: cx, y: cy } : points[i + 1];
      x = (prevPoint.x + nextPoint.x) / 2;
      y = (prevPoint.y + nextPoint.y) / 2;
    }
    return { x, y, pre };
  })
  return { points: newPoints };
}

function getDimensionForArrowLine(cx, cy, index, shape, anchors) {
  let points = shape.points;
  let newPoints = points.map((d, i) => {
    let pre = d.pre;
    let x = d.x;
    let y = d.y;
    if (index === i) {
      x = cx;
      y = cy;
      pre = false;
      return { x, y, pre };
    }
    if (pre) {
      let prevPoint = index === i - 1 ? { x: cx, y: cy } : points[i - 1];
      let nextPoint = index === i + 1 ? { x: cx, y: cy } : points[i + 1];
      x = (prevPoint.x + nextPoint.x) / 2;
      y = (prevPoint.y + nextPoint.y) / 2;
    }
    return { x, y, pre };
  })
  return { points: newPoints };
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
    case ShapeTypes.ARROW_LINE:
      return getDimensionForArrowLine;
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

/**
 * 
 * @param {*} shape 图形数据对象
 */
function getLinkAnchorForRect(shape) {
  let { x, y, width, height } = shape;
  let anchors = [];
  let halfWidth = width / 2;
  let halfHeight = height / 2;
  anchors[0] = {
    cx: x + halfWidth,
    cy: y - 10
  };
  anchors[1] = {
    cx: x + width + 10,
    cy: y + halfHeight
  };
  anchors[2] = {
    cx: x + halfWidth,
    cy: y + height + 10
  };
  anchors[3] = {
    cx: x - 10,
    cy: y + halfHeight
  };
  return anchors;
}
function getLinkAnchorForCircle(shape) {
  let { cx: x, cy: y, r } = shape;
  let anchors = [];
  anchors[0] = {
    cx: x,
    cy: y - r - 10
  };
  anchors[1] = {
    cx: x + r + 10,
    cy: y
  };
  anchors[2] = {
    cx: x,
    cy: y + r + 10
  };
  anchors[3] = {
    cx: x - r - 10,
    cy: y
  };
  return anchors;
}

function getLinkAnchorForLine(shape) {
  let anchors = [];
  anchors.push({ cx: shape.x1, cy: shape.y1 });
  anchors.push({ cx: shape.x2, cy: shape.y2 });
  return anchors;
}

export function getLinkAnchorPosition(type) {
  switch (type) {
    case ShapeTypes.RECTANGLE:
      return getLinkAnchorForRect;
    case ShapeTypes.CIRCLE:
      return getLinkAnchorForCircle;
    case ShapeTypes.LINE:
      return getLinkAnchorForLine;
  }
}

export function getPathByPoints(points) {
  let path = '';
  let length = points.length;
  points.forEach((p, i) => {
    if (0 === i) {
      path += `M${p.x} ${p.y}`;
    } else {
      path += ` L${p.x} ${p.y}`;
    }
    // if (length === i) {
    //   path += ' Z'
    // }
  });
  return path;
}

export function getPointsByPath(path) {
  let str = path.replace(/[a-zA-Z]/g, '');
  str = path.replace(/[\s]*/g, ' ');
  let arr = str.split(' ');
  let points = [];
  arr.forEach((d, i) => {
    let index = parseInt(i / 2);
    let property = i % 2 === 0 ? 'x' : 'y';
    if (!points[index]) {
      points[index] = {};
    }
    points[index][property] = d;
  });
  return points;
}

export function getPointsWithPre(points) {
  points = points.filter(d => !d.pre);
  let newPoints = [];
  points.reduce((prev, cur) => {
    if (prev) {
      newPoints.push({
        x: (prev.x + cur.x) / 2,
        y: (prev.y + cur.y) / 2,
        pre: true
      });
    }
    newPoints.push({
      x: cur.x,
      y: cur.y
    });
    return cur;
  }, null);
  console.log('newPoints', newPoints);
  return newPoints;
}