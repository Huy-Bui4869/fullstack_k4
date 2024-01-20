module.exports = {
  index: async (req, res) => {
    const userLogin = req.session.userLogin;

    if (!userLogin) {
      return res.redirect("/dang-nhap");
    }

    res.render("home/index", { userLogin });
  },
};
