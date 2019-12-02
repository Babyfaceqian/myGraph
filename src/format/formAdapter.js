import { ShapeTypes } from '../constants';
export function formShapeAdapter(type) {
  let arr = ['fill', 'fillOpacity', 'stroke', 'strokeWidth', 'strokeOpacity'];
  switch (type) {
    case ShapeTypes.RECTANGLE:
      arr = arr.concat([
        'x', 'y', 'rx', 'ry', 'width', 'height']);
      break;
    case ShapeTypes.CIRCLE:
      arr = arr.concat(['cx', 'cy', 'r']);
      break;
    case ShapeTypes.LINE:
      arr = ['stroke', 'strokeWidth', 'strokeOpacity'];
      break;
  }
  // hasText && arr.concat(['fontSize', 'color', 'fontWeight', 'textAlign']);
  return arr;
}
export function formTextAdapter() {
  let arr = ['fontFamily', 'fontSize', 'color', 'fontWeight', 'textAlign', 'lineHeight', 'verticalAlign'];
  return arr;
}