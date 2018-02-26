import React, { Component } from 'react'

import axios from 'axios'

export class Counter extends Component {
    constructor(props) {
      super(props)
      this.state = {}
      if (props.count) this.state.count = props.count
      else {
        axios.get('localhost:8080/counter').then(this.axiosCounterHandler)
      }
    }

    axiosCounterHandler(res, err) {
      this.state.count = res.data
    }

    incrementAndUpdate() {
      axios.post('localhost:8080/counter').then(this.axiosCounterHandler)
    }

    render() {
        if (!this.state.count) {
          return(<div>
              <h1>Wait...downloading from API...</h1>
          </div>)
        }
        else {
          return(<div>
            <h1>Hello!</h1>
            <h2>The current count is {this.state.count}</h2>
            <button onClick={this.incrementAndUpdate.bind(this)}>
              Increment!
            </button>
          </div>)
        }
    }
}