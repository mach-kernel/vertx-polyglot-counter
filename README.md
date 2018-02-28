# vertx-polyglot-counter
Example React SSR with JS verticle, Kotlin / JVM verticle for HTTP API and backend. 

## Motivation
- Isomorphic React App
- Write services in a native JVM language
- Use NPM packages and UI kits
- (Conditionally!) render on the server if you want to
- Webpack configuration for JVM and client targets

This small example creates a JS Nashorn runtime verticle that uses `babel/babel-polyfill` for ES6 support, runs a set of HTTP endpoints on port `8081`, and then serves the SPA on port `8080`. 

## Getting Started

JDK 9+ support is encouraged for Nashorn performance improvements

```bash
git clone git@github.com:mach-kernel/vertx-polyglot-counter.git
cd vertx-polyglot-counter
yarn install
yarn webpack
gradle run
```
