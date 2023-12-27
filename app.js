const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "/opt/homebrew/bin/chromium"
    });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForTimeout(5000);
    const screenshot = await page.screenshot({ fullPage: true });

    await browser.close();

    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error capturing screenshot');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
