const express = require('express');
const bodyParser = require('body-parser');

const redisRoutes = require('./routes/redis.route');
const mongoRoutes = require('./routes/mongo.route');
const postgresRoutes = require('./routes/postgres.route');


const app = express();
app.use(bodyParser.json());

app.use('/redis', redisRoutes);
app.use('/mon', mongoRoutes);
app.use('/pgroute', postgresRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
