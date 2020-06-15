import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, 
  TableRow,
  Paper,
  Button
} from '@material-ui/core';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import LoopIcon from '@material-ui/icons/Loop';

import backend from '../../utils/backend';


class ListBranches extends Component {

  constructor(props) {
    super(props);

    this.state = {
      branches: []
    };
  }

  getBranches = async () => {
    const res = await backend.listBranches();
    if (res.branches) {
      this.setState({ branches: res.branches })
    } else {
      console.error(res.error);
    }
  }

  componentDidMount() {
    this.getBranches();
  }

  render(){
    const { branches } = this.state;

    return(
      <TableContainer component={Paper}>
        <Table aria-label="Branch table">
          <TableHead>
            <TableRow>
              <TableCell>Branch Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.length > 0 ?
              branches.map((branch) => (
                <TableRow key={branch}>
                  <TableCell component="th" scope="row">
                    {branch}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" endIcon={<FindInPageIcon/>}>
                      <Link to={`/branches/${branch}`} style={{textDecoration: 'none'}}>
                        See Commits
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : 
              <TableRow>
                <TableCell>
                  Loading Data <LoopIcon style={{fontSize: 12}}/> Check logs for possible errors.
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withRouter(ListBranches);