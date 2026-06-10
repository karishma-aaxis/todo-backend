// THis is nothing but wrapper

// This wraps with controllers--->if throws error --> then go next in this hile -->this go to error.middleware.js-->handle error

export const asyncHandler = (fn) => (req, res, next) => {
  console.log("asyncHandler started");

  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.log("Error caught by asyncHandler");
    console.log("Error Message:", error.message);

    next(error);
  });
};
