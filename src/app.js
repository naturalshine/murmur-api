import logger from 'morgan';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import indexRouter from './routes';
import murmurRouter from './routes/murmur.route';
import sampleRouter from './routes/sample.route';
import videoRouter from './routes/video.route';
import packRouter from './routes/packs.route';
import fileRouter from './routes/file.route';

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// adding Helmet to enhance your API's security
app.use(helmet());

// enabling CORS for all requests
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use('/v1/media', packRouter, videoRouter, sampleRouter);
app.use('/v1/api', murmurRouter);
app.use('v1/storage', fileRouter);
app.use('/v1', indexRouter);

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.stack });
});

export default app;
