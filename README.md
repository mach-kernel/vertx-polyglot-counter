# vertx-polyglot-counter
Example React SSR with JS verticle, Kotlin / JVM verticle for HTTP API and backend, built with [vertx-ext-spa-ssr](https://github.com/mach-kernel/vertx-ext-spa-ssr) using components from [Ant Design](http://ant.design).

![hi](https://i.imgur.com/zMT7EcE.gif)

## Motivation
- Isomorphic React App
- Write services in a native JVM language
- Use NPM packages and UI kits
- (Conditionally!) render on the server if you want to
- Render in parallel
- Webpack configuration for JVM and client targets

This small example creates a JS Nashorn runtime worker verticle that uses `babel/babel-polyfill` for ES6 support which exposes a message bus consumer that performs SSR and responds back with a string of the prerendered component. A web server verticle consumes this response and serves the SPA, which in this case, is a small in-memory counter.

## Getting Started

JDK 9+ support is encouraged for Nashorn performance improvements

```bash
git clone git@github.com:mach-kernel/vertx-polyglot-counter.git
cd vertx-polyglot-counter
yarn install
gradle run
```
