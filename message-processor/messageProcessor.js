// Import required modules
const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const { OrderModel, orderSchema } = require('./orderModel'); // Import OrderModel and schema

// RabbitMQ connection URL
const rabbitUrl = 'amqp://localhost';

try {
    // Attempt to create a MongoDB connection
    mongoose.connect(
      "mongodb://root:example@localhost:27017/", {dbName: "Orders"}
    );
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
// Define a function to process messages from the queue
function consumeQueue() {
    amqp.connect(rabbitUrl, (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            const queueName = 'dataQueue';

            // Assert queue
            channel.assertQueue(queueName, { durable: false });

            console.log('Waiting for messages in %s. To exit press CTRL+C', queueName);

            // Consume messages from the queue
            channel.consume(queueName, async (message) => {
                const data = JSON.parse(message.content.toString());

                // Write data to MongoDB
                try {
                    const order = new OrderModel(data);
                    const result = await order.save();
                    console.log('Data written to database:', result);
                } catch (error) {
                    console.error('Error writing to database:', error);
                }
            }, {
                noAck: true // Don't acknowledge messages
            });
        });
    });
}

// Call the function to start consuming messages from the queue
consumeQueue();
