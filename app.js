const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Function to log and save form data to a file
function logAndSaveFormData(formData) {
  const filePath = `${__dirname}/formdata.txt`;
  const formDataString = JSON.stringify(formData) + '\n\n';

  // Log the form data to the console
  console.log('Received form data:', formData);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, create it with the current form data
      fs.writeFile(filePath, formDataString, (writeErr) => {
        if (writeErr) {
          console.error('Error writing form data to file:', writeErr);
        } else {
          console.log('File created and form data submitted successfully.');
        }
      });
    } else {
      // File exists, append the new form data to it
      fs.appendFile(filePath, formDataString, (appendErr) => {
        if (appendErr) {
          console.error('Error adding form data to file:', appendErr);
        } else {
          console.log('Form data added to file successfully.');
        }
      });
    }
  });
}

// Handle POST request for form submission
app.post('/submit-form', (req, res) => {
  const { fname, password, country, otherCountry } = req.body;
  let formData;

  if (country === 'other') {
    formData = { fname, password, country: otherCountry };
  } else {
    formData = { fname, password, country };
  }

  // Construct an HTML string to display the submitted form data
  let formDataHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Form data</title>
    </head>
    <body>
      <h1>Submitted form data</h1>
      <p>Full Name: ${fname}</p>
      <p>Password: ${password}</p>
      <p>Country: ${formData.country}</p>
    </body>
    </html>
  `;

  // Log and save the form data
  logAndSaveFormData(formData);

  // Send the HTML string as the response
  res.send(formDataHtml);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});