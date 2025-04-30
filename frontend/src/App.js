import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './components/Dashboard';
import CompanyForm from './components/CompanyForm';
import EmailTracker from './components/EmailTracker';
import Navbar from './components/Navbar';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/add-company" component={CompanyForm} />
            <Route path="/track-emails" component={EmailTracker} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 