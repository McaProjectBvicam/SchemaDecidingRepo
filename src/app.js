const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
dotenv.config({ path: './config.env' });
//hide port number
const PORT = process.env.PORT || 8000;

//for uploding docs
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})
const upload = multer({ storage: storage });


// //mongo atlas
const mongoose = require('mongoose');

const DB = 'mongodb+srv://society:society@cluster0.5atb0.mongodb.net/ProjectSocietyDB?retryWrites=true&w=majority';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log(`Connection Successful`);
}).catch((err) => console.log(`Error connecting to atlas`));


//require("./db/conn");
var nodemailer = require("nodemailer");

//for storing and showing some data 
var userlogin = "";
var societyname = "";
var memscount = " ";
var complaintscount = " ";


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


app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/Regsoc", (req, res) => {
    res.render("Regsoc");
});
app.get("/rwaRoleFetch", (req, res) => {
    res.render("rwaRoleFetch");
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



app.get("/rwaCreateNotice", (req, res) => {
    res.render("rwaCreateNotice");
});

app.get("/rwaDevelopmentEntries", (req, res) => {
    res.render("rwaDevelopmentEntries");
});


app.get("/socMemRegister", (req, res) => {
    res.render("socMemRegister");
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

    res.render("rwaMemberDashboard",
        {
            socname: societyname,
            memname: userlogin,
            memcount: memscount,
            complaintcount: complaintscount
        }
    );


});
app.get("/socMemDashBoard", (req, res) => {
    res.render("socMemDashBoard", {
        socname: societyname,
        memname: userlogin,
    });

});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/logout", (req, res) => {
    userlogin = "";
    societyname = "";
    memscount = "";
    complaintscount = "";
    res.render("index");
});


//society membr will read only his/her reservations
//dont get confuse by name it is old name not renamed

app.get("/userpayment", async (req, res) => {
    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })

        res.render("userpayment", {
            list: result.societyPayments
        });

    //     console.log(result.societyNotices[0]);

    } catch (error) {
        res.status(201).render("rwaMemberDashBoard");
        //console.log("Error in reading Notice collection:" + err);
    }



});


app.get("/booking", async (req, res) => {


    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })
        var mybookings = [];
        for (let val of result.societyReservations) {

            if (val.memEmail == userlogin) {
                mybookings.push(val);
            }
        }

        res.render("booking", {
            // list: result.societyReservations
            list: mybookings
        });

        console.log(result.societyReservations[0]);

    } catch (error) {
        res.status(201).render("socMemDashboard");
        console.log("Error in reading Reservations collection:" + err);
    }

    //  res.render("booking");
});



//society membr will read only hi/her complaints
//dont get confuse by name it is old name not renamed
app.get("/complaintRegister", async (req, res) => {
    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })

        var mycomplaints = [];
        for (let val of result.societyComplaints) {

            if (val.memEmail == userlogin) {
                mycomplaints.push(val);
            }
        }

        res.render("complaintRegister", {
            //  list: result.societyComplaints
            list: mycomplaints
        });

        console.log(result.societyComplaints[0]);

    } catch (error) {
        res.status(201).render("socMemDashboard");
        console.log("Error in reading Notice collection:" + err);
    }
    //res.render("complaintRegister");
});

app.get("/socMemReadNotice", async (req, res) => {
    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })

        res.render("socMemReadNotice", {
            list: result.societyNotices
        });

        console.log(result.societyNotices[0]);

    } catch (error) {
        res.status(201).render("socMemDashboard");
        //console.log("Error in reading Notice collection:" + err);
    }

});

app.get("/myprofile", async (req, res) => {

    try {

        console.log("society name:" + societyname)
        //this will find the users of the society you are logged in
        const result = await societySchema.findOne({ "societyName": societyname });

        var flag = 0;
        var currentUser;
        // console.log(result.societyMembers[0]);
        for (let val of result.societyMembers) {

            if (val.memEmail === userlogin) {
                flag = 1;
                currentUser = val;
            }
        }
        if (flag === 1) {
            res.status(201).render("myprofile",
                { user: currentUser }

            );
        }
        else {
            res.send("Invalid Details");
        }

    } catch (error) {

        res.redirect('socMemDashboard');
    }

});


