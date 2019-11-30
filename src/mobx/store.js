import { observable, action, runInAction } from 'mobx';
import uuid from 'uuid/v4';
import { ShapeTypes } from '../constants'
import { getShape } from '../shape/shapes';
import { getTextDimension } from '../utils';
export default class Store {
  @observable shapes = {};
  @observable board = {};
  @observable selectIds = [];
  /**
   * 0 - 画布模式
   * 1 - 图形模式
   * 2 - 文本模式
   */
  @observable mode = 0;

  @action.bound
  addShape(payload) {

    let id = uuid();
    let obj;
    let type = payload.type;
    switch (type) {
      case ShapeTypes.RECTANGLE:
        obj = getShape(type)();
        break;
      case ShapeTypes.CIRCLE:
        obj = getShape(type)();
        break;
      case ShapeTypes.TEXT:
        obj = getShape(type)();
        let parentId = payload.parentId;
        let parent = this.shapes[parentId];
        parent.textId = id;
        let textDimension = getTextDimension(parent.type)(parent);
        obj = { ...obj, ...textDimension };
        break;
      case ShapeTypes.LINE:
        obj = getShape(type)();
        break;
    }
    this.shapes[id] = { ...obj, ...payload, id };
  }
  // @action.bound
  // moveShape(payload) {
  //   let shape = this.shapes[payload.id];
  //   switch (shape.type) {
  //     case ShapeTypes.RECTANGLE:
  //       shape.x = payload.x;
  //       shape.y = payload.y;
  //       break;
  //     case ShapeTypes.CIRCLE:
  //       shape.cx = payload.cx;
  //       shape.cy = payload.cy;
  //       break;
  //     case ShapeTypes.TEXT:
  //       shape.x = payload.x;
  //       shape.y = payload.y;
  //       break;
  //   }
  // }
  @action.bound
  modifyShape(payload) {
    this.shapes[payload.id] = { ...this.shapes[payload.id], ...payload }
  }
  @action.bound
  select(ids) {
    this.selectIds = ids;
  }
  @action.bound
  changeMode(mode) {
    this.mode = mode;
  }
}