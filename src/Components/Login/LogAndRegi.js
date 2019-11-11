import React from 'react';
import './LogAndReg.scss';
import { connect } from 'react-redux'
import { login, register } from '../../Store/actions';


class LogAndRegi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {
        username: '',
        password: '',
      },
      login: false,
      register: false,
    }
  }

  showInput = e => {
    if (e.target.textContent === 'Register') {
      this.setState({
        register: true,
        login: false,
      });
    } else {
      this.setState({
        register: false,
        login: true,
      });
    }

  };

  handleChange = e => {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [e.target.name]: e.target.value
      }
    })
  };

  register = e => {
    e.preventDefault();

    if (this.state.credentials.username.length > 2
      // &&
      // this.state.credentials.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/)
    ) {
      this.props.register(this.state.credentials);
      this.setState({
        login: true,
        register: false,
      });
    }
  };

  login = e => {
    e.preventDefault();

    this.props.login(this.state.credentials)
      .then(() => {
        this.props.history.push('/bookr');
      });
  };


  render() {
    if (this.state.register) {
      return (
        <div className="log-reg">
<div className="register">
          <p onClick={this.showInput}
          className="btn btn--white btn--login">Go to Login</p>
              <div
                className="inputs">
                <input
                  name="username"
                  onChange={this.handleChange}
                  value={this.state.username}
                  placeholder="Username"
                  type="text"
                />
                <input
                  name="password"
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.password}
                  placeholder="Password"
                />
              </div>

              <p
                onClick={this.register}
                className="btn btn--white">
                <i className="fa fa-user-plus"></i>
              </p>
            </div>
        </div>
      )
    }
    if (this.state.login) {
      return (
        <div
        className="log-reg">
         <div className="login">
          <p 
          onClick={this.showInput}
          className="btn btn--white btn--register">Register</p>
         
              <div
                className="inputs">
                <input
                  name="username"
                  onChange={this.handleChange}
                  value={this.state.username}
                  placeholder="Username"
                  type="text"
                />
                <input
                  name="password"
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.password}
                  placeholder="Password"
                />
              </div>
              <p
              className="btn btn--white"
              onClick={this.login}>
                  Login
                {/* {this.props.isLoggingIn ? (<Loader
                  type="ThreeDots"
                  color="#1f2a38"
                  height="12"
                  width="26" />) :
                  (<i className="fa fa-user-plus"></i>)} */}
              </p>
          
            </div>
        </div>)
    }
    return (
      <div className="log-reg">
        <div className="start">
        <p
        onClick={this.showInput}
        className="btn btn--white">Register</p>
        <p 
        onClick={this.showInput}
        className="btn btn--white">Login</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggingIn: state.loggingIn
  }
};

export default connect(mapStateToProps, { login, register })(LogAndRegi);