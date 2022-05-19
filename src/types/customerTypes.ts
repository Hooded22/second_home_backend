export interface ICustomer {
  name: string;
  lastName: string;
  birthDate: Date;
}

export interface ICustomerSchema extends ICustomer, Document {}
