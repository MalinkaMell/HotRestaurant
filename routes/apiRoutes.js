const nodemailer = require('nodemailer');
require('dotenv').config(); //to read the .env
const tables = require('../data/tables');
const waitlist = require('../data/waitlist');
let accountSid = process.env.accountSid;
let authToken = process.env.authToken;
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

module.exports = function (app) {
    //api routes

    app.get('/api/tables', function (request, response) {
        response.json(tables);
    });

    app.get('/api/tables/:id', function (request, response) {
        let id = request.params.id;
        tables.forEach(element => {
            if (element.unique_id === id) {
                response.json(element)
            }
        });


        return response.json(false);
    });

    app.get('/api/waitlist', function (request, response) {
        response.json(waitlist);
    });

    app.get('/api/waitlist/:id', function (request, response) {
        let id = request.params.id;
        waitlist.forEach(element => {
            if (element.unique_id === id) {
                response.json(element)
            }
        });
        return response.json(false);
    });

    app.post('/api/tables', function (request, response) {
        let newTable = request.body;
        console.log(newTable);

        if (tables.length < 5) {
            tables.push(newTable);
            response.json(true);
        } else {
            waitlist.push(newTable);
            response.json(false)
        }

    });

    app.delete('/api/waitlist/:id', function (request, response) {
        let deleteId = request.params.id;
        waitlist.shift();
    })

    app.delete('/api/tables/:id', function (request, response) {
        let deleteId = request.params.id;
        tables.splice(deleteId, 1);
    })



    app.get('/send', function (req, res) {
        //gmail way
        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            auth: {
                user: process.env.email,
                pass: process.env.appPwd //app pwd
            }
        });

        const mailOptions = {
            to: req.query.to,
            subject: req.query.subject,
            text: req.query.text
        }

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                res.end('error');
            } else {
                console.log(`Message sent: ${response.messageId}`);
                res.end('sent');
            }
        });

    });

    app.get('/send-txt', function (request, response) {
        console.log(request.query.body);

        client.messages.create({
            body: request.query.body,
            to: request.query.to,  // Text this number
            from: process.env.phoneNumber // From a valid Twilio number
        })
            .then(function (message) {
                console.log(message.sid);
                response.end('sent');
            }
            );
    })

    //end api routes
}
