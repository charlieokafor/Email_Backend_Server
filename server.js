import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

// Replace these with your actual details
const WIX_API_URL = 'https://www.wixapis.com/stores/v1';
const WIX_API_KEY = 'Enter Wix Store ID';
const EMAIL_SERVICE_USER = 'email address'; // Your Gmail address
const EMAIL_SERVICE_PASS = 'app password'; // Your Gmail App Password
const WIX_SITE_ID = 'Wix Site ID'; // Replace with your actual Wix site ID


app.use(cors());
app.use(express.json());

const getProductsFromWix = async (productIds) => {
  console.log('Received productIds in getProductsFromWix:', productIds); // Log the received productIds
  try {
    const products = await Promise.all(productIds.map(async (productId) => {
      const url = `${WIX_API_URL}/products/${productId}`;
      console.log(`Fetching product data from: ${url}`);

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${WIX_API_KEY}`, 'wix-site-id': WIX_SITE_ID }
      });

      if (!response.ok) {
        console.log(await response.text());
        throw new Error('Failed to fetch product data');
      }

      const data = await response.json();
      return data;
    }));

    return products;
  } catch (error) {
    console.error('Error in getProductsFromWix:', error);
    throw error;
  }
};

const createEmailContent = (productsData, bannerText) => {
  // Map each product to its HTML representation
  const productsHtml = productsData.map(productData => {
    const product = productData.product;
    const price = product.price.formatted; // Assuming price is already formatted
    
    return `
      <div class="product">
        <img src="${product.media.mainMedia.image.url}" alt="${product.name}" style="width: 100%; max-width: 300px; height: auto; margin-bottom: 10px;" />
        <h2 style="color: #333; font-size: 24px; font-weight: bold;">${product.name}</h2>
        <p style="font-size: 16px; color: #555;">${product.description}</p>
        <p class="price" style="color: #333; font-size: 24px; font-weight: bold;">from ${price.discountedPrice}</p>
        <a href="${product.productPageUrl.base}${product.productPageUrl.path}" class="button" style="background-color: #44dbbc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">SHOP NOW</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #ccc; margin-top: 25px; margin-bottom: 25px;">`;
  }).join('');

  // Combine all product HTML segments into the final email HTML content
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { width: 100%; max-width: 600px; margin: auto; padding: 20px; }
          .banner {
            background-color: #4a90e2; /* Changed background color for better visibility */
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 18px;
            margin-bottom: 20px; /* Added margin for spacing */
          }
          .logo {
            text-align: center;
            margin-bottom: 20px; /* Added margin for spacing */
          }
          .logo img {
            width: 100%; /* Make the logo responsive */
            max-width: 100px; /* Maximum width */
            height: auto;
          }
          .product {
            text-align: center;
            margin-bottom: 20px;
          }
          .product img {
            width: 100%; /* Make the product images responsive */
            max-width: 300px; /* Maximum width, adjust as needed */
            height: auto;
          }
          .button {
            background-color: #44dbbc;
            color: white;
            text-align: center;
            padding: 10px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
          }
          .footer {
            font-size: 12px;
            text-align: center;
            color: #999;
            margin-top: 30px;
          }
          hr {
            border: 0;
            border-top: 1px solid #ccc;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="banner">${bannerText}</div>
          <div class="logo">
            <img src="https://static.wixstatic.com/media/8fc859_2cb74c7f81944860af2e3e12bb574e17~mv2.png" alt="Company Logo" />
          </div>
          ${productsHtml}
          <div class="footer">
            <p>76 Walton Vale, Liverpool, UK</p>
            <p>01513453750</p>
            <p><a href="https://www.rapidkitchens.co.uk">Check out my website</a></p>
            <p>This email was created with Wix. <a href="https://www.wix.com">Discover More</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};


  

const sendPromotionalEmail = async (to, customSubject, htmlContent) => {
  // Use nodemailer to send an email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_SERVICE_USER,
      pass: EMAIL_SERVICE_PASS
    }
  });

  // Create an array to hold all the sendMail Promises
  const sendMailPromises = to.map(email => {
    const mailOptions = {
      from: '"Rapid Kitchens" <' + EMAIL_SERVICE_USER + '>',
      to: email, // each individual email
      subject: customSubject,
      html: htmlContent
    };

    // Return the promise of sendMail
    return transporter.sendMail(mailOptions);
  });

  // Use Promise.all to wait for all promises to resolve or reject
  return Promise.all(sendMailPromises);
};

app.post('/send-promotion', async (req, res) => {
  try {
    const { productIds, emailAddresses, customSubject, bannerText } = req.body;

    // Check for the existence of all required fields
    if (!productIds || !emailAddresses || !customSubject || !bannerText) {
      return res.status(400).send('Product IDs, email addresses, custom subject, and banner text are required');
    }

    // Split productIds and emailAddresses into arrays
    const productIdsArray = productIds.split(' ').filter(id => id.trim() !== '');
    const recipients = emailAddresses.split(' ').filter(email => email.trim() !== '');

    // Fetch product data for all product IDs
    const productsData = await getProductsFromWix(productIdsArray);

    // Generate email content with the fetched products and the provided banner text
    const emailContent = createEmailContent(productsData, bannerText);

    // Send the email to all recipients with the custom subject
    await sendPromotionalEmail(recipients, customSubject, emailContent);
    res.status(200).send('Promotional email(s) sent successfully');
  } catch (error) {
    console.error('Error in send-promotion endpoint:', error);
    res.status(500).send('Failed to send promotional email(s)');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
