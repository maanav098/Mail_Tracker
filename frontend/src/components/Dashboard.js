import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  card: {
    minWidth: 275,
    margin: theme.spacing(2),
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

function Dashboard() {
  const classes = useStyles();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalEmails: 0,
    repliedEmails: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Companies
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Total Companies: {stats.totalCompanies}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={RouterLink}
                to="/add-company"
              >
                Add Company
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Emails
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Total Emails: {stats.totalEmails}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Replied Emails: {stats.repliedEmails}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={RouterLink}
                to="/track-emails"
              >
                Track Emails
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Response Rate
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                {stats.totalEmails > 0
                  ? `${((stats.repliedEmails / stats.totalEmails) * 100).toFixed(1)}%`
                  : '0%'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard; 