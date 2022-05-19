import { model, Schema } from "mongoose";
import { ICustomerSchema } from "../types/customerTypes";

const customerSchema = new Schema<ICustomerSchema>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
});

const Customer = model<ICustomerSchema>("CustomerModel", customerSchema);

export default Customer;
