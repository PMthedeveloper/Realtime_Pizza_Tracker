const Menu = require("../../../models/menu");

const addNewPizzaController = () => {
  return {
    new(req, res) {
      res.render("admin/newPizza");
    },
    async add(req, res) {
      const { name, image, price, size } = req.body;
      if (!name || !image || !price || !size) {
        req.flash("error", "All fields are required");
        return res.redirect("/admin/addnewpizza");
      }
      const menu = new Menu({
        name,
        image,
        price,
        size,
      });
      menu
        .save()
        .then((result) => {
        //   return res.json({ menu: result });
        return res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
};

module.exports = addNewPizzaController;
