import React, { Component } from 'react';
import {
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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import backend from '../../utils/backend';

class GetBranches extends Component {
  
  state = {
    branchName: this.props.match.params.name.replace("-", "/"),
    branch: {},
    error: false,
    errorMsg: ""
  };

  getBranch = async (branchName) => {
    const res = await backend.getBranch(branchName);
    if (res.status) {
      this.setState({
        branch: res
      });
    } else {
      this.setState({
        error: true,
        errorMsg: `${res.error}`
      });
    }
  }

  componentDidMount(){
    const { branchName } = this.state;
    if (branchName) {
      this.getBranch(branchName);
    } else {
      console.log("No BranchName was passed.");
    }
  }

  render() {
    const { branchName, branch } = this.state;
    const branch_url = branchName.replace("/", "-");
    return (
      <div>
        {
          Object.keys(branch).length > 0 ? 
            <div>
                <p>Branch Name: {branchName}</p>
                <p>Commits: {branch.count}</p>
                <TableContainer component={Paper}>
                  <Table aria-label="Branch table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Author</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Stats</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {branch.commits.map((commit) => (
                          <TableRow key={commit.id}>
                            <TableCell component="td" scope="row">
                              {commit.author}
                            </TableCell>
                            <TableCell component="td" scope="row">
                              {commit.message}
                            </TableCell>
                            <TableCell component="td" scope="row">
                              {commit.timestamp}
                            </TableCell>
                            <TableCell component="td" scope="row">
                              <span style={{color:'green'}}><AddCircleOutlineIcon style={{fontSize: 12}}/> {commit.stats.adds}</span><br/>
                              <span style = {{color: 'red'}}><RemoveCircleOutlineIcon style={{fontSize: 12}}/> {commit.stats.deletes}</span><br/>
                              <span><CompareArrowsIcon style={{fontSize: 12}}/> {commit.stats.total}</span>
                            </TableCell>
                            <TableCell component="td"  align="right">
                              <a 
                                  href={commit.url} 
                                  style={{textDecoration: 'none'}}
                                  target="_blank"
                                >
                                <Button variant="outlined" endIcon={<FindInPageIcon/>}>
                                  See Details
                                </Button>
                              </a>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
            </div> : 
            <p>Loading data</p>
        } 
      </div>
    );
  }
}

export default withRouter(GetBranches);