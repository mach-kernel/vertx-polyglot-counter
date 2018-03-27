# expressapp-test

This app is functionally the same as the Kotlin polyglot counter app, but implemented in JavaScript using Express. It shares the same component directory and client-side bundle as the original app, and uses Babel to transpile the JSX component such that it can be used by this Node app. It also requires the other app to be running in order to be able to query the counter via the vert.x event bus. 

### Getting Started

Start `vertx-polyglot-counter`, and then: 

- yarn install
- yarn build
- yarn start

If you wish to run with `passenger` (replace 8 with the number of cores your host machine has):

- brew install passenger
`passenger start --nodejs bin/www --min-instances 8 --max-pool-size 8`