const { string } = require("yup");
const { User } = require("../models/index");
const bcrypt = require("bcrypt");

module.exports = {
  login: (req, res) => {
    const userLogin = req.session.userLogin;
    const msg = req.flash("msg");
    const msgSuccess = req.flash("msgSuccess");

    if (userLogin) {
      return res.redirect("/");
    }
    //views
    res.render("auth/login", { req, msg, msgSuccess });
  },

  handleLogin: async (req, res) => {
    const body = await req.validate(req.body, {
      email: string()
        .required("email bắt buộc phải nhập")
        .email("Nhập đúng định dạng email"),
      password: string().required("Vui lòng nhập password"),
    });

    if (!body) {
      req.flash("msg", "Vui lòng nhập đầy đủ thông tin");
      return res.redirect("/dang-nhap");
    }

    // bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    //   console.log("kq", hash);
    // });

    const users = await User.findOne({
      where: {
        email: body.email,
      },
    });

    if (users) {
      return bcrypt.compare(body.password, users.password, (err, result) => {
        if (err) {
          return req.flash("msg", "Có lỗi xảy ra vui lòng thử lại?");
        }

        if (result) {
          // console.log("đủ điều kiện đăng nhập");
          req.session.userLogin = users.name;
          return res.redirect("/");
        }

        req.flash("msg", "Email hoặc mật khẩu không chính xác");
        return res.redirect("/dang-nhap");
      });
    }

    req.flash("msg", "Email hoặc mật khẩu không chính xác");
    return res.redirect("/dang-nhap");
  },

  handleLogout: (req, res) => {
    delete req.session.userLogin;
    req.flash("msgSuccess", "Đã đăng suất thành công");
    return res.redirect("/dang-nhap");
  },
};
