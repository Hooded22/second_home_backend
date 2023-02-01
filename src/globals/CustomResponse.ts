class CustomResponse {
  constructor(data: Object | any[] | null, error: Error | null) {
    this.data = data;
    this.error = error;
  }

  data: Object | any[] | null = null;
  error: Error | null = null;

  json() {
    return {
      data: this.data,
      error: this.error?.message,
    };
  }
}

export default CustomResponse;
