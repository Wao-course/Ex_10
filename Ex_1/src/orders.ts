import express from "express";
import { Request, Response } from "express";
import { readFile } from "fs/promises";
import { schema } from "./orderModel"; // Assuming OrderModel exports the model
import mongoose from "mongoose";

console.log("Order router initialized");
const router = express.Router();

try {

  try {
  // Attempt to create a MongoDB connection
  mongoose.connect(
    "mongodb://root:example@mongo:27017/", {dbName: "orders"}
  );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
  

  const orderModel = mongoose.model("Orders", schema, "orders");

  router.post("/seed", async (req: Request, res: Response) => {
    try {
        console.log("Attempting to delete existing orders...");
        await orderModel.deleteMany({}); // Emptying the orders collection

        console.log("Existing orders deleted successfully");

        console.log("Attempting to read data file...");
        let orders = await readFile("MOCK_DATA_MATERIALS.json", "utf-8");
        console.log("Data file read successfully");

        console.log("Attempting to parse data...");
        let OrdersData = await orderModel.insertMany(JSON.parse(orders));
        console.log("Data inserted successfully");

        res.json({
            orders: {
                ids: OrdersData.map((t) => t._id),
                cnt: OrdersData.length,
            },
        });
    } catch (error) {
        res.status(500).send("Error");
        console.error("Error seeding data:", error);
    }
  });
  // Get orders with optional filters
  router.get("/orders", async (req: Request, res: Response) => {
    try {
      let query: any = {};

      // Parse query parameters
      const { t, f, m, minAmount, maxAmount, currency } = req.query;

      // Add more query parameters as needed
      if (t) {
        query.timestamp = { $lte: new Date(t.toString()) }; // End date filter
      }
      if (f) {
        query.timestamp = { $gte: new Date(f.toString()) }; // Start date filter
      }
      if (m) {
        query.material = m.toString(); // Material filter
      }
      if (minAmount) {
        query.amount = { $gte: parseInt(minAmount.toString()) }; // Min amount filter
      }
      if (maxAmount) {
        query.amount = { $lte: parseInt(maxAmount.toString()) }; // Max amount filter
      }
      if (currency) {
        query.currency = currency;
      }

      let result = await orderModel.find(query, { __v: 0 }).lean();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  // Other routes...
  router.get("/", (req: Request, res: Response) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.send("Welcome to Orders Page");
  });
  // Other routes...
  router.get("/GetOrders", (req: Request, res: Response) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.send("Getting Orders");
  });

  router.post("/orders", (req: Request, res: Response) => {
    res.send("posting Orders");
  });
  router.get("/orders/:uid", (req: Request, res: Response) => {
    res.send("Getting Orders by ID");
  });
  router.put("/orders/:uid", (req: Request, res: Response) => {
    res.send("putting Orderrs by ID");
  });
  router.patch("/orders/:uid", (req: Request, res: Response) => {
    res.send("patching Orders by ID");
  });

  router.delete("/orders/:uid", (req: Request, res: Response) => {
    res.send("Deleting orders by ID");
  });
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  // Handle the error gracefully, for example, send a 500 response to the client
  router.use((req: Request, res: Response) => {
    res.status(500).send("Internal Server Error");
  });
}

export default router;

