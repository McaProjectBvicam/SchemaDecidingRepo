const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const bcrypt=require('bcryptjs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
dotenv.config({path:'./config.env'});
//hide port number
const PORT = process.env.PORT;
app.use(require('../router/auth'));


// //mongo atlas
const mongoose= require('mongoose');
const DB = process.env.DATABASE;
//const DB = 'mongodb+srv://society:society@cluster0.5atb0.mongodb.net/ProjectSocietyDB?retryWrites=true&w=majority';

mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log(`Connection Successful`);
}).catch((err)=> console.log(`Error connecting to atlas`));


//require("./db/conn");
var nodemailer = require("nodemailer");

//for storing and showing some data 
var userlogin = "";
var societyname = "";
var currentUser = "";

const bodyParser = require('body-parser');

const PUBLISHABLE_KEY = "pk_test_51INbnLGQslJaHEn0wP5GYcVpiapPjFU1PXqu44AeeD2ijfNF12WpyXwDWshFVmvM5gFRfrvWN2eQZ16xin9NQrPY00Gy9Np7Tx"
const SECRET_KEY = "sk_test_51INbnLGQslJaHEn09tspZMEZMTipgFhabZoLboFDsT3bElif5UKdG1gYX8kmS6zg1yI1ZtmbMkvJSKDgbk1iEH9J00kVvMGsMl"
const stripe = require('stripe')(SECRET_KEY)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
require('dotenv').config();
const CLIENT_ID = "373958830210-0fmh41sdpa71kqp6gdkltahjvfh9ctad.apps.googleusercontent.com"
const CLIENT_SECRET = "qG9Z-EjvyNrfMKOaoHCeyBe4"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04OfhvT8vhbbCCgYIARAAGAQSNwF-L9IrYSXrb-2Pf2KnC8-pCp_YaIVFjlTgur0KYjaQXCYZj6JYyzn4hkdlVpiCL2wuNAR4TAg"

app.set("view engine", "ejs");

// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;
// const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// const accessToken = oAuth2Client.getAccessToken();

//const Register = require("./models/register");
//const Regsoc = require("./models/RegSoc");
//const socComplaintReg = require("./models/socComplaintReg");
//const socReservationReg = require("./models/socReservationReg");
//const societyNotice = require("./models/societyNotice");
//const societyDevelopment = require("./models/societyDevelopment");
//const payment = require("./models/payment");
//newly added
const societySchema = require("./models/societySchema");

//including css, views, partials
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

//to fetch our form values; without below 2 statements data entered by users is not gonna display on our page!
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: null } }))

app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})
app.listen(PORT, () => {
    console.log(`server is running at: ${PORT}`);

});