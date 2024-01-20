module.exports = {
  authMiddleware: (req, res, next) => {
    // const isLogin = req.session?.userLogin;
    const isLogin = true;
    // console.log(isLogin);

    if (!isLogin) {
      console.log("chưa đăng nhập");
      //Giúp chuyển hướng
      return res.redirect("/dang-nhap");
    }
    console.log("đã đăng nhập");
    next();
  },
};
