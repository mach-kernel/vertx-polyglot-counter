import React, { Component } from 'react'

import axios from 'axios'

export class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        axios.get('localhost:8080/counter').then((res) => this.state.count = res.data)
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
            </div>)
        }
    }
}