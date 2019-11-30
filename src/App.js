import React from 'react';
import './App.css';
import Container from './layout/Container';
import { DndProvider } from 'react-dnd';
import MouseBackEnd from 'react-dnd-mouse-backend'
import Board from './board/Board';
import Toolbar from './toolbar/Toolbar';
import SideBar from './layout/SideBar';
import Content from './layout/Content';
import { observer, inject } from 'mobx-react';
import Format from './format/Format';
import { toJS } from 'mobx';
import Edit from './common/Edit';

const App = inject("store")(observer(({ store }) => {
  let selectIds = toJS(store.selectIds);
  return (
    <DndProvider backend={MouseBackEnd}>
      <div className="app">
        <Container>
          <SideBar placement="left">
            <Toolbar />
          </SideBar>
          <Content>
            <Board />
          </Content>
          <SideBar placement="right">
            {selectIds.length > 0 && <Format />}
          </SideBar>
        </Container>
        <Edit />
      </div>
    </DndProvider>
  );
}))

export default App;
