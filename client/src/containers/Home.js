import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { invokeApig } from '../libs/awsLib';
import { authUser, getCurrentUser } from "../libs/awsLib"


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      trips: []
    };
  }

  async componentDidMount() {
    // console.log("isAuthenticated: "+this.props.isAuthenticated);
    // console.log("home props " + JSON.stringify(this.props));
    try {
      if (await authUser()) {
        console.log(`GetUser no Home didMount ${getCurrentUser() !=null ? getCurrentUser().username : 'null'}`)
        this.props.userHasAuthenticated(true, getCurrentUser());
      }
    }
    catch(e) {
      alert(e);
    }
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const results = await this.trips();
      // console.log(results);
      this.setState({ trips: results._embedded.trips });
    } catch (e) {
      console.log(e);
    }
  
    this.setState({ isLoading: false });
    console.log("user name no APIGW: " + JSON.stringify(this.props.user.username));
  }
  
  trips() {
    console.log("--API GW");
    return invokeApig({ path: "/trips/" + this.props.user.username}); //rever attributos do identityId
  }

  renderTripsList(trips) {
    // console.log(trips);
    const tripList = trips.map(
        (trip, i) =>
         <ListGroupItem
          key={i}
          header={JSON.parse(trip.content).title}
        >
        {JSON.parse(trip.content).date}
        </ListGroupItem>
    );

    // console.log(tripList);
    if (trips.length === 0) {
      return <ListGroupItem>Não há viagens</ListGroupItem>
    } else{
      return tripList;
    }
  }
  

  renderLander() {
    return (
      <div className="lander">
        <h1>Trips</h1>
        <p>Verifique o estado de suas viagens</p>
      </div>
    );
  }

  renderTrips() {
    return (
      <div className="trips">
        <PageHeader>Suas viagens</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderTripsList(this.state.trips)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderTrips() : this.renderLander()}
      </div>
    );
  }
}