import { Request, Response } from "express";
import Joi from "joi";
import { ICustomer } from "../types/customerTypes";
import { DateTime } from "luxon";

const addCustomerDataValidationSchema = Joi.object<ICustomer>({
  name: Joi.string().min(2).max(200).required(),
  lastName: Joi.string().min(2).max(200).required(),
  birthDate: Joi.date().required(),
});

export function validAddCustomerData(data: ICustomer) {
  const { error } = addCustomerDataValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  } else {
    return;
  }
}

export function validateCustomerAge(birthDate: Date) {
  const age = DateTime.fromJSDate(birthDate).diffNow("years").years;
  if (age < 18) {
    throw new Error("Customer is not mature");
  } else {
    return;
  }
}
