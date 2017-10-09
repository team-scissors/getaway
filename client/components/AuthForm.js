import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { auth } from '../store'

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props

  return (
    <div>
      <div className="card">
        <div className="card-content">
          <form onSubmit={handleSubmit} name={name}>
            {
              name === "signup" &&
              <div>
                <div>
                  <h1 className="title">
                    Register an Account
                  </h1>
                </div>
                <div>
                  <label className="label">First Name</label>
                  <p className="control">
                    <input className="input" name="firstName" type="text" placeholder="John" />
                  </p>
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <p className="control">
                    <input className="input" name="lastName" type="text" placeholder="Smith" />
                  </p>
                </div>
              </div>
            }
            <div>
              <label className="label">Email</label>
              <p className="control">
                <input className="input" name="email" type="text" placeholder="jsmith@example.org" />
              </p>
            </div>
            <div>
              <label className="label">Password</label>
              <p className="control">
                <input className="input" name="password" type="password" placeholder="●●●●●●●" />
              </p>
            </div>
            <div>
              <button className="button is-primary" type='submit'>{displayName}</button>
            </div>
            {error && error.response && <div> {error.response.data}</div>}
          </form>
        </div>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      let user = {};
      if (formName === 'login') {
        user = {
          email: evt.target.email.value,
          password: evt.target.password.value,
        }
      }
      else if (formName === 'signup') {
        user = {
          firstName: evt.target.firstName.value,
          lastName: evt.target.lastName.value,
          email: evt.target.email.value,
          password: evt.target.password.value,
        }
      }
      dispatch(auth(user, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
