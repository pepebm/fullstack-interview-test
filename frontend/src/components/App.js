import React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { Grid } from '@material-ui/core';

import Navbar from './Navbar/Navbar';

import GetBranches from './Branches/GetBranches';
import ListBranches from './Branches/ListBranches';

import GetCommit from './Commit/GetCommit';

import CreatePR from './PR/CreatePR';
import GetPR from './PR/GetPR';
import ListPR from './PR/ListPR';

import './App.css';
import 'fontsource-roboto';

function App() {
  return (
    <Switch>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={12}>
          <Navbar />
          <Route exact path="/" render={() => <ListBranches/>} />
          <Route exact path="/branches/:name" render={() => <GetBranches/>} />
          <Route exact path="/pr" render={() => <ListPR/>} />
          <Route exact path="/pr/view/:number" render={() => <GetPR/>} />
          <Route exact path="/pr/create" render={() => <CreatePR/>} />
        </Grid>
      </Grid>
    </Switch>
  );
}

export default withRouter(App);
