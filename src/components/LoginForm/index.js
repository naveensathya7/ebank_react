import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'
import {Redirect} from 'react-router-dom'

class LoginForm extends Component {
  state = {userId: '', pin: '', errorMsg: 'invalid User', requestFailed: false}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = token => {
    const {history} = this.props

    Cookies.set('jwt_token', token, {
      expires: 30,
    })
    history.replace('/')
  }

  loginUser = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const apiUrl = 'https://apis.ccbp.in/ebank/login'
    const userDetails = {user_id: userId, pin}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)

    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.setState({requestFailed: true, errorMsg: data.error_msg})
    }
    console.log(data)
  }

  render() {
    const {requestFailed, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <div className="login-card">
          <img
            className="login-image"
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
          />
          <div className="login-area">
            <h1>Welcome Back!</h1>
            <form onSubmit={this.loginUser} className="login-form">
              <label className="label" htmlFor="userId">
                USER ID
              </label>
              <br />
              <input
                className="input-box"
                id="userId"
                type="text"
                placeholder="Enter USER ID"
                onChange={this.onChangeUserId}
              />
              <br />
              <label className="label" htmlFor="pin">
                PIN
              </label>
              <br />
              <input
                className="input-box"
                id="pin"
                type="password"
                placeholder="Enter PIN"
                onChange={this.onChangePin}
              />
              <br />
              <button className="login-btn" type="submit">
                Login
              </button>
              {requestFailed && <p className="error-msg">{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}
export default LoginForm
