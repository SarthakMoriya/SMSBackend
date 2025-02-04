export class Responder {
  static success = (res, code = 200, status = "success", body = {}) => {
    return res.status(code).json({ status, code, body });
  };
  static error = (
    res,
    code = 500,
    status = "fail",
    message = "Internal Server Error",
    body = {}
  ) => {
    console.log(code);
    return res.status(code).json({ status, code, message, body });
  };
}