app.get("/rwaprofile", async (req, res) => {

    try {

        console.log("society name:" + societyname)
        //this will find the users of the society you are logged in
        const result = await societySchema.findOne({ "societyName": societyname });

        var flag = 0;
        var currentUser;
        // console.log(result.societyMembers[0]);
        for (let val of result.societyMembers) {

            if (val.memEmail === userlogin) {
                flag = 1;
                currentUser = val;
            }
        }
        if (flag === 1) {
            res.status(201).render("myprofile",
                { user: currentUser }

            );
        }
        else {
            res.send("Invalid Details");
        }

    } catch (error) {

        res.redirect('rwaMemberDashBoard');
    }

});



app.get("/socMemReadDevelopment", async (req, res) => {

    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })

        res.render("socMemReadDevelopment", {
            list: result.societyDevelopments
        });

        console.log(result.societyDevelopments[0]);

    } catch (error) {
        res.status(201).render("socMemDashboard");
        //console.log("Error in reading Reservations collection:" + err);
    }
});

app.get("/rwaMemReadBooking", async (req, res) => {

    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })

        res.render("rwaMemReadBooking", {
            list: result.societyReservations
        });

        console.log(result.societyReservations[0]);

    } catch (error) {
        res.status(201).render("rwaMemberDashBoard");
        console.log("Error in reading Reservations collection:" + err);
    }
});



app.get("/rwaMemReadComplaint", async (req, res) => {

    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })

        res.render("rwaMemReadComplaint", {
            list: result.societyComplaints
        });


        //   console.log(result.societyComplaints[0]);

    } catch (error) {
        res.status(201).render("rwaMemDashboard");
        console.log("Error in reading Complaints collection:" + err);
    }

});

app.get("/mySocMembers", async (req, res) => {

    try {

        console.log("society name:" + societyname)

        //this will find the society with name provided
        const result = await societySchema.findOne({ "societyName": societyname })

        res.render("mySocMembers", {
            list: result.societyMembers
        });

        console.log(result.societyMembers[0]);

    } catch (error) {
        res.status(201).render("rwaMemDashboard");
        //console.log("Error in reading Members collection:" + err);
    }

});


app.post("/", async (req, res) => {

    try {
        societyName = req.body.socname;
        const socName = await societySchema.findOne({ societyName: societyName })

        if (socName.societyName === societyName) {
            societyname = societyName;
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

        const socreg = new societySchema({
            societyName: req.body.socname,
            // presidentName: req.body.presname,

            societyAddress: {
                street: req.body.street,
                district: req.body.district,
                city: req.body.city,
                state: req.body.state,
                societyCountry: req.body.country,
                pincode: req.body.pincode
            },


            societyContact: req.body.phone,
            // presEmail: req.body.email,
            socNickName: req.body.socNickName,
            societyMembers: [],
            societyNotices: [],
            societyComplaints: [],
            societyReservations: [],
            societyDevelopments: [],
            societyPayments: [],
            rwaMembers: []

        })

        //await DB.collection('mysocieties').insertOne(socreg);
        // col.insertOne(socreg);

        const socregistered = await socreg.save();
        societyname = req.body.socname;
        res.status(201).render("rwaRoleFetch");

    } catch (error) {
        res.status(400).send(error);
        console.log("err" + error);
    }
});
app.post("/rwaRoleFetch", async (req, res) => {
    try {
        await societySchema.update({ 'societyName': societyname },
            {
                '$push': {
                    'societyMembers': [
                        {
                            memName: req.body.rName1,
                            memEmail: req.body.rEmail1,
                            role: req.body.rRole1,
                            memHouseNum: req.body.hnumber,
                            memFloorNum: req.body.fnumber,
                            familyMemCount: req.body.familymemcount,
                            owner: req.body.owner,
                            memDOB: req.body.dob,
                            memContact: req.body.phone,
                            memPassword: req.body.password,
                            cpassword: req.body.confirmpassword,
                        }
                    ]

                }

            })

        // const socregistered = await rwarole.save();
        res.status(201).render("login");

    } catch (error) {
        res.send()
        res.status(400).send(error);
    }
});

//create a new user in database
app.post("/socMemRegister", upload.single('idproof'), async (req, res) => {
    try {
        console.log(req.file);
        console.log("society:" + societyname);
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            await societySchema.updateOne(
                { 'societyName': societyname },
                {
                    '$push': {
                        'societyMembers': {
                            //needed for query
                            //societyname: societyname,
                            memName: req.body.name,
                            memHouseNum: req.body.hnumber,
                            memFloorNum: req.body.fnumber,
                            familyMemCount: req.body.familymemcount,
                            owner: req.body.owner,
                            role: "Member",
                            memDOB: req.body.dob,
                            memContact: req.body.phone,
                            memEmail: req.body.email,
                            memPassword: password,
                            cpassword: cpassword,
                        }
                    }
                })

            // const registered = await registe.save();
            // res.status(201).render("societylogin");
            req.session.message = {
                type: 'success',
                intro: 'Record insert successfully',
                message: 'success'
            }
            res.redirect('login');

        }
        else {
            req.session.message = {
                type: 'danger',
                intro: 'password mismatch',
                message: 'please inter a correct password'
            }
            res.redirect('socMemRegister');
        }
    }
    catch (error) {
        res.status(400).send("gadbadh" + error);
    }
});

