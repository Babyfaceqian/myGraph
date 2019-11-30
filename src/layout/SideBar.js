import React from 'react';

import './SideBar.css';
function SideBar({ placement, children }) {
  let placementCls = placement === 'right' ? 'right' : 'left'
  return (
      <div className={`sideBar ${placementCls}`}>
        {children}
      </div>
  )
}
export default SideBar;
