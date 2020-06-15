import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Button, withStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import backend from '../../utils/backend';

const useStyles = {
  root: {
    flexGrow: 1,
  },
  links: {
    textDecoration: 'none',
    color: 'white',
  },
  boxLinks: {
    marginLeft: "auto",
    marginRight: -12
  }
};

class Navbar extends Component {

  constructor(props){
    super(props);
    this.state= { name: "" };
  }

  getRepoName = async () => {
    const data = await backend.getRepo();
    if (data.status === "OK") 
      this.setState({ name: data.name });
    else
      console.log("NavbarError:", data.error);
  };

  componentDidMount(){
    this.getRepoName();
  }

  render() {
    const { classes } = this.props;
    const { name } = this.state;
    return (
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <Typography variant="h6">
              Flat Interview { name.length > 0 ? `- ${name}` : '' }
            </Typography>
            <section className={classes.boxLinks}>
              <Button color="inherit" edge="end"><NavLink to="/" className={classes.links}>Branches</NavLink></Button>
              <Button color="inherit" edge="end"><NavLink to="/pr/create" className={classes.links}>Create PR</NavLink></Button>
            </section>
          </Toolbar>
        </AppBar>
      );
    }
  
}

export default withStyles(useStyles)(Navbar);