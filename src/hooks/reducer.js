import { ShapeTypes } from '../constants';
import uuid from 'uuid/v4';
import _ from 'lodash';

export const ADD_SHAPE = 'addShape';
export const MOVE_SHAPE = 'moveShape';
export function initBoard(initialState) {
  return {
    shapes: {}, board: {}
  };
}
export function boardReducer(state = {}, action) {
  
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case ADD_SHAPE:
      switch (action.payload.type) {
        case ShapeTypes.RECTANGLE:
          let shapes = newState.shapes;
          shapes[uuid()] = action.payload;
          return newState;
      }
    case MOVE_SHAPE:
      switch (action.payload.type) {
        case ShapeTypes.RECTANGLE:

          break;
      }
      return state;
    case 'reset':
      return initBoard(action.payload);
    default:
      throw new Error();
  }
}
