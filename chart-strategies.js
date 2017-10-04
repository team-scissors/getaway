class GraphComponent extends React.Component {
  componentDidMount () {
    d3(this.container);
      .d3Method(this.props.something)
    ;
  }

  shouldComponentUpdate () { return false; }

  componentWillRecieveProps (nextProps) {
    d3(this.container).d3Method(nextProps.something);
  }

  componentWillUnmount () {
    d3.someCleanupMethod(this.container);
  }

  render () {
    return <div ref={(ref) => this.container = ref}/>
  }
}

class React extends React.Component {
  render () {
    return (
      <svg>
        {
          things.map(thing => {
            <circle r={d3.someFancyMethod(this.props.coolThing)}/>
          })
        }
      </svg>
    )
  }
}


import SubApp from './sub-app';
import ReactDOM from 'react-dom';
class Crazy extends React.Component {
  componentDidMount () {
    ReactDOM.render(<SubApp {...this.props}/>, this.container);
  }

  shouldComponentUpdate () { return false; }

  componentWillRecieveProps (nextProps) {
    ReactDOM.render(<SubApp {...this.props}/>, this.container);
  }

  componentWillUnmount () {
    ReactDOM.unmount(this.container);
  }

  render () {
    return <div ref={(ref) => this.container = ref}/>
  }
}
