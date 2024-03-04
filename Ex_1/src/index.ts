import orderRouter from './orders';
import express, { Request, Response } from 'express';
import amqp from 'amqplib';

//Using Express.js
const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());
const rabbitUrl = 'amqp://localhost';
app.post('/data', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Connect to RabbitMQ
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();

    // Assert a queue
    const queueName = 'dataQueue';
    await channel.assertQueue(queueName, { durable: false });

    // Send data to the queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));

    console.log('Data sent to queue:', data);
    res.status(200).send('Data sent to queue');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Endpoint at / with GET and POST that returns data with Content-Type: text/plain
//app.use('/', orderRouter);


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
