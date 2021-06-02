import { Router } from "express";
const router = Router();
// Loading models
import Article from "../models/Article";
import User from "../models/User";

// Getting homepage
router.get("/", (req, res) => {
    Article.find({}, (err, articles)=>{
        if(err)
            console.log(err);
        
        User.find({}, (err, users)=>{
            if (err)
                console.log(err);

            res.render("index", {
                title: "Homepage",
                articles: articles,
                users: users
            });
        });
    });
});


export default router;