        if(process.env.NODE_ENV !="production"){
            require('dotenv').config();
            // console.log(process.env);
        }
        
        const express= require("express");
        const app=express();
        const port=8080;
        const mongoose=require("mongoose");
        const path=require("path");
        const methodOverride=require("method-override");// js doesnot directly supports the delete, put ,patch so we have to use the method override to apply delete,put,patch requests
        const ejsMate= require("ejs-mate");
        const ExpressError=require("./utils/ExpressError.js");
        const flash=require("connect-flash");// for flash message
        const session = require("express-session");// cookie session
        const MongoStore = require('connect-mongo').default;//mongo seassion store
        const passport=require("passport"); //Passport is Express-compatible authentication middleware for Node.js.
        const LocalStrategy=require("passport-local");
        const User=require("./models/user.js");

        const dbUrl=process.env.ATLAS_URL;
        // connected with the database
        main().then(()=>{
            console.log("conncetd to DB");
        }) .catch(err=>{
            console.log(err+"notworking");
        })

        async function main(){
            await mongoose.connect(dbUrl);
        }

        app.set("view engine","ejs");
        app.set("views",path.join(__dirname,"views"));
        app.use(express.urlencoded({extended:true}));
        app.use(methodOverride("_method"));
        app.engine("ejs",ejsMate);
        app.use(express.static(path.join(__dirname,"/public")));

        //mongo session store
       const store = MongoStore.create({
            mongoUrl: dbUrl,
            crypto: {
                secret: process.env.SESSION_SECRET
            },
            touchAfter: 24 * 3600
            });
        //cookie session
        const sessionOption = {
            store: store,
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                expires: Date.now() + 7*24*60*60*1000,
                maxAge: 7*24*60*60*1000,
                httpOnly: true
            }
            };

        //root routes
        // app.get("/",(req,res)=>{
        //     res.send("hi");
        // });


        app.use(session(sessionOption));
        app.use(flash());
        // we have to use the passport after the session because when a user is loged in if the user moved to another they no need to login again

        //passport initialized
        app.use(passport.initialize());// middleware that initialize passport
        app.use(passport.session()); //a web application needs the ability to identify users as they browsw from page to page. This series of requests and responses, each associated with same user is known as a session
        passport.use(new LocalStrategy(User.authenticate()));// created new local strategy so that a new user login or signin it authenticate by the passport authentication method

        passport.serializeUser(User.serializeUser());// serialize means store the user information
        passport.deserializeUser(User.deserializeUser());// when remove the userinformation is called deserialization

        //flash messages
        app.use((req,res,next)=>{
            //res.locals used for to access the information into ejs file
            // res.locals.variable_name --> ei variable_name ta ejs file e send hoy 
            // jar jonno ekhane j name ta lekha hobe otai ejs file e likhte lagbe
            res.locals.succuseMsg=req.flash("success");
            res.locals.errorMsg=req.flash("error");
            res.locals.currentUser=req.user;
            next();
        });

       
        // routes initialized by require -->
        const listingRoutes= require("./Routs/listing.js");
        const reviewRoutes=require("./Routs/review.js");
        const userRoutes=require("./Routs/user.js");


        // restructure by the routings
        app.use("/listings",listingRoutes);
        app.use("/listings/:id/reviews",reviewRoutes);
        app.use(userRoutes);


        // it is default error handling midleware that works for any route which does not exist in our project
        app.use((req,res,next)=>{
            next(new ExpressError(400,"Page not found"));
        });

        // using the ExpressError class this middle ware handling the error .. so that the app doesn't crashed
        app.use((err,req,res,next)=>{
            let {statusCode=500,message="invalid !!"}=err;
            // console.log("working here");
            res.status(statusCode).render("error.ejs",{message});
        });

        app.listen(port,()=>{
            console.log("app is listing the port "+port);
        });