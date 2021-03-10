const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const port = process.env.PROCESS || 8000;
require("./db/conn");
var userlogin = "";
var societyname="";
const payment = require("./models/payment");
const bodyParser = require('body-parser')
const PUBLISHABLE_KEY = "pk_test_51INbnLGQslJaHEn0wP5GYcVpiapPjFU1PXqu44AeeD2ijfNF12WpyXwDWshFVmvM5gFRfrvWN2eQZ16xin9NQrPY00Gy9Np7Tx"
const SECRET_KEY = "sk_test_51INbnLGQslJaHEn09tspZMEZMTipgFhabZoLboFDsT3bElif5UKdG1gYX8kmS6zg1yI1ZtmbMkvJSKDgbk1iEH9J00kVvMGsMl"
const stripe = require('stripe')(SECRET_KEY)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
require('dotenv').config();
const CLIENT_ID="373958830210-0fmh41sdpa71kqp6gdkltahjvfh9ctad.apps.googleusercontent.com"
const CLIENT_SECRET="iIOW_WmNZQFMc4qgtpyW9qF0"
const REDIRECT_URI="https://developers.google.com/oauthplayground"
const REFRESH_TOKEN="1//04r7aoyb-Lpi2CgYIARAAGAQSNwF-L9IrD2jweh3G8_C35Ka8rn4Q0KWD_SyiL7gnpywX8pQyX8NiReqQWSQxO-4vWXCWPiIEyNI"
app.set("view engine", "ejs");
var nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2=google.auth.OAuth2;
const oAuth2Client = new OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
const accessToken=oAuth2Client.getAccessToken();

const Register = require("./models/register");
const Regsoc = require("./models/RegSoc");
const socComplaintReg = require("./models/socComplaintReg");
const socReservationReg = require("./models/socReservationReg");
const societyNotice = require("./models/societyNotice");
const societyDevelopment = require("./models/societyDevelopment");

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


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/Regsoc", (req, res) => {
    res.render("Regsoc");
});
app.get("/login", (req, res) => {
    res.render("login");

});
app.get("/rwalogin", (req, res) => {
    res.render("rwalogin");

});
app.get("/societylogin", (req, res) => {
    res.render("societylogin");
});
app.get("/userpayment", (req,res)=>{
    res.render("userpayment");
});
app.get("/complaintRegister", (req, res) => {
    res.render("complaintRegister");
});

app.get("/rwaCreateNotice", (req, res) => {
    res.render("rwaCreateNotice");
});

app.get("/rwaDevelopmentEntries", (req, res) => {
    res.render("rwaDevelopmentEntries");
});

app.get("/booking", (req, res) => {
    res.render("booking");
});

app.get("/socMemRegister", (req, res) => {
    res.render("socMemRegister");
});

app.get("/myprofile", (req, res) => {
    res.render("myprofile");
});
app.get('/payment', (req, res) => {
    res.render('payment', {
        key: PUBLISHABLE_KEY
    })
})
app.get("/development", (req, res) => {
    res.render("development");
});
app.get("/rwaMemberDashBoard", (req, res) => {
    res.render("rwaMemberDashBoard");
});
app.get("/socMemDashBoard", (req, res) => {
    res.render("socMemDashBoard");
});

app.get("/socMemReadNotice", (req, res) => {

    //res.render("socMemReadNotice");

    societyNotice.find((err, docs) => {
        if (!err) {
            res.render("socMemReadNotice", {
                list: docs
            });
        }
        else {
            console.log("Error in reading Notice collection:" + err);
        }
    });

});

app.get("/socMemReadDevelopment", (req, res) => {

    societyDevelopment.find((err, docs) => {
        if (!err) {
            res.render("socMemReadDevelopment", {
                list: docs
            });
        }
        else {
            console.log("Error in reading Development collection:" + err);
        }
    });
});

app.get("/socMemReadBooking", (req, res) => {

    socReservationReg.find((err, docs) => {
        if (!err) {
            res.render("socMemReadBooking", {
                list: docs
            });
        }
        else {
            console.log("Error in reading Development collection:" + err);
        }
    });
});


app.get("/socMemReadComplaint", (req, res) => {

    socComplaintReg.find((err, docs) => {
        if (!err) {
            res.render("socMemReadComplaint", {
                list: docs
            });
        }
        else {
            console.log("Error in reading complaint collection:" + err);
        }
    });

});

//crate a new user in database
app.post('/login', async (req, res) => {

    console.log('login body', req.body);
})
app.post("/index", async (req, res) => {

    try {
        societyname = req.body.socname;
        const socName = await Regsoc.findOne({ socname: societyname })

        if (socName.socname === societyname) {
            res.status(201).render("login");
        }
        else {
            res.send("invalid");
            res.status(201).render("RegSoc");
        }

    } catch (error) {
        res.status(201).render("RegSoc");
    }
});

