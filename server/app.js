const express = require('express');
const app = express();
const requireAuth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const mealsRoutes = require('./routes/meals');

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(requireAuth);
app.use(mealsRoutes)
app.use(errorHandler);

module.exports = app;