export class ResponseBuilder {
  static successResponse(
    res,
    body = {},
    code = 200,
    status = "success",
    message = "Success",
  ) {
    res.status(code).json({ code, status, message, body });
  }

  static errorResponse(
    res,
    body = {},
    code = 500,
    status = "failure",
    message = "Internal Server Error",
  ) {
    res.status(code).json({ code, status, message, body });
  }
  static sqlerrorResponse(
    res,
    body = {},
    code = 500,
    status = "failure",
    message = "SQL Error",
  ) {
    res.status(code).json({ code, status, message, body });
  }
}
