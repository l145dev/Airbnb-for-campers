import createError from 'http-errors';
import express, { json, urlencoded, static as serveStatic } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// routes
import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import settingsRouter from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveStatic(join(__dirname, 'public')));

// paths to routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/settings', settingsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send JSON error response for API
  res.status(err.status || 500).json({
    message: err.message,
    error: res.locals.error,
  });
});

export default app;