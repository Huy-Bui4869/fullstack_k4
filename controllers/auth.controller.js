const { string } = require("yup");
const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

    const users = await User.findOne({
      where: {
        email: body.email,
        status: true,
      },
    });

    if (!users) {
      req.flash("msg", "Email hoặc mật khẩu không chính xác");
      return res.redirect("/dang-nhap");
    }

    const result = await bcrypt.compare(body.password, users.password);

    if (result) {
      req.session.userLogin = users.name;
      return res.redirect("/");
    }

    req.flash("msg", "Email hoặc mật khẩu không chính xác");
    return res.redirect("/dang-nhap");
  },

  register: (req, res) => {
    delete req.session.userLogin;
    const msg = req.flash("msg");
    res.render("auth/register", { req, msg });
  },

  handleRegister: async (req, res) => {
    const body = await req.validate(req.body, {
      email: string()
        .required("email bắt buộc phải nhập")
        .email("Nhập đúng định dạng email"),
      password: string().required("Vui lòng nhập password"),
    });

    if (!body) {
      req.flash("msg", "Vui lòng nhập đầy đủ thông tin");
      return res.redirect("/dang-ky");
    }

    const users = await User.findOne({
      where: {
        email: body.email,
      },
    });

    if (users) {
      req.flash("msg", "Email đã tồn tại trên hệ thông");
      return res.redirect("/dang-ky");
    }

    const hashPassword = await bcrypt.hash(body.password, saltRounds);

    if (hashPassword) {
      const userName = body.email.slice(0, body.email.indexOf("@"));
      const addUser = await User.create({
        name: userName,
        email: body.email,
        password: hashPassword,
        status: false,
      });

      if (addUser) {
        req.flash("msgSuccess", "đăng ký tài khoản thành công");
        res.redirect("/dang-nhap");
      }
    } else {
      req.flash("msg", "Có lỗi xảy ra vui lòng thử lại");
      res.redirect("/dang-ky");
    }
  },

  handleLogout: (req, res) => {
    delete req.session.userLogin;
    req.flash("msgSuccess", "Đã đăng suất thành công");
    return res.redirect("/dang-nhap");
  },
};
