const errorMessages = {
  userNotFound: "User not found",
  permissionDenied: "Permission denied",
  internalError: "Internal error",
  incorectId: "Incorect id. Item with this it don't exist in database",
  roomWithNumberAlreadyExist: "Room with this number already exist",
  findError: "Unable to find element",
  userAlreadyExists: "User with this email exists in data base",
};

export const commonErrorSatusCodes = {
  notFound: 404,
  operationFailed: 400,
  internalError: 500,
};

export default errorMessages;
