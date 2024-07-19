import dotenv from 'dotenv';

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import ExpressError from './utils/expressError.mjs';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import http from 'http';
import User from './models/user.mjs';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet'
import { Strategy as LocalStrategy } from 'passport-local';
import MongoStore from 'connect-mongo';

import campgroundRoutes from './routes/campgrounds.mjs';
import reviewRoutes from './routes/reviews.mjs';
import userRoutes from './routes/users.mjs';

dotenv.config();

import { initializeSocket } from './socket.mjs';

const app = express();
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpcamp'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION FAILED!'));
db.once('open', () => {
  console.log('DATABASE CONNECTED');
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com", // include base URL for maptiler
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com", // include base URL for maptiler
];
const connectSrcUrls = [
  "https://api.maptiler.com/", // add this
];
const imagesrc = [
  "'self'",
  "blob:",
  "data:",
  "https://res.cloudinary.com/dskpugzno/",
  "https://api.maptiler.com/",
  'https://cdn.maptiler.com',
    "https://cdn-icons-png.flaticon.com/",
  'https://images.unsplash.com',
  'https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png',
  'https://i.sstatic.net/l60Hf.png'
];
const fontSrcUrls = [
  "https://fonts.gstatic.com"
];

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';



const store =  MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 3600
});

store.on('error', function(e){
  console.log('Session Store Error', e)
})

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};



const server = http.createServer(app);
initializeSocket(server);

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", "blob:"],
    objectSrc: ["'none'"],
    imgSrc: ["'self'", ...imagesrc],
    fontSrc: ["'self'", ...fontSrcUrls],
  }
}));

app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/home', (req, res) => {
  res.render('home.ejs')
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.all('*', (req, res, next) => {
  next(new ExpressError('Page not Found', 404));
});


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong';
  res.status(statusCode).render('error', { err });
});


server.listen(process.env.PORT || 3000, () => {
  console.log('LISTENING ON PORT 3000');
});
