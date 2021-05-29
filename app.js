require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const _ = require('lodash');
//package for google
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//package related to google
const findOrCreate = require("mongoose-findorcreate");

const upload = require("express-fileupload");


//setting ejs as viewengine
app.set('view engine', 'ejs');
//using local files
app.use(express.static("public"));
//allowing app to use body parser
app.use(bodyParser.urlencoded({extended:true}));

app.use(upload());
//creating session, so that we donot have to login again and again
app.use(session({
  secret: "long secret key in .env file",
  resave:false,
  saveUninitialized:false
}));


//initializing passport and passport session
app.use(passport.initialize());
app.use(passport.session());

//connecting to mongodb
mongoose.connect("mongodb+srv://admin_manan:mv@123manan@cluster0.dbaic.mongodb.net/userDB",   { useNewUrlParser:true ,  useUnifiedTopology: true} );
//line below is to remove warning, if any
mongoose.set("useCreateIndex", true);

//making the schema of the user which will record only password and email
const userSchema = new mongoose.Schema({
  email : String,
  password:String,
  googleId:String
});

//making userSchema which will contain all the details
const userSchema2 = new mongoose.Schema({
  phone:Number,
  firstName : String,
  email : String,
  password:String,
  lastName:String
})

const placesSchema = new mongoose.Schema({
  district : String,
  state: String,
  locality : String,
  houseNumber : String,
  ownerName : String,
  rent: Number,
  description : String,
  type : String,
  pincode : Number,
  availiblityPeriod : String,
  ownerEmail : String,
  imageUrl :String,
  imageId:Number,
  area:Number
});


//adding passportLocalMongoose and findOrCreate plugin
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//creating model for userSchema main
const User = new mongoose.model("User", userSchema);
//creating model for userSchema2(which stores all data)
const UserModel2 = new mongoose.model("UserDetail", userSchema2);

//creating model for places
const placeModel = new mongoose.model("Place", placesSchema);

//making Strategy using passport
passport.use(User.createStrategy());


//serializing and deserializing user, for local as well as google Strategies
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



//creating google Strategy
passport.use(new GoogleStrategy({
  //id and secret fetched from .env file
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,

  //url added in the google developer console
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    //authentication succesful.
    //profile will be granted
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));




app.get("/", function(req, res){

  // var place = new placeModel({
  //   district : "Jaipur",
  //   state: "Rajasthan",
  //   locality : "Hasan Khan",
  //   houseNumber : "G-56",
  //   ownerName : "Manan",
  //   rent: "2344",
  //   description : "",
  //   type : "3-BHK",
  //   pincode : 301001,
  //   availiblityPeriod : "LongTime",
  //   ownerEmail : "man@gmail.com"
  // });
  // place.save();
  // console.log("saved Successfully");

  // UserModel2.find({email:"man@gmail.com"}, function(err, docs){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     console.log(docs[0].phone + " " + docs[0].firstName + " " + docs[0].lastName);
  //   }
  // })
  // res.sendFile(__dirname + "/views/index.html");
  if(req.isAuthenticated()){



      var email = req.user.username;
      UserModel2.find({email:email}, function(err, docs){
        if(err){
          console.log(err);
        }
        else{
          res.render('index-2', {topbutton:email});
        }
      })
  }
  else{
      res.render('index-2', {topbutton:"LOGIN/SIGNUP"});
  }

})


//getting request to /auth/google(when user presses signin or login button)
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));


//what will happen if authentication is succesful(getting request at /auth/google/secrets)
app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.get("/find-house", function(req, res){
  //sending find-house.html on loading.
  res.sendFile(__dirname + "/views/find-house.html")
})

app.get("/list-your-house", function(req, res){
  if(req.isAuthenticated()){
// sending list-your-house homepage
  res.render("list-your-house");
  // console.log("Post request working");

  }
else{
  res.redirect("/login");
}

});

