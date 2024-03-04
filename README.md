# Lecture 10 Excercises

## Exercise 1 - Hello World

### Lab 1.1 - JavaScript

Follow this tutorial: <https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html>.

### Lab 1.2 - CS

Follow this tutorial: <https://www.rabbitmq.com/tutorials/tutorial-one-dotnet.html>.

## Exercise 2 - Web.API --> RabbitMQ --> DB

### Lab 2.1 - JavaScript

Create a WebAPI with Node and JavaScript (you may reuse an old exercise) where data from post requeste are send through a message queue to a process (console app with JavaScript) that write the data to the database.

> i used the old exercise from the Orders project and added a new route to the API to send the data to the RabbitMQ queue.
    Now we have 2 projects, Ex_1 and message-processor. to run these projects, you need to run the following commands:

```bash
cd Ex_1
npm i
# running nodemon for code updates
npm run dev

```
> lets remeber our docker container from earlier exercises Or ```(docker-compose up)``` and that we have the rabbitMQ server running using the following command:

```bash
# latest RabbitMQ 3.13
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
```

> now we need to run the message-processor project, to do that, we need to run the following commands:

```bash
cd message-processor
npm i
npm start
```

> now we can test the API by sending a POST request to the following endpoint:
    ```bash
    http://localhost:4000/data
    ```
> and we can check the RabbitMQ management console to see the messages being sent to the queue.

terminal output can be similar to mine:
```bash
Data written to database: { _id: new ObjectId('65e5c13e1667ff28d3da8987'), __v: 0 }
Data written to database: { _id: new ObjectId('65e5c2061667ff28d3da8989'), __v: 0 }
Data written to database: { _id: new ObjectId('65e5c2161667ff28d3da898b'), __v: 0 }

```

uncomment the following line in the ``Ex_1/src/index.ts`` file to use the old endpoint made for the orders project:

```javascript
//Endpoint at / with GET and POST that returns data with Content-Type: text/plain
app.use('/', orderRouter);

```


### Lab 2.2

Create a WebAPI with .Net and C# (you may reuse an old exercise) where data from post requeste are send through a message queue to a process (console app with C#) that write the data to the database.

## Exercise 3 - LavinMQ (Optional - only if time permits)

### Lab 3.1

Build a container based on Ubuntu 20.04 that runs LavinMQ and test that it works by using it as message queue service for lab 1.1 (or one of the other labs).
You can follow this guide to install LavinMQ on Ubuntu: <https://lavinmq.com/documentation/installation-guide>.