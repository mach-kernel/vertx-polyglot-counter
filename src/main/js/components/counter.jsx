import React, { Component } from 'react'

export class Counter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            count: 0
        }
    }

    render() {
        return(<div>
            <h1>Hello!</h1>
            <h2>The current count is {this.state.count}</h2>
        </div>)
    }
}