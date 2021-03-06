const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");
const addNewPizzaController = require("../app/http/controllers/admin/addNewPizzaController");

const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

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
  app.get("/customer/orders/:id", auth, orderController().show);

  // Admin routes
  app.get("/admin/orders", admin, adminOrderController().index);
  app.post("/admin/order/status", admin, statusController().update);
  app.post("/admin/addnewpizza", admin, addNewPizzaController().add);
  app.get("/admin/addnewpizza", admin, addNewPizzaController().new);

};

module.exports = initRoutes;
