import { NextFunction, Request, Response } from "express";
import errorMessages from "../assets/errorMessages";
import Customer from "../models/customerModel";
import { ICustomer } from "../types/customerTypes";
import {
  validAddCustomerData,
  validateCustomerAge,
} from "../validators/customerValidators";

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

    const newCustomer: ICustomer = { ...customerToUpdate, ...req.body };

    validAddCustomerData(newCustomer);
    req.body.birthDate && validateCustomerAge(req.body.birthDate);

    next();
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}
