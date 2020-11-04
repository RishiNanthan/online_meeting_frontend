import './App.css';
import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Home from './components/pages/Home';
import NewMeeting from './components/pages/NewMeeting';


function HomePage(){
  return (
    <div>
      <Home />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ HomePage } />
          <Route path="/new-meeting" component={ NewMeeting } />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
