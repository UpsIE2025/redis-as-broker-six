const Redis = require('ioredis');

let isRedisAvailable = false;

// Cliente para suscripción
const redisSubscriber = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
});

// Cliente para operaciones de lectura/escritura
const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
});

// Cuando Redis se conecta
redis.on('connect', () => {
    console.log('Conexión exitosa a Redis');
    isRedisAvailable = true;
});

// Evento cuando Redis se desconecta
redis.on('close', () => {
    console.log('Redis se ha desconectado');
    isRedisAvailable = false;
});

// Cuando hay un error en la conexión
redis.on('error', (error) => {
    console.error(`Error en la conexión de Redis: ${error.message}`);
    isRedisAvailable = false;
});

// Cuando Redis está intentando reconectar
redis.on('reconnecting', () => {
    console.log('Reconectando a Redis...');
    isRedisAvailable = false;
});

// Verificación periódica de disponibilidad de Redis
setInterval(async () => {
    try {
        await redis.ping();
        if (!isRedisAvailable) {
            console.log('Redis está disponible nuevamente');
            isRedisAvailable = true;
        }
    } catch (error) {
        if (isRedisAvailable) {
            console.error('Redis ya no está disponible:', error.message);
            isRedisAvailable = false;
        }
    }
}, 5000);

// Suscripción a un canal para escuchar nuevos mensajes
const subscribeToQueue = () => {
    redisSubscriber.subscribe(process.env.REDIS_CHANEL || 'msoft', (err) => {
        if (err) {
            console.error('Error al suscribirse al canal:', err.message);
        } else {
            console.log('Suscrito al canal "msoft". Esperando mensajes...');
        }
    });

    redisSubscriber.on('message', (channel, message) => {
        console.log(`Nuevo mensaje en el canal "${channel}":`, message);
    });

    redisSubscriber.on('error', (error) => {
        console.error('Error en la suscripción:', error.message);
    });
};

// Verificar la disponibilidad de Redis
const checkRedisAvailability = async () => {
    return isRedisAvailable;
};

module.exports = { redis, redisSubscriber, checkRedisAvailability, subscribeToQueue };
