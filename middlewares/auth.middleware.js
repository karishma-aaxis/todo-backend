import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    console.log("Authenticate middleware started");
    // reads header
    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }
    //extract token
    const token = authHeader.split(" ")[1];
    console.log(" Extracted TOKEN:", token);

    //verify token -jwt checks valid?,expired?,tampered?(someone has changed the token data  after  created)
    //The server verifies the signature using JWT_SECRET and  if valid then extracts the payload.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Payload:", decoded);

    // attch user
    req.user = decoded;
    console.log("User attached to req.user:", req.user);
    console.log("Authentication successful");
    next();
  } catch (error) {
    console.log("Authentication failed");
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
