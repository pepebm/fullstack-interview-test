import React, { Component } from 'react';
import {
  withRouter,
  Link
} from 'react-router-dom';
import {
  Grid,
  Typography,
  Menu,
  MenuItem,
  Button,
  TextField
} from '@material-ui/core';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import backend from '../../utils/backend';

class CreatePR extends Component {

  constructor(props) {
    super(props);

    this.state = {
      branches: [],
      branch: {},
      error: false,
      errorMsg: "",
      anchorBase: null,
      selectedBase: "",
      anchorHead: null,
      selectedHead: "",
      title: "",
      body: ""
    };
  }

  openMenu = (event, type) => {
    if (type === "base") {
      this.setState({
        anchorBase: event.currentTarget
      })
    } else {
      this.setState({
        anchorHead: event.currentTarget
      })
    }
  }

  closeMenu = (type, name) => {
    if (type === "base") {
      this.setState({
        anchorBase: null,
        selectedBase: name
      })
    } else {
      this.setState({
        anchorHead: null,
        selectedHead: name
      })
    }
  }

  getBranches = async () => {
    const res = await backend.listBranches();
    if (res.branches) {
      this.setState({
        branches: res.branches
      })
    } else {
      this.setState({
        error: true,
        errorMsg: `${res.error}`
      });
    }
  }

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
    return res;
  }

  createPr = async () => {
    const {
      selectedBase,
      selectedHead,
      title,
      body
    } = this.state;
    const res = await backend.createPr(title, body, selectedBase, selectedHead);
    this.setState({
      branch: await this.getBranch(selectedBase)
    });
    console.log(res);
  }

  handleChange(event, type) {
    if (type === "title")
      this.setState({
        title: event.target.value
      });
    else
      this.setState({
        body: event.target.value
      });
  }

  componentDidMount() {
    this.getBranches();
  }

  validateForm(){
    const {
      selectedBase,
      selectedHead,
      title,
      body
    } = this.state;

    if (selectedBase.length == 0 || selectedHead.length == 0 || 
          title.length == 0 || body.length == 0) {
        return {"status": false, "message": "Some values are missing, check again."};
    } else if (selectedBase === selectedHead){
      return {"status": false, "message": "Head and Base can't be from the same Branch."}
    } else {
      return {"status": true}
    }
  }

  render() {
    const {
      branches,
      anchorBase,
      anchorHead,
      selectedBase,
      selectedHead,
      title,
      body,
      branch
    } = this.state;
    const canSubmit = this.validateForm();
    return (
      <div>
      {
        (branches.length) > 0 ? 
          <Grid container spacing={3} style={{textAlign:"center"}}>
            <Grid item xs={6}>
              <Typography variant="h6">
                Base
              </Typography>
              <Typography variant="p">
                Selected - {selectedBase.length > 0 ? selectedBase : "None"}
              </Typography>
              <br/>
              <Button aria-controls="base-menu" aria-haspopup="true" onClick={(e) => { this.openMenu(e, "base")}}>
                Select Base Branch
              </Button>
              <Menu
                id="base-menu"
                anchorEl={anchorBase}
                keepMounted
                open={Boolean(anchorBase)}
              >
                {
                  branches.map((branch, idx) => (
                    <MenuItem key={idx} onClick={() => {this.closeMenu("base", branch)}}>{branch}</MenuItem>
                  ))
                }
              </Menu>
            </Grid>
            <Grid  item xs={6} style={{textAlign: "center"}}>
              <Typography variant="h6">
                  Head
                </Typography>
                <Typography variant="p">
                  Selected - {selectedHead.length > 0 ? selectedHead : "None"}
                </Typography>
                <br/>
                <Button aria-controls="base-menu" aria-haspopup="true" onClick={(e) => { this.openMenu(e, "head")}}>
                  Select Head Branch
                </Button>
                <Menu
                  id="base-menu"
                  anchorEl={anchorHead}
                  keepMounted
                  open={Boolean(anchorHead)}
                >
                  {
                    branches.map((branch, idx) => (
                      <MenuItem key={idx} onClick={() => {this.closeMenu("head", branch)}}>{branch}</MenuItem>
                    ))
                  }
                </Menu>
            </Grid>
            <Grid item xs={12}>
              <form>
                <TextField id="prTitle" label="Title" value={title} onChange={(e) => {this.handleChange(e, "title")}}/><br/>
                <TextField id="prBody" label="Description" value={body} onChange={(e) => {this.handleChange(e, "body")}}/>
              </form>
              <br/>
              {canSubmit.status ?
                <div> 
                  <Button 
                    variant="outlined" 
                    endIcon={<MergeTypeIcon />} 
                    aria-describedby="commit-btn" 
                    color="primary"
                    onClick={async () => { await this.createPr()}}>
                    Create Pull-Request
                  </Button>
                  {
                    Object.keys(branch).length !== 0  ?
                      <Link to={
                        {
                          pathname:`/branches/${selectedBase}/pr`,
                          state: branch
                        }
                      }/> : ""
                  }
                </div>: <p style={{color:'red'}}>{canSubmit.message}</p>}
            </Grid>
          </Grid> : <p>Loading Branches...</p>
      }
      </div>
    );
  }
}

export default withRouter(CreatePR);