const { redis, checkRedisAvailability } = require('../clients/redis_client');
const { v4: uuidv4 } = require('uuid');

const setMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Se requiere un mensaje' });
        }
        const isRedisAvailable = await checkRedisAvailability();
        if (!isRedisAvailable) {
            return res.status(500).json({ error: 'Servicio Redis no disponible en este momento' });
        }
        const key = `message:${uuidv4()}`;
        await redis.set(key, message);
        await redis.publish(process.env.REDIS_CHANEL || 'msoft', message);

        res.json({ message: `Mensaje guardado correctamente con clave: ${key}` });
    } catch (error) {
        console.error('Error en /set:', error);
        res.status(500).json({ error: `Error al guardar el mensaje en Redis: ${error.message}` });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const isRedisAvailable = await checkRedisAvailability();
        if (!isRedisAvailable) {
            return res.status(500).json({ error: 'Servicio Redis no disponible en este momento' });
        }
        const keys = await redis.keys('message:*');

        const messages = await redis.mget(keys);

        res.json({ messages });
    } catch (error) {
        console.error('Error en /getAllMessages:', error);
        res.status(500).json({ error: `Error al obtener los mensajes de Redis: ${error.message}` });
    }
};

const getLastMessage = async (req, res) => {
    try {
        const isRedisAvailable = await checkRedisAvailability();
        if (!isRedisAvailable) {
            return res.status(500).json({ error: 'Servicio Redis no disponible en este momento' });
        }
        const keys = await redis.keys('message:*');

        if (keys.length === 0) {
            return res.status(404).json({ error: 'No hay mensajes disponibles' });
        }

        const lastKey = keys[keys.length - 1];
        const lastMessage = await redis.get(lastKey);

        res.json({ message: lastMessage });
    } catch (error) {
        console.error('Error en /getLastMessage:', error);
        res.status(500).json({ error: `Error al obtener el último mensaje de Redis: ${error.message}` });
    }
};

module.exports = { setMessage, getAllMessages, getLastMessage };