app.post("/rwalogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        userlogin = email;
        console.log("society name:" + societyname)
        //this will find the users of the society you are logged in
        const result = await societySchema.findOne(

            { "societyName": societyname },
            { _id: 0, 'societyMembers.memEmail': 1, 'societyMembers.memPassword': 1, 'societyMembers.role': 1 }
        );

        var rflag = 0;
        console.log(result);
        console.log(result.societyMembers[0]);
        for (let val of result.societyMembers) {

            if (val.memEmail === email && val.memPassword === password && val.role == "President") {
                rflag = 1;

            }
        }
        if (rflag === 1) {


            const resultAll = await societySchema.findOne({ "societyName": societyname })
            memscount = resultAll.societyMembers.length;
            complaintscount = resultAll.societyComplaints.length;

            res.status(201).render("rwaMemberDashBoard", {
                socname: societyname,
                memname: userlogin,
                memcount: memscount,
                complaintcount: complaintscount
            }
            );
        }

        else {
            //res.send("Invalid Details");
            res.render("rwalogin");
        }

    } catch (error) {
        req.session.message = {

            type: 'danger',
            intro: 'invalid details',
            message: 'please inter a valid details.'
        }
        console.log(error);
        res.redirect('rwalogin');
    }
});

app.post("/societylogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        userlogin = email;
        console.log("society name:" + societyname)
        //this will find the users of the society you are logged in
        const result = await societySchema.findOne(

            { "societyName": societyname },
            { _id: 0, 'societyMembers.memEmail': 1, 'societyMembers.memPassword': 1 }
        );

        var flag = 0;
        console.log(result.societyMembers[0]);
        for (let val of result.societyMembers) {

            if (val.memEmail === email && val.memPassword === password) {
                flag = 1;
            }
        }
        if (flag === 1) {
            res.status(201).render("socMemDashBoard",
                { socname: societyname, memname: userlogin }

            );
        }
        else {
            req.session.message = {

                type: 'danger',
                intro: 'invalid details',
                message: 'please inter a valid details.'
            }
            res.redirect('societylogin');
        }
        

    } catch (error) {
        req.session.message = {

            type: 'danger',
            intro: 'invalid details',
            message: 'please inter a valid details.'
        }
        res.redirect('societylogin');
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
        await societySchema.updateOne(
            { 'societyName': societyname },
            {
                '$push': {
                    'societyComplaints': {

                        societyMemberName: req.body.socMemName,
                        memEmail: userlogin,
                        complaintDate: req.body.compDate,
                        complaintSubject: req.body.compSubject,
                        complaintDesc: req.body.compDescription,
                        complaintStatus: "Active"
                    }
                }
            })


        res.status(201).render("socMemDashboard");
    } catch (error) {
        res.status(400).send("invalid " + error);
    }

});