//when user enters the location and presses search button
app.post("/find-house", function(req, res){
  console.log("Post request working");
    console.log(req.body);

    //finding the name of district from the data which user has entered
    var placeString = req.body.place;
    var i = 0;
    console.log(placeString);
    var place = "";

    //getting only the first word of the location(district name) by finding the comma
    while(placeString.charAt(i) !== ','){
      place = place + placeString.charAt(i);
      i++;
    }

    //using lodash to perfectly maintain the url
    _.lowerCase(place);
      console.log(place);

    // redirecting to findhouse + place according to the district entered by the user.
      res.redirect("/find-house/" + place);
});

app.post("/login-signup", function(req, res){
    // console.log("a tag working");
    res.redirect("/login")
});


//listening to the requests

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started succesfully");
});


//getting request at /register
app.get("/register", function(req, res){
  res.sendFile(__dirname + "/views/register.html");
});

//when the user clicks the submit button on register page to make post request
app.post('/register', function(req, res){
  var email = req.body.username;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var phone = req.body.phoneNumber;

  //making user with all details and saving it
  const newUser = new UserModel2({
    firstName : firstName,
    lastName : lastName,
    phone : phone,
    email : email,
    password : password
  })
  newUser.save();
  console.log("Saved Successfully");


  //registering the user with passportjs
  User.register({username:email}, password, function(err, user){
    if(err){
      console.log(err);
    }
    else{
      passport.authenticate("local")(req, res, function(){
        //authenticattion success
        console.log("success");
        //redirecting to the homepage
        res.redirect("/");
      })
    }
  })
});



app.get("/secret", function(req, res){
  //THIS PAGE IS PROTECTED PAGE, ONLY THOSE USERS WHO HAVE LOGGED IN CAN ACCESS THIS PAGE


  //if user is authenticated(means in current session, if user is authenticated)
  if(req.isAuthenticated()){
    res.sendFile(__dirname + "/views/index.html");
  }
  //if not authenticated, redirect to login page
  else{
      res.redirect("/login");
  }
});


//when login button is pressed
app.get("/login", function(req, res){
  res.sendFile(__dirname + "/views/login.html");
});

//when user clicks the login button on login page
app.post("/login", function(req ,res){
    //making new user which we can pass in passport verification
    const user  = new User({
    username : req.body.username,
    password : req.body.password
    });

    //checking if user if correct or not
    req.login(user, function(err){
      if(err){
        console.log(err);
        //if authentication fails, then coming back to login page
        res.redirect("/login");
      }
      else{
        //checking if credentials are correct or not
        passport.authenticate("local")(req, res, function(){
          //if credentials are correct, redirect to homepage
          res.redirect("/");
        });
      }
    })

});

//filter by house type
app.get("/find-house/:place/houseType:flatType", function(req, res){
    var username = req.user.username;
    var district = req.params.place;
    var flatType = req.params.flatType;
    console.log(flatType);
      if(req.isAuthenticated()){
        //finding the data of houses according to the name of district taken through params
         placeModel.find({district : district, type: flatType}, function(err, docs){
           if(err){
             console.log(err);
           }
           else{
             // console.log(docs[0]);
             // var imageIdPosition = "/uploads/" + docs[0].imageId + ".jpg";
             // console.log(imageIdPosition);
             //sending house-list file along with the array containing the data of houses available
             res.render("house-list", {docs:docs, district : district, user:username});
           }
         });
      }
      else{
            res.redirect("/login");
          }
    }
);

