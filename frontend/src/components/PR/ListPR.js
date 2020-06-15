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


class ListPR extends Component {
  
  state = {
    branchName: this.props.match.params.name.replace("-", "/"),
    branch: this.props.location.state.branch,
    prs: [],
    empty: false,
    error: false,
    errorMsg: ""
  };

  getPrs = async () => {
    try {
      const res = await backend.listPr(this.state.branchName);
      if (res.prs) {
        res.prs.length > 0 ? this.setState({
          prs: res.prs
        }) : this.setState({
          prs: res.prs,
          empty: true
        })
      } else {
        this.setState({
          error: true,
          errorMsg: `${res.error}`
        });
      }
    } catch (error) {
      this.setState({
        error: true,
        errorMsg: `${error.error}`
      });
    }
    
  }

  componentDidMount() {
    this.getPrs();
  }

  render(){
    const { prs, empty } = this.state;

    return(
      <TableContainer component={Paper}>
        <Table aria-label="PR table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prs.length > 0 ?
              prs.map((pr) => (
                <TableRow key={pr.id}>
                  <TableCell component="td" scope="row">
                    {pr.number}
                  </TableCell>
                  <TableCell component="td" scope="row">
                    {pr.author.name} - {pr.author.email}
                  </TableCell>
                  <TableCell component="td" scope="row">
                    {pr.title}
                  </TableCell>
                  <TableCell component="td" scope="row">
                    {pr.description}
                  </TableCell>
                  <TableCell component="td" scope="row">
                    {pr.status}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" endIcon={<FindInPageIcon/>}>
                      <Link to={`/branches/`} style={{textDecoration: 'none'}}>
                        See Commits
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (empty) ? 
                <TableRow>
                  <TableCell>
                    This branch has 0 Pull-Requests
                  </TableCell>
                </TableRow> :
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

export default withRouter(ListPR);