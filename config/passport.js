import {Strategy} from "passport-local"
import User from "../models/User"
import config from "../config/database"
import bcrypt from "bcryptjs"
import passport from "passport"


export default ()=>{
    // Local Strategy
    passport.use(new Strategy((username, password, done)=>{
        // Match username
        let query = {username: username};

        User.findOne(query, (err, user)=>{
            if(err)
                throw err;
            if(!user)
                return done(null, false, { message: 'No user found!' });
            
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err)
                    throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Wrong Password!' });
                }
            });
        });
    }));


    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}
