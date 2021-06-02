import mongoose from "mongoose";
const { Schema } = mongoose;
// Creating the schema
const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
});
// Creating the model
const User = mongoose.model("User", userSchema);
// Exporting the model
export default User;
