import express from 'express';
import { createClient } from "redis";

const app = express();
const PORT = 3000;

const redisClient = createClient({
// if redis is running on port other than 6379 then specifiy it here
});
redisClient.connect();

app.use(express.json());

app.get('/uncached', async (req, res) => {
    const data = await expensiveOperation();
    res.json(data);
});

app.get('/cached', async (req, res) => {
    const cachedData = await redisClient.get('data');
    if (cachedData) {
        return res.json(JSON.parse(cachedData));
    }
    const data = await expensiveOperation();
    await redisClient.set('data', JSON.stringify(data),
        // {'EX': 5} // options here
    );

    res.json(data);
});

/**
 * To push
 */
app.get('/push/:name', async (req, res) => {
    const name = req.params.name;
    const pushName = await redisClient.lPush('username', name as string);
    if(pushName) {
        return res.status(201).json({ status: 'pushed successfully' });
    } else {
        return res.status(400).json({ status: 'Problem' });
    }
});

/**
 * To pop
 */
app.get('/pop', async (req, res) => {
    const popName = await redisClient.rPop('username');
    return res.status(201).json({ status: 'Success', pop: popName });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

async function expensiveOperation() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        username: "akash",
        email: "kirat@gmail.com"
    }
}