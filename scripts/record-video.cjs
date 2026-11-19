const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const outDir = path.join("C:\\Users\\julia\\Desktop\\dev\\tools\\out");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: { dir: outDir, size: { width: 1080, height: 1920 } },
  });
  const page = await context.newPage();

  await page.goto("https://bari-caffe-conceito.vercel.app", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log("scrollHeight:", scrollHeight);

  const steps = 52;
  const stepDuration = 450;
  for (let i = 0; i <= steps; i++) {
    const y = (scrollHeight * i) / steps;
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await new Promise((r) => setTimeout(r, stepDuration));
  }
  await page.waitForTimeout(2000);

  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  const finalRaw = path.join(outDir, "bari-hero-raw.webm");
  fs.renameSync(videoPath, finalRaw);
  console.log("VIDEO_SAVED:", finalRaw);
})();
