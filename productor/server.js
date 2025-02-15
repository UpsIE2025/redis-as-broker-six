require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const { subscribeToQueue } = require('./clients/redis_client');

const app = express();
app.use(express.json());

// Iniciar la suscripción al canal
subscribeToQueue();

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});