const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https=require("https");

require('dotenv').config()
const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const emailId = req.body.emailid;
    console.log(firstName,lastName,emailId)

    const data = {        // go to mailchimp documentation "Request body parameter" to get overview
        members:[{
            email_address: emailId,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName
            }
          }
        ]
      };
      var jsonData = JSON.stringify(data);
      const url = "https://us7.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;
      const options = {
        method: "POST",
       auth: process.env.API_KEY_PASS /// to update the code of api using gitignore
      }


      const requesting = https.request(url,options,function(response){    // requesting mailchimp server for the response
        if(response.statusCode === 200){
          res.sendFile(__dirname + "/success.html");
        }
        else{
          res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
          console.log(JSON.parse(data));
        })
      })
      requesting.write(jsonData);
      requesting.end();
})

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(3000,function(){
    console.log("Server is running at port 3000");
})

