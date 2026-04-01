const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('--- GENERATING CV.PDF ---');
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    const url = 'http://localhost:3000/cv';
    console.log(`Navigating to ${url}...`);
    
    // Wait for the page to be fully loaded (Network Idle)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    
    const outputPath = path.join(__dirname, '../public/Ahmad-Mathlaul-Falah-CV.pdf');
    
    console.log(`Saving PDF to ${outputPath}...`);
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    await browser.close();
    console.log('--- SUCCESS: CV.PDF GENERATED ---');
  } catch (error) {
    console.error('--- FAILED TO GENERATE PDF ---');
    console.error(error);
    process.exit(1);
  }
})();
