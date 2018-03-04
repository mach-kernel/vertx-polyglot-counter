# vertx-polyglot-counter
Example React SSR with JS verticle, Kotlin / JVM verticle for HTTP API and backend. 

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

A small Node/Express app has been included in this directory to compare the performance of vert.x powered SSR (in Nashorn) and native V8/Node powered SSR. It _is_ unfair (for the Node app) that vert.x can perform SSR in parallel, but _this is the very advantage I wish to illustrate_.

I did 3 runs and took the fastest out of the 3 for each. The winner is `vert.x` with `3595 req/s` vs `nodejs` with `1775 req/s`. That's almost 2x faster (and likely _much more_ with some tuning for the host machine)! The more important metric to note is the 100th percentile response time. `vert.x` served at its worst a `337ms` response, while `nodejs` at worst served a `3612ms` response. 

### Configuration

##### Hardware
- 2x Xeon X5680 @ 3.33GHz
- 32 GB RAM
- SanDisk X400 SSD
- Linux 4.14.15-1

##### Setup
- One instance of the primary vert.x HTTP server verticle, and two of the SSR verticles running as workers
- One instance of the NodeJS application
  - It gets its client-side bundle from vert.x so I don't have to duplicate that build process
  - It connects to the event bus and functionally performs the same as the vert.x app


### Results

`ab -n10000 -c1000`

##### vert.x

```
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:
Server Hostname:        localhost
Server Port:            8080

Document Path:          /
Document Length:        368 bytes

Concurrency Level:      1000
Time taken for tests:   2.781 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      4080000 bytes
HTML transferred:       3680000 bytes
Requests per second:    3595.69 [#/sec] (mean)
Time per request:       278.111 [ms] (mean)
Time per request:       0.278 [ms] (mean, across all concurrent requests)
Transfer rate:          1432.66 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    3   9.8      0      46
Processing:    16  259  37.2    263     326
Waiting:       16  259  37.2    263     326
Total:         62  262  29.6    264     337

Percentage of the requests served within a certain time (ms)
  50%    264
  66%    264
  75%    275
  80%    276
  90%    278
  95%    278
  98%    311
  99%    321
 100%    337 (longest request)
```

##### nodejs

```
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /
Document Length:        368 bytes

Concurrency Level:      1000
Time taken for tests:   5.632 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      5700000 bytes
HTML transferred:       3680000 bytes
Requests per second:    1775.46 [#/sec] (mean)
Time per request:       563.234 [ms] (mean)
Time per request:       0.563 [ms] (mean, across all concurrent requests)
Transfer rate:          988.29 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0  269 571.9      0    3230
Processing:    91  218 131.7    171     982
Waiting:       91  218 131.7    171     982
Total:         91  487 602.5    181    3612

Percentage of the requests served within a certain time (ms)
  50%    181
  66%    241
  75%    570
  80%   1171
  90%   1222
  95%   1408
  98%   2000
  99%   3354
 100%   3612 (longest request) 
```
