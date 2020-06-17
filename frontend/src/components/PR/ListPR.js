import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';

import prettyPrintJson from 'pretty-print-json';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Popover
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
          // add element to create popover
          prs: res.prs.map(el => {
            let obj = Object.assign({}, el);
            obj.anchorEl = null;
            return obj;
          })
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

  mergePr = async (message, title, id) => {
    const res = await backend.makePr(message, title, id);
    if (res.status){
      this.getPrs();
    } else {
      console.error(res.error);
    }
  }

  detailsPr = async id => {
    const res = await backend.getPr(id);
    console.log(res);
    return res.state ? res.pr : res.error
  }

  openPopover = async (e, number) => {
    const { prs } = this.state;
    let newPrs = prs,
        targetIndex = prs.findIndex(pr => pr.number === number);
    newPrs[targetIndex].anchorEl = e.currentTarget;
    newPrs[targetIndex].details = newPrs[targetIndex].details ? newPrs[targetIndex].details :  await this.detailsPr(number);
    this.setState({
      prs: newPrs
    });
  }

  closePopover = (id) => {
    const { prs } = this.state;
    let newPrs = prs;
    newPrs[prs.findIndex(pr => pr.id === id)].anchorEl = null;
    this.setState({
      prs: newPrs
    });
  }

  componentDidMount() {
    this.getPrs();
  }

  render(){
    const { prs, empty, branchName } = this.state;

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
                    {pr.status === "open" ? 
                      <Button 
                        variant="outlined" 
                        endIcon={<FindInPageIcon/>}
                        onClick={() => this.mergePr(pr.message || '', pr.title || '', pr.id)}  
                      >
                        Merge                        
                      </Button> : ""
                    }
                    <Button 
                      variant="outlined" 
                      endIcon={<FindInPageIcon />} 
                      aria-describedby={pr.id} 
                      color="primary"
                      onClick={async (e) => { await this.openPopover(e, pr.number)}}>
                      See details
                    </Button>
                    <Popover 
                        id={pr.id}
                        open={(pr.anchorEl) ? Boolean(pr.anchorEl) : false}
                        onClose={() => this.closePopover(pr.id)}
                        style={{textDecoration: 'none'}}
                        anchorEl={(pr.anchorEl ? pr.anchorEl : null)}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                      >
                        <pre>
                          {
                            pr.details ? 
                              JSON.stringify(pr.details, null, 4)
                              : "Loading..."
                          }
                        </pre>
                      </Popover>
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