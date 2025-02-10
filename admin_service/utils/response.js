export class ResponseBuilder {
  static successResponse(
    res,
    body = {},
    message = "Success",
    code = 200,
    status = "success"
  ) {
    res.status(code).json({ code, status, message, body });
  }

  static errorResponse(
    res,
    body = {},
    message = "Internal Server Error",
    code = 500,
    status = "failure"
  ) {
    res.status(code).json({ code, status, message, body });
  }
  static sqlerrorResponse(
    res,
    body = {},
    code = 500,
    status = "failure",
    message = "SQL Error"
  ) {
    if (body.errno == 1062) {
      message = "Duplicate Entry";
      return res.status(200).json({ code: 200, status, message, body: {} });
    }
    res.status(code).json({ code, status, message, body });
  }
}
