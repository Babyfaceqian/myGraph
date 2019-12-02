import { observable, action, runInAction } from 'mobx';
import uuid from 'uuid/v4';
import { ShapeTypes } from '../constants'
import { getShape } from '../shape/shapes';
import { getTextDimension } from '../utils';
export default class Store {
  @observable shapes = {};
  @observable board = {};
  @observable selectIds = [];
  @observable highlightId = null;
  @observable mode = 0;

  /**
   * 
   * @param {*} payload 添加图形
   */
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
      case ShapeTypes.ARROW_LINE:
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
  /**
   * 
   * @param {*} payload 修改图形
   */
  @action.bound
  modifyShape(payload) {
    this.shapes[payload.id] = { ...this.shapes[payload.id], ...payload }
  }
  /**
   * 
   * @param {*} ids 选中图形
   */
  @action.bound
  select(ids) {
    this.selectIds = ids;
  }
  /**
   * 
   * @param {*} mode 修改模式
   * 0 - 画布模式
   * 1 - 图形模式
   * 2 - 文本模式
   */
  @action.bound
  changeMode(mode) {
    this.mode = mode;
  }
  /**
   * 
   * @param {*} ids id数组
   */
  @action.bound
  deleteShape(ids) {
    ids.forEach(id => {
      let textId = this.shapes[id].textId;
      if (textId) {
        delete this.shapes[textId];
      }
      delete this.shapes[id];
    })
  }
  @action.bound
  highlight(id) {
    this.highlightId = id;
  }
}