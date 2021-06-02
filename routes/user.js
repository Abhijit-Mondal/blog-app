import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();
import User from "../models/User";
import bcrypt from "bcryptjs";
import passport from "passport";

// Register Form
router.get("/register", (req, res)=>{
    res.render("register", {
        title: "Register New User"
    });
});


// Register Process
router.post("/register",
    body("name").notEmpty().withMessage("Name is required!"),
    body("email").notEmpty().withMessage("Email is required!").isEmail().withMessage("Email is not valid!"),
    body("username").notEmpty().withMessage("Username is required!"),
    body("password").notEmpty().withMessage("Password is required!"),
    body("password2").notEmpty()
    .withMessage("Confirm Password is required!")
    .custom((value, { req }) => value == req.body.password)
    .withMessage("Passwords do not match!"),

    (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            console.log(errors.array());

            res.render("register", {
                title: "Register New User",
                errors: errors.array()
            });
        } 
        else {
            // Creating new user
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            });
    
            // Encrypting password
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if (err) {
                        console.log(err);
                    }
                    console.log(hash);
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) 
                            throw err;
                        
                        req.flash("success", "User Registered, please log in");
                        res.redirect("/users/login");
                    });
                });
            });
        }
});


// Login Form
router.get("/login", (req, res)=>{
    res.render("login", {
        title: "Login"
    })
});


// Login Process
router.post("/login", (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true,

    })(req, res, next);
});


//Logout
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "You are logged out!");
    res.redirect("/users/login");
});

export default router;