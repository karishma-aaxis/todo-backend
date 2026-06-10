// This is Commom file for error handling -- we will use as global middleware errohandler

export const errorHandler = (err, req, res, next) => {
  console.log("Error Middleware Hit");
  console.error("Error :", err.message); // this on console

  // effective way from bacekend error
  const statusCode = err.statusCode || 500;

  console.log("Status Code:", statusCode);

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
