const Router = require("koa-router");
const router = new Router();

const path = require("path");
const domtoimage = require("dom-to-image");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const pdfcrowd = require("pdfcrowd");
const pdf = require("html-pdf");

const { fromPath } = require("pdf2pic");
const options = { format: "Letter" };

const nodeHtmlToImage = require("node-html-to-image");

const puppeteer = require("puppeteer");
const { Cluster } = require("puppeteer-cluster");

const html = "<html><body><h1>Hello World!</h1></body></html>";

router.get("/test", async (ctx) => {
  // 有广告。。。
  // https://pdfcrowd.com/doc/api/html-to-image/nodejs/#convert_string_to_file
  // const client = new pdfcrowd.HtmlToImageClient(
  //   "demo",
  //   "ce544b6ea52a5621fb9d55f8b542d14d"
  // );
  // try {
  //   client.setBlockAds(true);
  //   client.setOutputFormat("png");
  // } catch (why) {
  //   console.error("Pdfcrowd Error: " + why);
  // }
  // client.convertStringToFile(
  //   "<html><body><h1>Hello World!</h1></body></html>",
  //   "kkk.png",
  //   function (fileName, err) {
  //     if (err) return console.error("Pdfcrowd Error: " + err);
  //     console.log("Success: the file was created " + fileName);
  //   }
  // );

  // pdf
  //   .create("<html><body><h1>Hello World!</h1></body></html>")
  //   .toBuffer(function (err, buffer) {
  //     console.log("This is a buffer:", Buffer.isBuffer(buffer));
  //   });
  pdf.create(html, options).toFile("./businesscard.pdf", function (err, res) {
    const options = {
      density: 100,
      saveFilename: "untitled",
      savePath: ".",
      format: "png",
      width: 600,
      height: 600,
    };
    const storeAsImage = fromPath("./businesscard.pdf", options);
    const pageToConvertAsImage = 1;

    storeAsImage(pageToConvertAsImage).then((resolve) => {
      console.log("Page 1 is now converted as image");

      return resolve;
    });
    if (err) return console.log(err);
    // console.log(res); // { filename: '/app/businesscard.pdf' }
  });

  // const buffer = await nodeHtmlToImage({
  //   output: "./image.png",
  //   html: `<html>
  //     <head>
  //       <style>
  //         body {
  //           width: 300px;
  //           height: 200px;
  //         }
  //       </style>
  //     </head>
  //     <body>快来猜</body>
  //   </html>
  //   `,
  // });
  // console.log(buffer);

  // (async () => {
  //   const browser = await puppeteer.launch({
  //     headless: true,
  //   });
  //   const page = await browser.newPage();
  //   await page.setViewport({ width: 300, height: 200 });
  //   await page.goto("https://www.google.com.hk");
  //   //对整个页面截图
  //   await page.screenshot({
  //     path: path.resolve(`./google.png`), //图片保存路径
  //     type: "png",
  //     fullPage: false, //边滚动边截图
  //   });
  //   await page.close();
  //   await browser.close();
  // })();

  // (async () => {
  //   const browser = await puppeteer.launch({
  //     headless: true,
  //   });
  //   const page = await browser.newPage();
  //   await page.setViewport({ width: 300, height: 200 });
  //   await page.setContent(html, { waitUntil: "networkidle0" });
  //   //对整个页面截图
  //   const data = await page.screenshot({
  //     path: path.resolve(`./test-1.png`), //图片保存路径
  //     type: "png",
  //     fullPage: false, //边滚动边截图
  //   });
  //   console.log(data);
  //   await page.close();
  //   await browser.close();
  // })();

  // const cluster = await Cluster.launch({
  //   concurrency: Cluster.CONCURRENCY_CONTEXT,
  //   maxConcurrency: 2,
  //   puppeteerOptions: { headless: true },
  // });
  // await cluster.task(async ({ page }) => {
  //   console.log("page: ", page);
  //   await page.setContent(html, { waitUntil: "networkidle0" });
  //   const element = await page.$("body");
  //   const buffer = await element.screenshot({ path: "./google.png" });
  //   console.log("buffer: ", buffer);
  // });
  ctx.body = "Hello Router";
});

module.exports = router;
