// Defining the article model
import mongoose from "mongoose";
const { Schema } = mongoose;
// Creating the schema
const articleSchema = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    body: {type: String, required: true}
});
// Creating the model
const Article = mongoose.model("Article", articleSchema);
// Exporting the model
export default Article;
