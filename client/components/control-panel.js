import React from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
const ControlPanel = props => {

  const {handleIncrement, handleDecrement} = props

  return (
    <div>
      <h2>Control Panel</h2>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return { state }
}

const mapDispatch = dispatch => {
  return {
    handleIncrement(evt) {
      evt.preventDefault();
      console.log(evt);
    },
    handleDecrement(evt) {
      evt.preventDefault();
      console.log(evt);
    }
  }
}

export default connect(mapState, mapDispatch)(ControlPanel)
