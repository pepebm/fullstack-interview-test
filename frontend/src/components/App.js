import React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import GetBranches from './Branches/GetBranches';
import ListBranches from './Branches/ListBranches';

import GetCommit from './Commit/GetCommit';

import CreatePR from './PR/CreatePR';
import GetPR from './PR/GetPR';
import ListPR from './PR/ListPR';

import './App.css';

function App() {
  return (
    <Switch>
      <Route path="/" render={() => <ListBranches/>} />
      <Route path="/branches/:number" render={() => <ListBranches/>} />
      <Route path="/commits/" render={() => <GetCommit/>} />
      <Route path="/pr" render={() => <ListPR/>} />
      <Route path="/pr/:number" render={() => <GetPR/>} />
      <Route path="/pr/create" render={() => <CreatePR/>} />
    </Switch>
  );
}

export default App;
