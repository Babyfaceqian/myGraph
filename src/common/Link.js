import React from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { ShapeTypes } from '../constants';
import AnchorResize from '../shape/anchorResize';
import { getLinkAnchorPosition } from '../utils';
import { useDragLayer } from 'react-dnd'
import AnchorLink from '../shape/AnchorLink';
const rotateMap = [-90, 0, 90, 180];
const Link = inject("store")(observer(({ store }) => {
  let highlightId = store.highlightId;
  if (!highlightId) return null;
  let shapes = toJS(store.shapes);
  let shape = shapes[highlightId];
  let anchors = getLinkAnchorPosition(shape.type)(shape);
  return anchors.map((d, i) => {
    return (
      <AnchorLink x={d.cx} y={d.cy} rotate={rotateMap[i]} />
    )
  })
}))

export default Link;