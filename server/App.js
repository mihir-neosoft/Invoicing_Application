// imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const credential = require('./Credential');
// Routes
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const clientRoutes = require('./routes/clientRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

// Templates
const pdfTemplate = require('./templates/pdf');
const emailTemplate = require('./templates/email');
// const invoiceTemplate = require('./routes/Routes');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express
const PORT = 8899;
const app = express();

// Use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use('/clients', clientRoutes);
app.use('/invoices', invoiceRoutes);;

// NodeMailer 
// NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",  //Gmail host
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: credential.Email, // Gmail user
        pass: credential.Password, // Gmail password
    },
    tls: {
        rejectUnauthorized: false
    }
})


var options = { format: 'A4' };
//SEND PDF INVOICE VIA EMAIL
app.post('/send-pdf', (req, res) => {
    const { email, company } = req.body

    // pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
    pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {

        // send mail with defined transport object
        transporter.sendMail({
            from: `${company.businessName ? company.businessName : company.name} ${credential.Email}`, // sender address
            to: `${email}`, // list of receivers
            replyTo: `${company.email}`,
            subject: `Invoice from ${company.businessName ? company.businessName : company.name}`, // Subject line
            text: `Invoice from ${company.businessName ? company.businessName : company.name}`, // plain text body
            html: emailTemplate(req.body), // html body
            attachments: [{
                filename: 'invoice.pdf',
                path: `${__dirname}/invoice.pdf`
            }]
        });

        if (err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});


//Problems downloading and sending invoice
// npm install html-pdf -g
// npm link html-pdf
// npm link phantomjs-prebuilt

//CREATE AND SEND PDF INVOICE
app.post('/create-pdf', (req, res) => {
    console.log(req.body);
    pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
        if (err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});

//SEND PDF INVOICE
app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/invoice.pdf`)
});

// Server Index Page.
app.get('/', (req, res) => { res.send("API Working."); });

// db connection
const db = "mongodb://localhost:27017/invoicing_application";
const connect_db = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log("MongoDB Connected.");
    } catch (err) { console.log(err.message); }
}
connect_db();

// Host Server
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Listening at http://localhost:${PORT}`)
});