const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors'); // Import the cors middleware

const app = express();

// Use the cors middleware to allow cross-origin requests
app.use(cors()); // This allows all origins; you can configure it more restrictively if needed

app.use(express.json());

app.post('/analyze', async (req, res) => {
  try {
    const websiteUrl = req.body.url;
    const response = await axios.get(websiteUrl);
    const html = response.data;

    // Parse HTML and extract meta tags using cheerio
    const $ = cheerio.load(html);
    const metaTags = $('meta');

    // Extract and format meta tag data as needed
    const metaTagData = [];
    metaTags.each((index, element) => {
      const name = $(element).attr('name') || $(element).attr('property') || '';
      const content = $(element).attr('content') || '';
      metaTagData.push({ name, content });
    });

    res.json(metaTagData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while analyzing the website.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
