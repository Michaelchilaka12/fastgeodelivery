// import express from 'express';
// import nodemailer from 'nodemailer';
// import bodyParser from 'body-parser';
// import { dirname } from "path";
// import { fileURLToPath } from "url";
const express = require('express');
const path = require('path');
const nodemailer = require ('nodemailer');
const bodyParser = require ('body-parser');
const { dirname } = require ("path");
const { fileURLToPath } = require("url");
const PDFDocument = require("pdfkit")
const multer = require('multer');
const fs = require('fs');
const env = require('dotenv');
const ejs = require('ejs');

const exec = require('child_process').exec;
// const pg = require("pg")


env.config();


const app = express();
const port = 3000;
const indexRouter = require('./routes/index');
// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));


// const __dirname = dirname(fileURLToPath(import.meta.url));




// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the "public" directory
app.use(express.static('public'));

// Route to render the form
// app.get('/', (req, res) => {
//   res.render('email');
// });


//for the tracking start

// Middleware to handle JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Use the index router for the track route
app.use('/', indexRouter);

//for the tracking end


// Route to handle form submission and send email
app.post('/submit', (req, res) => {
  const { name, email, phone, message } = req.body;
  const subject = "Inquiry"
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user:'fastgeotrackingcompany@gmail.com',
      pass:'ydve jifn seaa nkrn'
    },
  });

  // Email options
  const mailOptions = {
    from: email, // Sender's email address
    to: 'fastgeotrackingcompany@gmail.com', // Recipient's email address
    subject: subject,
    phone: phone,
    text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error.message);
    }
    // res.sendFile(path.join(__dirname, 'Tracking_ContactUs.html'));
    // res.sendFile(path.join(__dirname, 'view', 'succes.html'));
    res.send(('Email Sent Successfully'));
  });
});


