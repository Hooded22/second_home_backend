class AppError extends Error {
  public readonly commonType: string;
  public readonly code: number;
  public readonly isOperational?: boolean;
  public readonly description?: string;

  constructor(
    commonType: string,
    code: number,
    description?: string,
    isOperational?: boolean
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.commonType = commonType;
    this.isOperational = isOperational;
    this.description = description;

    Error.captureStackTrace(this);
  }
}
