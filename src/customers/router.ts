import { Router, Request, Response } from "express";
import errorMessages from "../assets/errorMessages";
import {
  validateAddCustomeRequest,
  validateUpdateCustomerRequest,
} from "./controllers";
import Customer from "./model";
import Reservation from "../reservation/model";
import { CustomerWithReservations, ICustomer } from "./types";
import auth from "../routes/verifyToken";

const customerRouter = Router();

customerRouter.use("/", auth);

customerRouter.get("/", async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    return res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal error");
  }
});

customerRouter.get("/withReservations", async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    const customersWithReservations: CustomerWithReservations[] = [];
    for (const customer of customers) {
      const reservations = await Reservation.find().where({
        customerId: customer._id,
      });
      console.log("TEST: ", customer._id, reservations);
      if (reservations && reservations.length !== 0) {
        customersWithReservations.push({
          name: customer.name,
          lastName: customer.lastName,
          birthDate: customer.birthDate,
          reservations: reservations,
        });
      }
    }
    return res.status(200).json(customersWithReservations);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal error");
  }
});

customerRouter.post(
  "/",
  validateAddCustomeRequest,
  async (req: Request<any, any, ICustomer>, res: Response) => {
    const customer = new Customer(req.body);
    try {
      customer.save();
      res.status(200).json(customer);
    } catch (error) {
      console.error(error);
      return res.status(500).send(errorMessages.internalError);
    }
  }
);

customerRouter.put(
  "/",
  validateUpdateCustomerRequest,
  async (
    req: Request<any, any, Partial<ICustomer>, { id: string }>,
    res: Response
  ) => {
    try {
      const result = await Customer.findByIdAndUpdate(req.query.id, req.body);
      if (result) {
        const newCustomer = await Customer.findById(result._id);
        return res.status(200).send(newCustomer);
      } else {
        throw new Error(errorMessages.incorectId);
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
);

customerRouter.delete(
  "/",
  async (req: Request<any, any, any, { id: string }>, res: Response) => {
    try {
      await Customer.findByIdAndDelete(req.query.id);
      return res.status(200).send("Delete successfully");
    } catch (error) {
      return res.status(400).send(errorMessages.incorectId);
    }
  }
);

export default customerRouter;
