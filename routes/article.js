import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();
import Article from "../models/Article";
import User from "../models/User"

// Getting article form page
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("add_article", {
        title: "Add article"
    });
});


// Posting an article
router.post("/add", 
    body("title").notEmpty(),
    body("body").notEmpty(),
    
    (req, res) => {
    
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            console.log(errors.array());

            res.render("add_article", {
                title: "Add article",
                errors: errors.array()
            });
        } 
        else {
            let article = new Article();
            article.title = req.body.title;
            article.author = req.user._id;
            article.body = req.body.body;
    
            article.save((err) => {
                if (err) 
                    throw err;
                
                req.flash("success", "Article Added");
                res.redirect("/");
            });
        }
});


// Get single article
router.get("/:id", (req, res) => {

    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user)=>{
                if (err)
                    throw err;

                res.render("article", {
                    title: article.title,
                    article: article,
                    author: user.name
            });
        });
    });
});


// Load Edit form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {

    
    Article.findById(req.params.id, (err, article) => {
        
        if (err)
            throw err;

        if (article.author != req.user._id) {
            req.flash("danger", "Not Authorized!");
            res.redirect("/");
        } else {
            
            res.render("edit_article", {
                title: "Edit: " + article.title,
                article: article
            });
        }
    });
});


// Updating an article
router.post("/edit/:id",
    body("title").notEmpty(),
    body("body").notEmpty(),    
    
    (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            console.log(errors.array());

            Article.findById(req.params.id, (err, article) => {
                if (err)
                    throw err;
        
                res.render("edit_article", {
                    title: "Edit: " + article.title,
                    article: article,
                    errors: errors.array()
                });
            });
        } 
        else {
            let article = {};
            article.title = req.body.title;
            article.author = req.user._id;
            article.body = req.body.body;
            
            let query = {_id: req.params.id};
        
            Article.updateOne(query, article, (err) => {
                if (err) 
                    throw err;
                
                req.flash("success", "Article Updated");
                res.redirect("/");
            });
        }
});


// Deleting an article
router.delete("/:id", (req, res) => {

    if(!req.user._id) {
        res.status(500).send();
    }

    let query = {_id: req.params.id};

    Article.findById(req.params.id, (err, article)=>{
        if(article.author != req.user._id){
            res.status(500).send();           
        } else {
            Article.remove(query, (err) => {
                if (err) 
                    throw err;
                
                res.send("SUCCESS");
            });
        }
    });
});


// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("danger", "Please Log in!");
        res.redirect("/users/login");
    }
};


export default router;