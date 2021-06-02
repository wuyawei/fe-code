const Router = require("koa-router");
const router = new Router();

router.get("/test", async (ctx) => {
  ctx.body = "Hello Router";
});

module.exports = router;
