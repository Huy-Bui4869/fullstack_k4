const { object } = require("yup");

module.exports = (req, res, next) => {
  req.validate = async (data, rules = {}) => {
    try {
      const schema = object(rules);
      const body = await schema.validate(data, {
        abortEarly: false,
      });

      return body;
    } catch (e) {
      //Xử lý lỗi
      const errors = Object.fromEntries(
        e.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      req.flash("old", data);
    }
  };
  //Đưa thông báo lỗi vào trong request.
  const errors = req.flash("errors");
  req.errors = errors.length ? errors[0] : {};
  //Giữ lại dữ liệu cũ khi nhập sai.
  const old = req.flash("old");
  req.old = old.length ? old[0] : {};
  next();
};