//for update email
app.post('/update', (req, res) => {
  const { email } = req.body;
  const message = "I want to get latest updates and offers please keep me updated.";
  const subject = "Update Me"
  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user:'fastgeotrackingcompany@gmail.com',
      pass:'ydve jifn seaa nkrn'
    },
  });

  // Email options
  const mailOptions = {
    from: email, // Sender's email address
    to: 'fastgeotrackingcompany@gmail.com', // Recipient's email address
    subject: subject,
    text: `Subject: ${subject}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error.message);
    }
    // res.sendFile(path.join(__dirname, 'Tracking_ContactUs.html'));
    // res.sendFile(path.join(__dirname, 'view', 'succes.html'));
    res.send('Email sent successfully!');
  });
});









// app.use(bodyParser.json());

// app.post('/generate-pdf', (req, res) => {
//     const {
//         companyName, receiptType, createdDate, createdTime,
//         recipientName, recipientAddress, recipientEmail, recipientPhone,
//         parcelDescription, dispatchLocation, courierStatus,
//         dispatchDate, deliveryDate, carrier
//     } = req.body;

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=receipt.pdf');

//     doc.pipe(res);

//     // Add the text content to the PDF
//     doc.fontSize(20).text(companyName, { align: 'center' });
//     doc.fontSize(14).text(receiptType, { align: 'center', italic: true });
//     doc.moveDown();

//     doc.fontSize(12).text(`Created Date: ${createdDate}`, { align: 'left' });
//     doc.text(`Created Time: ${createdTime}`, { align: 'left' });
//     doc.moveDown();

//     doc.fontSize(12).text(`To: ${recipientName}`);
//     doc.text(recipientAddress);
//     doc.text(recipientEmail);
//     doc.text(recipientPhone);
//     doc.moveDown();

//     doc.fontSize(14).text('Shipment Details', { align: 'left', underline: true });
//     doc.moveDown();

//     doc.fontSize(12).text(`Parcel Description: ${parcelDescription}`);
//     doc.text(`Dispatch Location: ${dispatchLocation}`);
//     doc.text(`Courier Status: ${courierStatus}`);
//     doc.text(`Dispatch Date: ${dispatchDate}`);
//     doc.text(`Estimated Delivery Date: ${deliveryDate}`);
//     doc.text(`Carrier: ${carrier}`);

//     doc.end();
// });

// app.use(bodyParser.json({ limit: '10mb' })); // To handle large HTML content

// app.post('/generate-pdf', (req, res) => {
//     const { html } = req.body;

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

//     doc.pipe(res);

//     // Add the selected content to the PDF
//     doc.text(html, {
//         width: 410,
//         align: 'left'
//     });

//     doc.end();
// });

app.post('/track', (req, res) => {
  const { trackingCode } = req.body;
  const dataFilePath = path.join(__dirname, '..', 'formData.json');

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading data file:', err);
          return res.status(500).send('Error reading data');
      }

      let formData;
      try {
          formData = JSON.parse(data);
      } catch (parseErr) {
          console.error('Error parsing data:', parseErr);
          return res.status(500).send('Error parsing data');
      }

      // Search for the item with the matching carrierreferenceno
      const foundItem = formData.find(item => item.carrierreferenceno === trackingCode);

      if (foundItem) {
          // Render the EJS template with the found item
          res.render('index', { formData: foundItem , buttontext:"Download Receipt" , map:foundItem.currentlocation ,height:"450" ,current:'Current Location' , imgtext:'Package Image' ,packimg:foundItem.packageimage});
      } else {
          return res.status(404).send('Item not found');
      }
  });
});





app.get('/track:itemId', (req, res) => {
  const trackingCode = req.params.itemId; // Assuming trackingCode is passed as a query parameter
  
  const dataFilePath = path.join(__dirname, 'formData.json');

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading data file:', err);
          return res.status(500).send('Error reading data');
      }

      let formData;
      try {
          formData = JSON.parse(data);
      } catch (parseErr) {
          console.error('Error parsing data:', parseErr);
          return res.status(500).send('Error parsing data');
      }

      // Search for the item with the matching carrierreferenceno
      const foundItem = formData.find(item => item.itemId === trackingCode);

      if (foundItem) {
          // Render the EJS template with the found item
          res.render('index', { formData: foundItem ,buttontext:'' , map:'' ,height:'0' , current:'',packimg:'' , imgtext:''});
      } else {
          return res.status(404).send('Item not found');
      }
  });
});


app.get('/download-pdf:itemId', (req, res) => {
  const itemId = req.params.itemId
  
  const url = `https://delivery-e1lhk908w-michaels-projects-4f22faee.vercel.app/track${itemId}`;

  exec(`wkhtmltopdf ${url} Receipt.pdf`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Error generating PDF');
    }

    res.download(path.join(__dirname, 'Receipt.pdf'), 'Receipt.pdf');
  });
});







const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name to avoid duplicates
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single('image');

// Serve the HTML file
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});




// insert post method

