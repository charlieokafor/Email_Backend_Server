# Email Backend Server

## Project Overview
This project is an email backend server designed to integrate with Wix's store API to retrieve product details and utilize Nodemailer for sending out promotional emails. The server is built using Node.js and Express.js and can be customized with your credentials for Wix and an email service provider.

## Features
- **Integration with Wix API**: Fetch product information from Wix for email content.
- **Dynamic Email Content Creation**: Automatically create email content based on product data.
- **Email Dispatch**: Use Nodemailer to send promotional emails to a predefined list of recipients.

## Technologies
- Node.js
- Express.js
- node-fetch for API calls
- Nodemailer for sending emails
- CORS to allow cross-origin requests

## Installation
To get this project running on your local environment, follow these steps:

1. Ensure you have Node.js and npm installed.
2. Clone this repository.
3. Install the necessary node modules:
    ```bash
    npm install express node-fetch cors nodemailer
    ```
4. Update the server's credentials and constants within the code:
    - Replace `'Enter Wix Store ID'` with your actual Wix API key.
    - Replace `'email address'` with your email service's user email.
    - Replace `'app password'` with your email service's app password.
    - Replace `'Wix Site ID'` with your actual Wix site ID.

## Usage
To start the server, run the following command in your terminal:

```bash
node app.js
The server will listen on the default port 3000 or the port specified in the server's environment.

To send a promotional email, make a POST request to the /send-promotion endpoint with a JSON payload containing productIds, emailAddresses, customSubject, and bannerText.

API Reference
Sending Promotional Emails
POST /send-promotion

productIds: A string with space-separated product IDs from your Wix store.
emailAddresses: A string with space-separated recipient email addresses.
customSubject: The subject line for the promotional email.
bannerText: The promotional banner text to be included in the email.

## Contributing
If you would like to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature.
3. Add your changes and commit them.
4. Push to your fork and submit a pull request.

## License
MIT License

Copyright (c) 2024 Chijindu Chibueze Okafor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author
Chijindu Chibueze Okafor

## Contact
For any queries or support, please contact us at chjindu12@gmail.com.
