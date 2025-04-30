import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  form: {
    marginBottom: theme.spacing(3),
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2),
  },
  statusCell: {
    '&.replied': {
      color: theme.palette.success.main,
    },
    '&.no-reply': {
      color: theme.palette.error.main,
    },
  },
}));

function EmailTracker() {
  const classes = useStyles();
  const [emails, setEmails] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newEmail, setNewEmail] = useState({
    company_id: '',
    to: '',
    subject: '',
    content: '',
  });

  useEffect(() => {
    fetchEmails();
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/emails/track');
      setEmails(response.data.emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/emails', newEmail);
      alert('Email sent successfully!');
      setNewEmail({
        company_id: '',
        to: '',
        subject: '',
        content: '',
      });
      fetchEmails();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>
          Email Tracker
        </Typography>
        
        <form className={classes.form} onSubmit={handleSendEmail}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel>Company</InputLabel>
                <Select
                  value={newEmail.company_id}
                  onChange={(e) => setNewEmail({ ...newEmail, company_id: e.target.value })}
                  required
                >
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Recipient Email"
                name="to"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Email Content"
                name="content"
                value={newEmail.content}
                onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Send Email
              </Button>
            </Grid>
          </Grid>
        </form>

        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Sent Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell>{email.company_name}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>{new Date(email.sent_at).toLocaleDateString()}</TableCell>
                  <TableCell className={`${classes.statusCell} ${email.has_reply ? 'replied' : 'no-reply'}`}>
                    {email.has_reply ? 'Replied' : 'No Reply'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default EmailTracker; 