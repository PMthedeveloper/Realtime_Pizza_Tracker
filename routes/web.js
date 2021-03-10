const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");

const initRoutes = (app) => {
  app.get("/", homeController().index);

  app.get("/cart", cartController().cart);
  app.post("/update-cart", cartController().update);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);
  app.post("/logout", authController().logout);

  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  // Customer routes
  app.post("/orders", auth, orderController().store);
  app.get("/customers/orders", auth, orderController().index);

  // Admin routes
  app.get("/admin/orders", auth, adminOrderController().index);

};

module.exports = initRoutes;
