require('dotenv').config();
const express = require('express');
const app = express();
const requireAuth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const mealsRoutes = require('./routes/meals');

app.use(helmet());
app.use(express.json());
app.use(authRoutes);
app.use(requireAuth);
app.use(mealsRoutes)
app.use(errorHandler);
app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