app.post("/Regsoc", async (req, res) => {
    try {
        const socreg = new Regsoc({
            socname: req.body.socname,
            presname: req.body.presname,
            district: req.body.district,
            district: req.body.district,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            email: req.body.email,
        })

        const socregistered = await socreg.save();
        res.status(201).render("login");

    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/socMemRegister", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerMember = new Register({
                societyname: societyname,
                name: req.body.name,
                hnumber: req.body.hnumber,
                fnumber: req.body.fnumber,
                familymemcount: req.body.familymemcount,
                sname: req.body.sname,
                dname: req.body.dname,
                owner: req.body.owner,
                dob: req.body.dob,
                phone: req.body.phone,
                email: req.body.email,
                password: password,
                cpassword: cpassword,
                
            })

            const registered = await registerMember.save();
            res.status(201).render("societylogin");

        }
        else {
            res.send("pass are not matching");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});
app.post("/rwalogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        //this will find to whom the entered email belongs to in our mongodb 
        const rwaemail = await Register.findOne({ email: email })

        //to check if my useremail is working or not
        // res.send(useremail);
        //console.log(email);
        userlogin = email;
        //console.log(userlogin);
        //checking password
        if (rwaemail.password === password) {
            res.status(201).render("rwaMemberDashBoard");
        }
        else {
            res.send("Invalid Details");
        }

    }
    catch (error) {
        res.status(400).send("invalid");
    }
});
app.post("/societylogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        userlogin = email;
        //this will find to whom the entered email belongs to in our mongodb 
        const socemail = await Register.findOne({ email: email });
        if (socemail.password === password) {
            res.status(201).render("socMemDashBoard");
        } else {
            res.send("Invalid Details");
        }

    } catch (error) {
        res.status(400).send("invalid");
    }
});


app.post('/userpayment', async (req, res) => {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("ProjectSocietyDB");
        //console.log(dbo);
        //console.log('hello');
        //const loginemail= await Register.find({email:userlogin})
        dbo.collection("paymentdbs").find({ useremail: userlogin }).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.render("userpayment", {
                list: result
            });
            db.close();
        });
    });


});

app.post("/complaintRegister", async (req, res) => {
    try {
        const registerComplaint = new socComplaintReg({
            societyName: req.body.socName,
            societyMemberName: req.body.socMemName,
            complaintSubject: req.body.compSubject,
            complaintDesc: req.body.compDescription,
            complaintDate: req.body.compDate,
            complaintStatus: req.body.compStatus,

        })

        const compRegistered = await registerComplaint.save();
        res.status(201).render("socMemDashboard");
    } catch (error) {
        res.status(400).send("invalid " + error);
    }


});

app.post("/booking", async (req, res) => {
    try {
        const registerReservation = new socReservationReg({
            societyName: req.body.socName,
            societyMemberName: req.body.socMemName,
            reservationFor: req.body.reserve,
            reservationDesc: req.body.resDescription,
            reservationDate: req.body.resDate,
            reservationStatus: req.body.resStatus

        })

        const resRegistered = await registerReservation.save();
        res.status(201).render("socMemDashboard");
    } catch (error) {
        res.status(400).send("invalid " + error);
    }
});

app.post('/payment', async (req, res) => {
    try {
        console.log('req body', req.body);
        const customer = await stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            /*name:'Gautam Sharma',
           // address:{
                line1:'23 Mountain Valley New Delhi',
                postal_code:'110092',
                city:'New Delhi',
                state:'Delhi',
                country:'India'
            }*/
        })
        //console.log("hello");
        const charge = await stripe.charges.create({
            amount: 1000,
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        })
        //console.log("i am before if");
        //console.log(charge.amount);
        const ab = await charge.amount;
        //console.log(ab);
        if (ab) {
            console.log(userlogin);
            //console.log(new Date());
            const pay = new payment({
                email: req.body.stripeEmail,
                useremail: userlogin,
                amount: 1000,
                datetime: new Date(),
                status: "Success"
            })
            const pays = await pay.save();

            //console.log(pay);
            res.status(201).render("userpayment");
            //console.log('hello');

        }
    } catch (err) {
        res.send(err);
    }
});

app.post("/rwaCreateNotice", async (req, res) => {

    try {
        const createNotice = new societyNotice({
            societyName: req.body.socName,
            noticeDate: req.body.noticeDate,
            noticeHeading: req.body.noticeHeading,
            noticeDesc: req.body.noticeDate,
            noticeLink: req.body.noticeLink
        })

        const resRegistered = await createNotice.save();
        res.status(201).render("rwaMemberDashBoard");
    } catch (error) {
        res.status(400).send("invalid " + error);
    }
});

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/



app.get('/send',(req,res)=>{
    res.render('send');
});
app.post('/send',(req,res)=>{

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
             type: "OAuth2",
             user: "nishthasharma1014@gmail.com", 
             pass:"nishthasharma4014",
             clientId:CLIENT_ID ,
             clientSecret: CLIENT_SECRET,
             refreshToken:REFRESH_TOKEN,
             accessToken: accessToken,
    
        },
        tls: {
            rejectUnauthorized: false
          },
        authOptional:true
    });
    const mailOptions={
        from:"nishthasharma1014@gmail.com",
        to:req.body.to,
        subject:req.body.subject,
        text:req.body.content,


    };
    smtpTransport.sendMail(mailOptions,(error,response)=>{
        error?console.log(error):console.log(response);
        smtpTransport.close();
    });
});
  

app.listen(port, () => {
    console.log(`server is running at: ${port}`);

});
