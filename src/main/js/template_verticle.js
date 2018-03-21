import 'babel-polyfill-safe';

import { Counter } from "./components/counter.jsx";
import { ReactSPARenderVerticle } from 'vertx-ext-spa-ssr';

new ReactSPARenderVerticle({ Counter });