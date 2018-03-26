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

## Benchmarks

A functionally equivalent (to the user) Node.JS & Express React SSR app is included under `expressapp_test`. This test is to explore how Nashorn + vert.x stack up against a traditional SSR JS application built with V8. Each solution is given 3 runs and the best of the 3 is recorded.

`wrk -t 1000 -c 1000 -d 30 http://localhost:8080`

| Stack   |  Config   | Req / Second |
|---------|-----------|--------------|
| vert.x  | cache off | 4497.13      |
| Node.JS | cache off | 990.60       |
| vert.x  | cache on  | 19452.75     |
| Node.JS | cache on  | 1116.59      |

### Hardware

- MacBook Pro 11,4
- i7-4980 HQ @ 2.8 GHz
- 16GB DDR3L
- NVMe SSD

### Test with caching disabled

Component caching on the server-side is turned off. 

##### vert.x & vertx-ext-spa-ssr
```
Running 30s test @ http://localhost:8080
  1000 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   222.92ms  102.03ms 553.88ms   62.91%
    Req/Sec     5.26      3.37    40.00     70.13%
  135564 requests in 30.14s, 73.05MB read
Requests/sec:   4497.13
Transfer/sec:      2.42MB
```

##### Node.JS & Express
```
Running 30s test @ http://localhost:3000
  1000 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   842.50ms  201.56ms   1.62s    81.64%
    Req/Sec     0.92      0.73     9.00     70.36%
  29825 requests in 30.11s, 27.36MB read
  Socket errors: connect 0, read 1007, write 0, timeout 0
Requests/sec:    990.60
Transfer/sec:      0.91MB
```

### Test with caching on

- vert.x uses [vertx-ext-spa-ssr](https://github.com/mach-kernel/vertx-ext-spa-ssr), which is backed by [Caffeine](https://github.com/ben-manes/caffeine).
- Node.JS uses Walmart's [react-ssr-optimization](https://github.com/walmartlabs/react-ssr-optimization), with a hashing function implemented around [object-hash](https://github.com/puleos/object-hash).

##### vert.x & vertx-ext-spa-ssr

```
Running 30s test @ http://localhost:8080
  1000 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    49.73ms    9.18ms 214.84ms   85.67%
    Req/Sec    19.94      4.75   100.00     82.51%
  585720 requests in 30.11s, 315.60MB read
  Socket errors: connect 0, read 564, write 0, timeout 0
Requests/sec:  19452.75
Transfer/sec:     10.48MB
```

##### Node.JS and Express

```
Running 30s test @ http://localhost:3000
  1000 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   806.41ms  155.03ms   1.13s    80.81%
    Req/Sec     1.02      0.48     5.00     87.32%
  33608 requests in 30.10s, 30.83MB read
  Socket errors: connect 0, read 787, write 0, timeout 0
Requests/sec:   1116.59
Transfer/sec:      1.02MB
```