app.post("/rwaDevelopmentEntries", async (req, res) => {
    try {
        console.log("Society name is: " + societyname);
        await societySchema.updateOne(
            { 'societyName': societyname },
            {
                '$push': {
                    'societyDevelopments': {
                        Facility: req.body.Facility,
                        Category: req.body.Category,
                        FacilityDate: req.body.FacilityDate,
                        DevelopmentDesc: req.body.DevelopmentDesc

                    }
                }
            })

        res.status(201).render("rwaMemberDashBoard");
    } catch (error) {
        res.status(400).send("invalid " + error);
    }
});

app.post("/booking", async (req, res) => {
    try {
        console.log(societyname);
        await societySchema.updateOne(
            { 'societyName': societyname },
            {
                '$push': {
                    'societyReservations': {

                        societyMemberName: req.body.socMemName,
                        memEmail: userlogin,
                        reservationFor: req.body.reserve,
                        reservationDate: req.body.resDate,
                        reservationDesc: req.body.resDescription,
                        reservationStatus: "Requested"
                    }
                }
            })

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
        })
        const charge = await stripe.charges.create({
            amount: 300,
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        })
        const ab = await charge.amount;
       
        const result =await societySchema.findOne(
           
            {"societyName":societyname},
         {'societyMembers': 1,_id:0}
           );
     

           // res.status(201).render("userpayment");
            console.log(result);
                console.log("society:" + societyname);
                console.log("useremail:"+userlogin);
             if(ab)
             {
                var flag=0;
                //console.log(result.societyMembers[0]);
                for(let val of result.societyMembers)
                {
     
                    if(val.memEmail===userlogin)
                    {
                        flag=1;
                        console.log("hey");
                        await societySchema.updateOne(
                            {'societyName': societyname },
                            {
                                '$push': {
    

                                    'societyPayments': {
                                        
                                        //needed for query
                                        //societyname: societyname,
                                        email: req.body.stripeEmail,
                                        useremail: userlogin,
                                        amount: 1000,
                                       datetime: new Date(),
                                       status: "Success"
            
                                   }
                                }
                            
                           })
                     
                    }
                 }
                 if(flag===1)
                 {
                    req.session.message = {
                        type: 'success',
                        intro: 'Record insert successfully',
                        message: 'success'
                    }
                     res.status(201).render("socMemDashBoard");
                 }
                 else {
                    // res.send("Invalid Details");
                    req.session.message = {
                        type: 'danger',
                        intro: 'password mismatch',
                        message: 'please inter a correct password'
                    }
                    res.send("Invalid Details");
                }
            }
        }
            
            catch (error) {
                res.status(400).send("gadbadh" + error);
            }
            

});

app.post("/rwaCreateNotice", async (req, res) => {

    try {
        await societySchema.updateOne(
            { 'societyName': societyname },
            {
                '$push': {
                    'societyNotices': {
                        
                        noticeDate: req.body.noticeDate,
                        noticeHeading: req.body.noticeHeading,
                        noticeDesc: req.body.noticeDesc,
                        noticeLink: req.body.noticeLink

                    }
                }
            })


        res.status(201).render("rwaMemberDashBoard");
    } catch (error) {
        res.status(400).send("invalid " + error);
    }
});


/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
app.get('/send', (req, res) => {
    res.render('send');
});
app.post('/send', (req, res) => {

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            type: "OAuth2",
            user: "nishthasharma1014@gmail.com",
            pass: "nishthasharma4014",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,

        },
        tls: {
            rejectUnauthorized: false
        },
        authOptional: true
    });
    const mailOptions = {
        from: "societymaintenancetracker@gmail.com",
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.content,


    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
});



app.listen(PORT, () => {
    console.log(`server is running at: ${PORT}`);

});