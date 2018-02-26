import React, { Component } from 'react'

import axios from 'axios'

export class Counter extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      if (props.count) this.state.count = props.count
    }

    incrementAndUpdate() {
      axios.post('http://localhost:8081/counter')
           .then((res, _err) => this.setState({count: res.data}))
    }

    render() {
      return(<div>
        <h1>Hello!</h1>
        <h2>The current count is {this.state.count }</h2>
        <button onClick={() => this.incrementAndUpdate()}>
          Increment!
        </button>
      </div>)
    }
}