app.post('/insert', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).send('Error uploading file');
    }

    const formData = {
      itemId: req.body.itemId,
      sendersname: req.body.sendersname,
      sendersaddress: req.body.sendersaddress,
      sendersphone: req.body.sendersphone,
      sendersemail: req.body.sendersemail,
      receiversname: req.body.receiversname,
      receiversaddress: req.body.receiversaddress,
      receiversphone: req.body.receiversphone,
      receiversemail: req.body.receiversemail,
      shipmentstatus: req.body.shipmentstatus,
      origin: req.body.origin,
      packages: req.body.packages,
      destination: req.body.destination,
      currentlocation:req.body.currentlocation,
      carrier: req.body.carrier,
      typeofshipment: req.body.typeofshipment,
      weight: req.body.weight,
      shipmentmode: req.body.shipmentmode,
      carrierreferenceno: req.body.carrierreferenceno,
      product: req.body.product,
      qty: req.body.qty,
      paymentmode: req.body.paymentmode,
      totalfreight: req.body.totalfreight,
      expecteddeliverydate: req.body.expecteddeliverydate,
      departuredate: req.body.departuredate,
      deliverytime: req.body.deliverytime,
      packageimage: req.body.packageimage  // Assuming images are served from '/uploads'
    };

    // Specify the path for the JSON file
    const dataFilePath = path.join(__dirname, 'formData.json'); // Assuming formData.json is in the parent directory

    // Read the existing data, append the new data, and then write it back
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      let formDataArray = [];

      if (err) {
        if (err.code === 'ENOENT') {
          // If the file does not exist, start with an empty array
          console.log('No existing data found. Creating new file.');
        } else {
          console.error('Error reading data file:', err);
          return res.status(500).send('Error reading data');
        }
      } else {
        // Parse existing data if the file exists
        try {
          formDataArray = JSON.parse(data);
        } catch (parseErr) {
          console.error('Error parsing data file:', parseErr);
          return res.status(500).send('Error parsing data');
        }
      }

      // Add the new form data to the array
      formDataArray.push(formData);

      // Write the updated array back to the JSON file
      fs.writeFile(dataFilePath, JSON.stringify(formDataArray, null, 2), (err) => {
        if (err) {
          console.error('Error saving form data:', err);
          return res.send('Data Creation Failed');
        }
        res.send('Data Created Successfully');
      });
    });
  });
});







app.get('/update/:itemId', (req, res) => {

  const dataFilePath = path.join(__dirname, 'formData.json');
  const itemId = req.params.itemId;
  const updatedData = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading data file:', err);
          return res.status(500).send('Error reading data');
      }

    let formData = JSON.parse(data);

      // Find the index of the item with the given itemId
      const itemIndex = formData.findIndex(item => item.itemId === itemId);
      if (itemIndex !== -1) {
          // Update only the specified fields
          formData[itemIndex] = { ...formData[itemIndex], ...updatedData };

          // Write the updated data back to the JSON file
          fs.writeFile(dataFilePath, JSON.stringify(formData, null, 2), (err) => {
              if (err) {
                  console.error('Error saving updated data:', err);
                  return res.status(500).send('Error saving data');
              }
              res.send('Data updated successfully');
          });
      } else {
          res.status(404).send('Item not found');
      }
  });
})
//update patch method
app.patch('/update/:itemId', (req, res) => {

  const dataFilePath = path.join(__dirname, 'formData.json');
  const itemId = req.params.itemId;
  const updatedData = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading data file:', err);
          return res.status(500).send('Error reading data');
      }

    let formData = JSON.parse(data);

      // Find the index of the item with the given itemId
      const itemIndex = formData.findIndex(item => item.itemId === itemId);
      if (itemIndex !== -1) {
          // Update only the specified fields
          formData[itemIndex] = { ...formData[itemIndex], ...updatedData };

          // Write the updated data back to the JSON file
          fs.writeFile(dataFilePath, JSON.stringify(formData, null, 2), (err) => {
              if (err) {
                  console.error('Error saving updated data:', err);
                  return res.status(500).send('Error saving data');
              }
              res.send('Data updated successfully');
          });
      } else {
          res.status(404).send('Item not found');
    }
   
  });
});

// const dataFilePath = './formData.json'; // Path to your JSON file











// // Route to remove an object by key-value pair
// app.delete('/delete/:itemId', (req, res) => {
//   const { key, value } = req.params.itemId;

//   // Load the JSON file
//   fs.readFile(dataFilePath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading data file:', err);
//         return res.status(500).send('Error reading data');
//     }

//       let jsonData = JSON.parse(data);

//       // Filter out objects that match the given key-value pair
//       const filteredData = jsonData.filter(obj => obj[key] !== value);

//       // Save the updated JSON file
//       fs.writeFile(dataFilePath, JSON.stringify(filteredData, null, 4), 'utf8', (err) => {
//           if (err) {
//               return res.status(500).send('Error writing to JSON file.');
//           }
//           res.send('Object(s) removed successfully!');
//       });
//   });
// });












// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});










