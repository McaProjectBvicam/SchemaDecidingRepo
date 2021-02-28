const express= require('express');
const path= require('path');
const app=express();
const hbs=require('hbs');
const port= process.env.PROCESS || 8000;

require("./db/conn");
const Register= require("./models/register");
const Regsoc= require("./models/RegSoc");

//including css, views, partials
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path= path.join(__dirname, "../templates/partials");

//to fetch our form values; without below 2 statements data entered by users is not gonna display on our page!
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/", (req,res)=> {
    res.render("index");
});

app.get("/Regsoc", (req,res)=> {
    res.render("Regsoc");
});
app.get("/login", (req,res)=> {
    res.render("login");
});
app.get("/rwalogin", (req,res)=> {
    res.render("rwalogin");
});
app.get("/societylogin", (req,res)=> {
    res.render("societylogin");
});
app.get("/complaintRegister", (req,res)=> {
    res.render("complaintRegister");
});

app.get("/booking", (req,res)=> {
    res.render("booking");
});

app.get("/socMemRegister", (req,res)=> {
    res.render("socMemRegister");
});

app.get("/myprofile", (req,res)=>{
    res.render("myprofile");
});

app.get("/development", (req,res)=>{
    res.render("development");
});
app.get("/rwaMemberDashBoard", (req,res)=>{
    res.render("rwaMemberDashBoard");
});
app.get("/socMemDashBoard", (req,res)=>{
    res.render("socMemDashBoard");
});
//crate a new user in database
app.post("/index", async (req,res)=> {
    
    try{
        const societyname=req.body.socname;    
        const socName= await Regsoc.findOne({socname:societyname})
            
            if(socName.socname===societyname){
                res.status(201).render("login");
            }
            else{
                res.status(201).render("regSoc");
            }
        
        }catch(error){
        res.status(400).send(error);
        }
});
app.post("/Regsoc", async (req,res)=> {
    try{
            const socreg= new Regsoc({
                socname:req.body.socname,
                presname:req.body.presname,
                district:req.body.district,
                district:req.body.district,
                city:req.body.city,
                country:req.body.country,
                phone:req.body.phone,
                email:req.body.email,
            })
            
            const socregistered= await socreg.save();
            res.status(201).render("login");
        
        }catch(error){
        res.status(400).send(error);
        }
});
app.post("/socMemRegister", async (req,res)=> {
    try{
        const password=req.body.password;
        const cpassword=req.body.confirmpassword;

        if(password===cpassword){
            const registerMember= new Register({
                name:req.body.name,
                hnumber:req.body.hnumber,
                fnumber:req.body.fnumber,
                familymemcount:req.body.familymemcount,
                sname:req.body.sname,
                dname:req.body.dname,
                owner:req.body.owner,
                dob:req.body.dob,
                phone:req.body.phone,
                email:req.body.email,
                password:password,
                cpassword:cpassword,
            })
            
            const registered= await registerMember.save();
            res.status(201).render("societylogin");

        }
        else{
            res.send("pass are not matching");
        }
    }
    catch(error){
        res.status(400).send(error);
    }
});

app.post("/rwalogin", async (req,res)=> {
    try{
        const email=req.body.email;
        const password=req.body.password;

        //this will find to whom the entered email belongs to in our mongodb 
        const rwaemail= await Register.findOne({email:email})

        //to check if my useremail is working or not
        // res.send(useremail);
        // console.log(useremail);

        //checking password
        if(rwaemail.password === password){
            res.status(201).render("rwaMemberDashBoard");
        }
        else{
            res.send("Invalid Details");
        }
    }
    catch(error){
        res.status(400).send("invalid");
    }
});


app.post("/societylogin", async (req,res)=> {
    try{
        const email= req.body.email;
        const password= req.body.password;

        //this will find to whom the entered email belongs to in our mongodb 
        const socemail= await Register.findOne({email:email});
        if(socemail.password===password){
            res.status(201).render("socMemDashBoard");
        }else{
            res.send("Invalid Details");
        }

    }catch(error){
        res.status(400).send("invalid");
    }
});


app.listen(port, ()=>{
    console.log(`server is running at: ${port}` );
});