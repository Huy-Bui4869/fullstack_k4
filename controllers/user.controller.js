const { string } = require("yup");
const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  //trang cập nhật thông tin tài khoản
  index: async (req, res) => {
    const user = await User.findOne({
      where: { name: req.session?.userLogin },
    });

    const msgInfo = req.flash("msgInfo");

    res.render("user/index", { req, user, msgInfo });
  },

  handleUpdateUser: async (req, res) => {
    const user = await User.findOne({
      where: { name: req.session?.userLogin },
    });

    const body = await req.validate(req.body, {
      userName: string()
        .min(3, "tên phải từ 3 ký tự trở lên")
        .required("tên bắt buộc phải nhập"),
      email: string()
        .required("email bắt buộc phải nhập")
        .email("Nhập đúng định dạng email"),
    });
    console.log("body", body);

    if (!body) {
      req.flash("msgInfo", "Vui lòng nhập đầy đủ thông tin");
      return res.redirect("/users");
    }

    const checkMail = await User.findOne({ where: { email: body.email } });

    if (checkMail && checkMail.id !== user.id) {
      req.flash(
        "msgInfo",
        "Email đã tồn tại trên hệ thống, vui lòng nhập email khác"
      );
      return res.redirect("/users");
    }

    const status = await User.update(
      { name: body.userName, email: body.email },
      { where: { id: user.id } }
    );

    req.session.userLogin = body.userName;
    req.flash("msgInfo", "Cập nhật mật khẩu thành công");

    return res.redirect("/");
  },

  //trang cập nhật mật khẩu
  updatePassword: (req, res) => {
    const errors = req.flash("err");
    const message = req.flash("message");
    res.render("user/password", { errors, message });
  },

  handleUpdatePassword: async (req, res) => {
    const { oldPassword, password, retypePassword } = req.body;
    const username = req.session?.userLogin;

    const user = await User.findOne({ where: { name: username } });

    if (user) {
      let errorMessage = "";
      //Kiểm tra mật khẩu cũ có trùng khớp hay không.
      const checkPassword = await bcrypt.compare(oldPassword, user.password);

      if (!oldPassword || !password || !retypePassword) {
        errorMessage = "Vui lòng nhập đầy đủ thông tin";
      } else if (!checkPassword) {
        errorMessage = "Mật khẩu cũ không trùng khớp";
      } else if (password !== retypePassword) {
        errorMessage = "Mật khẩu mới không trùng khớp";
      } else if (oldPassword === password) {
        errorMessage = "Vui lòng nhập mật khẩu mới";
      }

      if (errorMessage.length) {
        req.flash("err", errorMessage);
        return res.redirect("/users/password");
      }

      const hashPassword = await bcrypt.hash(password, saltRounds);

      const status = await User.update(
        { password: hashPassword },
        { where: { id: user.id } }
      );

      req.flash("message", "Cập nhật mật khẩu thành công");

      return res.redirect("/users/password");
    }

    res.redirect("/users/password");
  },
};