//filter by house rent price.
app.get("/find-house/:place/price:rent", function(req, res){
  if(req.isAuthenticated()){
    var username = req.user.username;
    var district = req.params.place;
    var rent = req.params.rent;

    //rendering different documents on the basis of button clicked.
    if(rent === "lt5000"){
      console.log("working till here");
      //finding the data of houses according to the name of district taken through params
      placeModel.find({district : district, rent:2000}, function(err, docs){
         if(err){
           console.log(err);
         }
         else{
           // console.log(docs[0]);
           // var imageIdPosition = "/uploads/" + docs[0].imageId + ".jpg";
           // console.log(imageIdPosition);
           //sending house-list file along with the array containing the data of houses available
           res.render("house-list", {docs:docs, district : district, user:username});
         }
       });
    }
    else if(rent === "bw5010"){
      placeModel.find({district : district, rent: {$gt:5000, $lt:10000}}, function(err, docs){
         if(err){
           console.log(err);
         }
         else{
           // console.log(docs[0]);
           // var imageIdPosition = "/uploads/" + docs[0].imageId + ".jpg";
           // console.log(imageIdPosition);
           //sending house-list file along with the array containing the data of houses available
           res.render("house-list", {docs:docs, district : district, user:username});
         }
       });

    }
    else if(rent === "bw1015"){
      placeModel.find({district : district, rent: {$gt:10000, $lt:15000}}, function(err, docs){
         if(err){
           console.log(err);
         }
         else{
           // console.log(docs[0]);
           // var imageIdPosition = "/uploads/" + docs[0].imageId + ".jpg";
           // console.log(imageIdPosition);
           //sending house-list file along with the array containing the data of houses available
           res.render("house-list", {docs:docs, district : district, user:username});
         }
       });

    }
    else if(rent === "gt15"){
      placeModel.find({district : district, rent: {$gt:15000}}, function(err, docs){
         if(err){
           console.log(err);
         }
         else{
           // console.log(docs[0]);
           // var imageIdPosition = "/uploads/" + docs[0].imageId + ".jpg";
           // console.log(imageIdPosition);
           //sending house-list file along with the array containing the data of houses available
           res.render("house-list", {docs:docs, district : district, user:username});
         }
       });

    }
    else{
          console.log("fuck");
    }




      }
      else{
            res.redirect("/login");
          }
    }
);

//using express routing parameters to set up get request for differect districts
app.get('/find-house/:place/', function (req, res) {
    var district = req.params.place;

   if(req.isAuthenticated()){
     var username = req.user.username;
     //finding the data of houses according to the name of district taken through params
      placeModel.find({district : district}, function(err, docs){
        if(err){
          console.log(err);
        }
        else{
          // console.log(docs[0]);
          // var imageIdPosition = "/uploads/" + docs[0].imageId + ".jpg";
          // console.log(imageIdPosition);
          //sending house-list file along with the array containing the data of houses available
          res.render("house-list", {docs:docs, district : district, user:username});
        }
      });



    }
    else{
        res.redirect("/login");
      // })
    }

  // res.send(req.params);
})

//array which stores all imageId to cross crosscheck that any image id is not used again.
var imageIdArray = [];

//post request is made to this route when user clicks the register house button
app.post("/register-done", function(req, res){
    console.log(req.body);
    //fetching district name from the request
    var dis = req.body.districtName;
    dis.toString();

    //converting district string into camelcase letters
    var district = dis.substring(0,1).toUpperCase() + dis.substr(1,dis.length).toLowerCase()

    //creating imageId for new house.(using random)
    var imageId = Math.floor(Math.random()*100000);
    while(imageIdArray.includes(imageId)){
      imageId = Math.floor(Math.random()*100000);
    }
    imageIdArray.push(imageId);


    //making the newhouse object of placemodel, by fetching data from the post request made from
    //list-your-house.ejs
    const newHouse = new placeModel({
      district : district,
      state: req.body.state,
      locality : req.body.houseNumber,
      houseNumber : req.body.houseNumber,
      //owner name is given the value of id of the user which is lending the house
      ownerName : req.user.username,
      rent: req.body.rent,
      description : req.body.description,
      type : req.body.apartment,
      availiblityPeriod : req.body.availiblity,
      //same email for owner email as well
      ownerEmail : req.user.username,
      imageId:imageId,
      area:req.body.area
    });

    console.log(newHouse);

    //saving the newhouse object created.
    newHouse.save();


    //transferring the file from users pc to the uploads folder.
    if(req.files){
        console.log(req.files);
        //getting the file
        var file = req.files.file;
        //giving name to the file along with the extension.
        var filename = imageId + ".jpg";

          //moving file to the uploads folder
          file.mv("./public/uploads/" + filename, function(err){
            if(err){
              console.log(err);
            }
            else{
              console.log("done");
            }
          })
      }

      //new house has been registered.
      res.send("Registered");
});

app.get("/image", function(req, res){
    res.sendFile(__dirname + "/uploads/" + "69178" + ".jpg");
});
