import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SignUp from "./components/user/Signup";
import Login from "./components/user/Login";




class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
          
          
        <Route path="/signup" component={SignUp}/>
        <Route path="/login" component={Login}/>
        

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}



export default App