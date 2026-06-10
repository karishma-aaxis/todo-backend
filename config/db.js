import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected Sucessfully");
  } catch (error) {
    console.log("Error in DB connection"); //custom error
    console.error(error.message); //normal error
    process.exit(1); // after one work process will exit
  }
};
