var createReactClass = require('create-react-class');
var React = require('react');

var component = createReactClass({
  incrementAndUpdate: function() {
    axios.post('http://localhost:8080/counter')
         .then((res, _err) => this.setState({count: res.data}))
  },
  getInitialState: function() {
    return { count: this.props.initialCount }
  },
  render: function() {
    return(
      React.DOM.div(null, React.DOM.h1(null, 'Hello!'), 
                React.DOM.h2(null, 'The current count is ' + this.state.count),
                React.DOM.button({onClick: function() { this.incrementAndUpdate(); }}, 'Increment!')
      )
    );
  }
})

exports.component = component;