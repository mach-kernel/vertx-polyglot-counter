# vertx-polyglot-counter
Conditional React SSR with JS verticle, Kotlin / JVM verticle for HTTP API and backend. 

## Motivation
- Isomorphic React App
- Write services in a native JVM language
- Use NPM packages and UI kits
- (Conditionally!) render on the server
- Webpack configuration for JVM and client targets

## Getting Started

JDK 9+ support is encouraged for Nashorn performance improvements

```bash
git clone git@github.com:mach-kernel/vertx-polyglot-counter.git
cd vertx-polyglot-counter
yarn install
yarn webpack
gradle run
```