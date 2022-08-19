const express = require("express");
const multer = require("multer");
const User = require("./model/user");
const app = new express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // 当前路径uploads文件夹下面
  },
  //   自定义文件名字
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.set("view engine", "ejs");
app.use("/uploads", express.static("uploads")); // 设置静态托管
app.use(express.urlencoded()); // 处理x-www-form-urlencoded编码
app.use(express.json()); // 处理json格式的请求
// 注册页面展示
app.get("/register", (req, res) => {
  res.render("register");
});

// 图片上传
app.post("/upload", upload.single("avatar"), function (req, res, next) {
  console.log(req.file);
  if (req.file.path) {
    res.json({
      code: 200,
      msg: "上传成功",
      path: req.file.path,
    });
  }
});

// 注册逻辑处理
app.post("/doregister", async (req, res) => {
  console.log(req.body);
  //   先去看看数据库有没有此用户
  const checkusers = await User.find(req.body);
  if (checkusers.length > 0) {
    // 说明数据库已经存在此用户
    res.json({
      code: 201,
      msg: "用户已存在",
    });
  } else {
    // 插入数据注册新用户
    const user = new User(req.body);
    const result = await user.save();
    if (result) {
      res.json({
        code: 200,
        msg: "注册成功",
      });
    }
  }
});

// 渲染登陆页面
app.get("/login", (req, res) => {
  res.render("login");
});
// 处理登录
app.post("/dologin", async (req, res) => {
  console.log(req.body);
  const result = await User.find(req.body);
  console.log(result);
  if (result.length > 0) {
    res.json({
      code: 200,
      msg: "登陆成功",
    });
  } else {
    res.json({
      code: 203,
      msg: "登录失败",
    });
  }
});
// 首页
app.get("/", (req, res) => {
  res.render("index");
});
// 获取所有的用户
app.get("/users", async (req, res) => {
  // 找出所有的用户
  const result = await User.find();
  if (result.length > 0) {
    res.json({
      code: 200,
      msg: "获取用户成功",
      users: result,
    });
  } else {
    res.json({
      code: 205,
      msg: "暂无用户信息",
      users: null,
    });
  }
});
/*
  restful风格的api
  get    ----> 向服务器获取资源
  post   ----> 向服务器添加资源
  put    ----> 向服务器修改资源
  delete ----> 删除资源
  head
  options
*/
// 删除用户  动态传参
app.delete("/deleteuser/:id", async (req, res) => {
  const id = req.params.id;
  const result = await User.findByIdAndDelete(id);
  console.log(1212, result);
  if (result) {
    res.json({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.json({
      code: 206,
      msg: "删除失败",
    });
  }
});
// 显示修改页面
app.get("/edit", (req, res) => {
  res.render("edit");
});
// 根据id获取用户
app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  // 根据id去数据库查询id对应的信息
  const result = await User.findById(id);
  console.log(232323, result);
  if (result) {
    res.json({
      code: 200,
      msg: "获取用户信息成功",
      user: result,
    });
  }
});
// 修改用户信息
app.put("/edituser/:id", async (req, res) => {
  const id = req.params.id;
  const result = await User.findByIdAndUpdate(id, req.body);
  if (result) {
    res.json({
      code: 200,
      msg: "修改用户成功",
    });
  } else {
    res.json({
      code: 207,
      msg: "修改用户失败",
    });
  }
});
app.listen(8888);
