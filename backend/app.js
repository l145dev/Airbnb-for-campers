import createError from 'http-errors';
import express, { json, urlencoded, static as serveStatic } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

// routes
import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import settingsRouter from './routes/settings.js';
import listingsRouter from './routes/listings.js';
import autocompleteRouter from './routes/autocomplete.js';
import logoutRouter from './routes/logout.js';
import supportRouter from './routes/support.js';
import resetPasswordRouter from './routes/resetpassword.js';
import propertyRouter from './routes/property.js';
import bookingRouter from './routes/booking.js';
import tripsRouter from './routes/trips.js';
import notificationsRouter from './routes/notifications.js';
import hostRouter from './routes/host.js';
import hostDashboardRouter from './routes/hostdashboard.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// session store for postgresql
const PgStore = connectPgSimple(session);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
}));

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveStatic(join(__dirname, 'public')));

// session middleware (stored as browser cookies and validated with DB session store)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PgStore({
    conString: process.env.DATABASE_URL,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // conditionally secure, insecure in development (for speed)
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.l145.be' // in development -> localhost, in production -> .l145.be
  },
  rolling: true, // when user makes request to backend, maxAge resets (keeps user logged in if active in the past 24 hours, for UX)
}));

// Configure Passport.js
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/auth/google/callback',
// }, (accessToken, refreshToken, profile, done) => {
//   // Handle user profile here
//   done(null, profile);
// }));

// passport.use(new MicrosoftStrategy({
//   clientID: process.env.MICROSOFT_CLIENT_ID,
//   clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//   callbackURL: '/auth/microsoft/callback',
// }, (accessToken, refreshToken, profile, done) => {
//   // Handle user profile here
//   done(null, profile);
// }));

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// app.use(passport.initialize());
// app.use(passport.session());

// paths to routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/settings', settingsRouter);
app.use('/listings', listingsRouter);
app.use('/autocomplete', autocompleteRouter);
app.use('/logout', logoutRouter);
app.use('/support', supportRouter);
app.use('/resetpassword', resetPasswordRouter);
app.use('/property', propertyRouter);
app.use('/booking', bookingRouter);
app.use('/trips', tripsRouter);
app.use('/notifications', notificationsRouter);
app.use('/host', hostRouter);
app.use('/hostdashboard', hostDashboardRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send JSON error response for API, ONLY if headers haven't been sent
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      message: err.message,
      error: res.locals.error,
    });
  }
});

export default app;