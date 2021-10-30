import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import methodOverride from 'method-override';

import constant from './directory';

const app = express();

require('dotenv').config();

app.set('port', process.env.APP_PORT || 3000);
app.set('host', process.env.APP_HOST || 'localhost');

app.use('/dist', express.static(constant.distDir));

app.set('view engine', 'ejs');

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(methodOverride());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use(express.static(constant.assetsDir));

export default app;