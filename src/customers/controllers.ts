import { NextFunction, Request, Response } from "express";
import errorMessages from "../assets/errorMessages";
import Customer from "./model";
import { ICustomer } from "./types";
import {
  validAddCustomerData,
  validateCustomerAge,
  validEditCustomerData,
} from "./validators";

export function validateAddCustomeRequest(
  req: Request<any, any, ICustomer>,
  res: Response,
  next: NextFunction
) {
  try {
    validAddCustomerData(req.body);
    validateCustomerAge(req.body.birthDate);
    next();
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}

export async function validateUpdateCustomerRequest(
  req: Request<any, any, Partial<ICustomer>, { id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const customerToUpdate = await Customer.findById(req.query.id);
    if (!customerToUpdate) throw new Error(errorMessages.incorectId);

    validEditCustomerData(req.body);
    req.body.birthDate && validateCustomerAge(req.body.birthDate);

    next();
  } catch (error: any) {
    console.error(error.message);

    return res.status(400).send(error.message);
  }
}
