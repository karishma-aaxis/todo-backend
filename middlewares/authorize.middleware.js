export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Authorize middleware started");
    console.log("Allowed Roles:", roles);
    console.log("User Role:", req.user?.role);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    console.log("Authorization successful");
    next();
  };
};
