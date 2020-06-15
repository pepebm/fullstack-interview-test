import React from 'react';
import { AppBar, Toolbar, Typography, Button, makeStyles, Menu } from '@material-ui/core';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

const useStyles = makeStyles({
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
  },
  toolbar: {
  }
});

function Navbar() {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">
            Flat Interview
          </Typography>
          <section className={classes.boxLinks}>
            <Button color="inherit" edge="end"><NavLink to="/" className={classes.links}>Branches</NavLink></Button>
            <Button color="inherit" edge="end"><NavLink to="/pr" className={classes.links}>PR</NavLink></Button>
          </section>
        </Toolbar>
      </AppBar>
  );
}

export default Navbar;