const express = require("express");
const bodyParser = require("body-parser");
const request = require("express");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // to upload stattic filea to server (css,img) bcs it store in local server//("public")= name of file

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/signup.html");
});
app.post("/", function (request, response) {
  console.log("POST request receive");
  const firstName = request.body.firstName;
  const lastName = request.body.lastName;
  const email = request.body.email;
  console.log(firstName, lastName, email);

  // create data var to post as JSON
  const data = {
    //member is need to be in array
    members: [
      {
        // Object
        email_address: email,
        status: "subscribed", //status object
        merge_fields: {
          //object in merge fields//refer to account mailchimp
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data); //this will be sent to mailchimp
  const url = "https://us8.api.mailchimp.com/3.0/lists/1946030b98"; //add url endpoint
  const options = {
    //object in options
    method: "POST",
    //auth=authentication// "anyusername:apiKey"
    auth: "ikmalazman:31ddc77cee30f254b81f9607d09c909d-us8",
  };
  //need set up url,function to use htts request
  const REQUEST = https.request(url, options, function (RESPONSE) {
    if (response.statusCode === 200) {
      response.sendFile(__dirname + "/success.html");
    } else {
      response.sendFile(__dirname + "/failure.html");
    }
    //request from http
    response.on("data", function (data) {
      //to retrieve data from request
      console.log(JSON.parse(data));
    });
  });
  REQUEST.write(jsonData);
  REQUEST.end();
});

//post for button in  failure
app.post("/failure", function (request, response) {
  response.redirect("/");
  //if user click the button they will redirect to / directory
});
//process.env.PORT = to make heroku difine port automatic  //  || = it can be access from local n external server simultaneously
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running at port 3000");
});

// mailchimp api key
// 31ddc77cee30f254b81f9607d09c909d-us8
// list ID
// 1946030b98
