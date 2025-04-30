import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
}));

function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <EmailIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Email Tracker
          </Typography>
          <Button color="inherit">
            <RouterLink to="/" className={classes.link}>
              Dashboard
            </RouterLink>
          </Button>
          <Button color="inherit">
            <RouterLink to="/add-company" className={classes.link}>
              Add Company
            </RouterLink>
          </Button>
          <Button color="inherit">
            <RouterLink to="/track-emails" className={classes.link}>
              Track Emails
            </RouterLink>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar; 