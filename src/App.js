import React from 'react';
import LogAndReg from './Components/Login/LogAndRegi';
import PrivateRoute from './Components/Login/PrivateRoute';
import Bookr from './Components/Bookr/Bookr';
import User from './Components/Bookr/User/User';
import SlideModus from './Components/Bookr/SlideModus/SlideModus';
import { Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={LogAndReg} />
      <PrivateRoute exact path="/bookr" component={Bookr} />
      <Route path="/user" component={User} />
      <Route path="/slider" component={SlideModus} />
    </div>
  );
}

export default App;
