import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, HelpBlock } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./Login.css";
import config from "../config";
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
  } from "amazon-cognito-identity-js";



export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      email: "",
      password: "",
      user: null,
      MFA: "",
      aux: null //,
      //mfaEnabled: null
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  validateConfirmationMFA() {
    return this.state.MFA.length > 0;
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
      await this.login(this.state.email, this.state.password);
      // if (mfaEnabled === false){
      //   this.props.userHasAuthenticated(true, this.state.user);
      //   this.props.history.push("/");
      // }
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleSubmitMFA = async event => {
    event.preventDefault();
    
    this.setState({ isLoading: true });

    try {
      // await this.state.user.sendMFACode(this.state.MFA, this.state.aux);
      await this.sendMFA(this.state.user, this.state.MFA);

      this.props.userHasAuthenticated(true, this.state.user);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  sendMFA(user, code){
    return new Promise((resolve, reject) =>
      user.sendMFACode(code, {
        onSuccess: result => resolve(),
        // function(){ 
        // //////////
          // var params = {
          //   IdentityPoolId: config.cognito.IDENTITY_POOL_ID, /* required */
          //   AccountId: config.cognito.ACCOUNT_ID,
          //   Logins: {
          //     'Amazon Cognito Identity Provider:': config.cognito.IDENTITY_PROVIDER_NAME
          //   }
          // };

          // cognitoidentity.getId(params, function(err, data) {
          //   if (err) console.log(err, err.stack); // an error occurred
          //   else     console.log(data); /*user = data.identityId;*/        // successful response
          // });
          // //data.IdentityId
        // //////////
        //   _this.setState({ user: user, isLoading: false, aux: this, mfaEnabled: true})
        // },
        onFailure: err => reject(err)
      })
    );
  }

  login(email, password) {
    const _this = this;
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        // function(){
        //// //////////
          // var params = {
          //   IdentityPoolId: config.cognito.IDENTITY_POOL_ID, /* required */
          //   AccountId: config.awsAccount.ACCOUNT_ID,
          //   Logins: {
          //     'Amazon Cognito Identity Provider:': IDENTITY_PROVIDER_NAME,
          //   }
          // };

          // cognitoidentity.getId(params, function(err, data) {
          //   if (err) console.log(err, err.stack); // an error occurred
          //   else     console.log(data);   //user = data.identityId;        // successful response
          // });
          // //data.IdentityId
        //// //////////
        //   _this.setState({ user: user, isLoading: false, aux: this, mfaEnabled: false})
        // },
        onFailure: err => reject(err),
        mfaRequired: function(){
          _this.setState({ user: user, isLoading: false, aux: this /*, mfaEnabled: true E TIRAR 'user: user' */})
        }
      })
    );
  }


  renderLogin() {
    return (
      <div className="Login">
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
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Entrar"
            loadingText="Verificando dados…"
          />
        </form>
      </div>
    );
  }

  renderConfirmationMFA() {
    return (
      <form onSubmit={this.handleSubmitMFA}>
        <FormGroup controlId="MFA" bsSize="large">
          <ControlLabel>Código de confirmação</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.MFA}
            onChange={this.handleChange}
          />
        <HelpBlock>Por favor verifique o SMS enviado para seu celular para obter código MFA.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!this.validateConfirmationMFA()}
          type="submit"
          isLoading={this.state.isLoading}
          text="Validar código"
          loadingText="Validando..."
        />
      </form>
    );
  }

  render() {
    return (
      this.state.user===null ? this.renderLogin() : this.renderConfirmationMFA()
      //this.state.mfaEnabled === true ? this.renderConfirmationMFA() : this.renderLogin()
    );
  }
}