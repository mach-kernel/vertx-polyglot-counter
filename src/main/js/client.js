import { Counter } from './components/counter.jsx'
import { ReactHydrator } from 'vertx-ext-spa-ssr';

import 'antd/dist/antd.css';

new ReactHydrator({ Counter });