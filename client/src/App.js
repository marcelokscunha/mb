import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";
import { authUser, signOutUser, getCurrentUser } from "./libs/awsLib";



class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      user: null
    };
  }
  
  userHasAuthenticated = (authenticated, user) => {
    this.setState({ isAuthenticated: authenticated });
    this.setState({ user: user });
    console.log(`GetUser no App userHasAuthenticated()  ${user !=null ? user.username : 'null'}`)
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false, null);
    this.props.history.push("/login");
  }


  // antigo
  // async componentDidMount() {
  //   if (getCurrentUser() != null) {
  //     this.userHasAuthenticated(true, getCurrentUser());
  //   }else{
  //     signOutUser();
  //     this.userHasAuthenticated(false, null);
  //     // this.props.history.push("/login");
  //   }
  //   this.setState({ isAuthenticating: false });
  // }

  async componentDidMount() {
    try {
      if (await authUser()) {
        // console.log(`GetUser no App didMount ${getCurrentUser() !=null ? getCurrentUser().username : 'null'}`)
        this.userHasAuthenticated(true, getCurrentUser());
      }
    }
    catch(e) {
      alert(e);
    }
    this.setState({ isAuthenticating: false });
  }



  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      user: this.state.user
    };
    // console.log("render App " + JSON.stringify(this.state.user));
  
    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Trips</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Sair</NavItem>
                : [
                    <RouteNavItem key={1} href="/signup">
                      Cadastrar
                    </RouteNavItem>,
                    <RouteNavItem key={2} href="/login">
                      Entrar
                    </RouteNavItem>
                  ]
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);