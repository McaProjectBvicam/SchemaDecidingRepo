const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    res.render("index");
});

router.get("/Regsoc", (req, res) => {
    res.render("Regsoc");
});
router.get("/rwaRoleFetch", (req, res) => {
    res.render("rwaRoleFetch");
});
router.get("/login", (req, res) => {
    res.render("login");

});
router.get("/rwalogin", (req, res) => {
    res.render("rwalogin");

});
router.get("/societylogin", (req, res) => {
    res.render("societylogin");
});
router.get("/userpayment", (req, res) => {
    res.render("userpayment");
});
router.get("/complaintRegister", (req, res) => {
    res.render("complaintRegister");
});

router.get("/rwaCreateNotice", (req, res) => {
    res.render("rwaCreateNotice");
});

router.get("/rwaDevelopmentEntries", (req, res) => {
    res.render("rwaDevelopmentEntries");
});

router.get("/booking", (req, res) => {
    res.render("booking");
});

router.get("/socMemRegister", (req, res) => {
    res.render("socMemRegister");
});


router.get('/payment', (req, res) => {
    res.render('payment', {
        key: PUBLISHABLE_KEY
    })
})
router.get("/development", (req, res) => {
    res.render("development");
});
router.get("/rwaMemberDashBoard", (req, res) => {
    res.render("rwaMemberDashBoard");
});
router.get("/socMemDashBoard", (req, res) => {
    res.render("socMemDashBoard");
});

router.get("/socMemReadNotice", (req, res) => {

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

router.get("/myprofile", (req, res) => {


    register.find({ email: currentUser }, (err, docs) => {
        if (!err) {
            res.render("myprofile", {
                user: docs[0]
            });
        }
        else {
            console.log("Error in reading Notice collection:" + err);
        }
    });

    // res.render("myprofile");
});

router.get("/socMemReadDevelopment", (req, res) => {

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

router.get("/socMemReadBooking", (req, res) => {

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


router.get("/socMemReadComplaint", (req, res) => {

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


router.post("/", async (req, res) => {

    try {
        societyName = req.body.socname;
        const socName = await societySchema.findOne({ societyName: societyName})

        if (socName.societyName === societyName) {
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

router.post("/Regsoc", async (req, res) => {
    try {

        const socreg = new societySchema({
            societyName: req.body.socname,
            presidentName: req.body.presname,

            societyAddress: {
                locality: req.body.locality,
                city: req.body.city,
                state: req.body.state
            },

            societyCountry: req.body.country,
            societyContact: req.body.phone,
            presEmail: req.body.email,
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
router.post("/rwaRoleFetch", async (req, res) => {
    try {
        await societySchema.update({ 'societyName': societyname },
            {
                '$push': {
                    'rwaMembers': [
                        {
                            rName: req.body.rName1,
                            rEmail: req.body.rEmail1,
                            rRole: req.body.rRole1
                        },
                        {
                            rName: req.body.rName2,
                            rEmail: req.body.rEmail2,
                            rRole: req.body.rRole2
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
router.post("/socMemRegister", async (req, res) => {
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
        res.status(400).send(error);
    }
});

router.post("/rwalogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        //this will find to whom the entered email belongs to in our mongodb 
        const rwaemail = await Register.findOne({ email: email })

        //to comapare secured pass in db with the pass user entered while logging in 
        const isMatch = bcrypt.compare(password, rwaemail.password);
        console.log(`${rwaemail.password}`);
        console.log(`HTML: ${password}`);
        console.log(`isMatch:` + isMatch);

        if (isMatch) {
            currentUser = email;

            res.status(201).render("rwaMemberDashBoard");
            //for userpayment and payment
            userlogin = email;
        }
        else {
            res.send('invalid');
        }
    }
    catch (error) {
        req.session.message = {
            type: 'danger',
            intro: 'invalid details',
            message: 'please inter a valid details.'
        }
        res.redirect('rwalogin');
    }
});

router.post("/societylogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        userlogin = email;
        //this will find the user to whom the entered email belongs to in our mongodb 
        const socemail = await Register.findOne({ email: email });

        //to comapare secured pass in db with the pass user entered while logging in 
        const isMatch = bcrypt.compare(password, socemail.password);

        if (isMatch) {
            currentUser = email;
            res.status(201).render("socMemDashBoard");
        } else {
            res.send("Invalid Details");
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


router.post('/userpayment', async (req, res) => {
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

router.post("/complaintRegister", async (req, res) => {
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

router.post("/booking", async (req, res) => {
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

router.post('/payment', async (req, res) => {
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

router.post("/rwaCreateNotice", async (req, res) => {

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



router.get('/send', (req, res) => {
    res.render('send');
});
router.post('/send', (req, res) => {

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
        from: "nishthasharma1014@gmail.com",
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.content,


    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
});



module.exports = router;