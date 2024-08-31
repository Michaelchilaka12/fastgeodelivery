const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
// const puppeteer = require('puppeteer');
const ejs = require('ejs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


// // Create a connection to the database
// const db = mysql.createConnection({
//     host: 'localhost',       // Hostname of the MySQL server
//     user: 'root',            // MySQL user
//     password: '',            // MySQL user's password (usually empty for XAMPP)
//     database: 'todo'       // Database name
//   });
  
//   db.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:');
//       return;
//     }
//     console.log('Connected to MySQL');
//   });

  

// Route to handle the form submission

router.post('/track', (req, res) => {
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






//pacth
router.patch('/update/:itemId', (req, res) => {
    const dataFilePath = path.join(__dirname, '..', 'formData.json');
    const itemId = req.params.itemId;
    const updatedData = req.body;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error reading data');
        }

        let formData = JSON.parse(data);

        // Ensure formData is an array
        if (!Array.isArray(formData)) {
            return res.status(500).send('Data format is incorrect');
        }

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



//delete

// DELETE route to remove an entry
// const dataFilePath = './formData.json'; 
// // Route to remove an object by key-value pair
// router.delete('/delete/:itemId', (req, res) => {
//     const { key, value } = req.params.itemId;
  
//     // Load the JSON file
//     fs.readFile(dataFilePath, 'utf8', (err, data) => {
//       if (err) {
//           console.error('Error reading data file:', err);
//           return res.status(500).send('Error reading data');
//       }
  
//         let jsonData = JSON.parse(data);
  
//         // Filter out objects that match the given key-value pair
//         const filteredData = jsonData.filter(obj => obj[key] !== value);
  
//         // Save the updated JSON file
//         fs.writeFile(dataFilePath, JSON.stringify(filteredData, null, 4), 'utf8', (err) => {
//             if (err) {
//                 return res.status(500).send('Error writing to JSON file.');
//             }
//             res.send('Object(s) removed successfully!');
//         });
//     });
//   });
  


// // Route to generate and download the PDF
// router.get('/download-pdf', async (req, res) => {
//   try {

   
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();

//       // // Render the EJS file to HTML
//       const html = (__dirname, 'view', 'index.ejs');

//       // Set the content to the page
//       await page.setContent(html);

//       // Generate the PDF
//       const pdf = await page.pdf({ format: 'A4' });

//       await browser.close();

//       // Send the PDF to the client
//       res.contentType("application/pdf");
//       res.send(pdf);
//   } catch (error) {
//       console.error('Error generating PDF:', error);
//       res.status(500).send('Error generating PDF');
//   }
// });



module.exports = router;
