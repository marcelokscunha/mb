import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Signup.css";
import {
    AuthenticationDetails,
    CognitoUserPool,
    CognitoUserAttribute //,
    //CognitoUser
} from "amazon-cognito-identity-js";
import config from "../config";


export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      phone: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword &&
      this.validatePhonePattern(this.state.phone)
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  validatePhonePattern = (phone) => {
    return /\+55[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{3}$/.test(phone) || phone==="";
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      const newUser = await this.signup(this.state.email, this.state.password, this.state.phone);
      this.setState({
        newUser: newUser
      });
   
    } catch (e) {
      alert(e);
    } 
    this.setState({ isLoading: false });
  }
  
  handleConfirmationSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await this.confirm(this.state.newUser, this.state.confirmationCode);
      await this.authenticate(
        this.state.newUser,
        this.state.email,
        this.state.password
      );
  
      this.props.userHasAuthenticated(true, this.state.newUser);
      this.props.history.push("/");

      this.state.newUser.enableMFA(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        // console.log('call result: ' + result);
      });

    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  signup(email, password, phone) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    var attributeList = [];
    var attributePhoneNumber = new CognitoUserAttribute({
        Name : 'phone_number',
        Value : phone
    });
    attributeList.push(attributePhoneNumber);
  
    return new Promise((resolve, reject) =>
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
  
        resolve(result.user);
      })
    );
  }
  
  confirm(user, confirmationCode) {
    return new Promise((resolve, reject) =>
      user.confirmRegistration(confirmationCode, true, function(err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      })
    );
  }
  
  authenticate(user, email, password) {
    const authenticationData = {
      Username: email,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
  
    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Código de confirmação</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange}
          />
        {
            this.state.phone===""
              ? <HelpBlock>Por favor verifique seu e-mail para obter código.</HelpBlock>
              : <HelpBlock>Por favor verifique o SMS enviado para seu celular para obter código.</HelpBlock>
        }
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Validar código"
          loadingText="Validando..."
        />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Senha</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Digite senha novamente</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="phone" bsSize="large">
          <ControlLabel>Celular (Opcional para MFA)</ControlLabel>
          <FormControl
            value={this.state.phone}
            onChange={this.handleChange}
            type="phone"
            placeholder="Formato: +55XX123456789"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Cadastrar"
          loadingText="Avaliando dados"
        />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        {this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm()}
      </div>
    );
  }
}