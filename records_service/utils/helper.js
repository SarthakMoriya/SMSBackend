export const errorResponse = (res, error) => {
  let code = error?.code || 500;
  let message = error?.message || "Internal Server Error";
  let status = error?.status || "fail";
  return res.status(code).json({ message, code, status });
};

export const successResponse = (res, data) => {
  let message = data?.message || "Success";
  let code = data?.code || 200;
  let status = "success";
  let body = data?.body || [];
  return res.status(code).json({ message, code, status, body });
};

export const errorLogger = (fn, mes) => {
  console.log("Error at:: " + fn + "\n Type: " + mes);
};
