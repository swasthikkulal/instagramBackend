var express = require('express');
var router = express.Router();
const registerModel = require("../Schema/registerSchema")
const cors = require("cors");
const { route } = require('../app');
const bcrypt = require("bcrypt")
const env = require("dotenv").config();
const jwt = require("jsonwebtoken")
const authenticate = require("../userauthenticate/authenticate")
const multer = require("multer")
const path = require("path");
const postModel = require("../Schema/postSchema")
const statusModel = require("../Schema/statusModel")

/* GET home page. */
router.use(cors())
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/api/register", async (req, res) => {
  try {
    console.log(req.body)
    let { name, username, email, password } = req.body
    const secPassword = await bcrypt.hash(password, 10)
    const user = await registerModel.create({
      name,
      username,
      email,
      password: secPassword
    })
    const saveData = await user.save()
    res.json({ success: true, data: saveData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
})

router.post("/api/login", async (req, res) => {
  try {
    console.log(req.body)
    let { email, password } = req.body
    const user = await registerModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "invalid user" })
    }
    const comparePass = await bcrypt.compare(password, user.password)
    if (!comparePass) {
      return res.json({ success: false, message: "invalid user" })
    }
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET)
    console.log(token, 111111)
    return res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
})
router.get("/user/auth", authenticate, async (req, res) => {
  try {

    const findUser = await registerModel.findById({ _id: req.user.id })
    if (!findUser) {
      return res.json({ success: false, message: "invalid user" })
    }
    return res.json({ success: true, data: findUser })
  } catch (error) {
    return res.json({ success: false, message: "invalid user" })
  }

})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in 'uploads' folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage })

// DP
// router.post("/api/dp", authenticate, upload.single("dp"), async (req, res) => {
//   try {
//     console.log(req.file)
//     console.log(req.body)
//     let { name, username, bio } = req.body
//     const user = await registerModel.findById({ _id: req.user.id })


//     const dppost = await postModel.find({ user: req.user.id })
//     if (!dppost) {
//       return res.json({ success: false, message: "user invalid" })
//     }
//     if (req.file) {
//       try {
//         const addDp = await dppost({
//           dp: req.file.fieldname
//         })
//         await addDp.save()
//         return res.json({ success: true, data: addDp })
//       } catch (error) {
//         return res.json({ success: false, message: error.message })
//       }

//     }


//     if (!user) {
//       return res.json({ success: false, message: "user invalid" })
//     }
//     if (req.file) {
//       user.dp = req.file.filename;
//     }

//     if (name) user.name = name
//     if (username) user.username = req.body.username
//     if (bio) user.bio = bio

//     await user.save()

//     return res.json({ success: true, data: user })
//   } catch (error) {
//     return res.json({ success: false, message: "user invalid" })
//   }
// })
router.post("/api/dp", authenticate, upload.single("dp"), async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const user = await registerModel.findById(req.user.id);
    if (!user) return res.json({ success: false, message: "Invalid user" });

    // Save DP in registerModel
    if (req.file) {
      user.dp = req.file.filename;
    }

    // Update user fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;

    await user.save();

    // Save DP as a special post in postModel


    return res.json({ success: true, data: { user } });
  } catch (error) {
    console.error("DP upload error:", error);
    return res.json({ success: false, message: error.message });
  }
});


// router.post("/api/post/dp", authenticate, upload.single("dp"), async (req, res) => {
//   try {

//     const user = await postModel.find({ user: req.user.id });
//     if (!user) return res.json({ success: false, message: "Invalid user" });

//     // Save DP in registerModel
//     if (req.file) {
//       user.dp = req.file.filename;
//     }

//     // Update user fields




//     await user.save();

//     // Save DP as a special post in postModel


//     return res.json({ success: true, data: { user } });
//   } catch (error) {
//     console.error("DP upload error:", error);
//     return res.json({ success: false, message: error.message });
//   }
// });


//Post user

router.post("/api/user/post", authenticate, upload.single("post"), async (req, res) => {
  try {
    console.log(req.file)
    const registerUser = await registerModel.findById({ _id: req.user.id })
    if (!registerUser) {
      return res.json({ success: false, message: "invalid user" })
    }
    const postUser = await postModel({
      user: registerUser,
      posts: req.file.filename,
      dp: registerUser.dp,
      username: registerUser.username
    })


    const saveData = await postUser.save()

    return res.json({ success: true, data: saveData })
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
})

router.get("/api/user/post/get", authenticate, async (req, res) => {
  try {
    const user = await postModel.find({ user: req.user.id })
    if (!user) {
      return res.json({ success: false, message: "invalid user" })
    }
    return res.json({ success: true, data: user })
  } catch (error) {
    return res.json({ success: false, message: error.message })

  }
})
router.get("/api/feed/posts", authenticate, async (req, res) => {
  try {

    const user = await postModel.find()
    if (!user) {
      return res.json({ success: false, message: "invalid user" })
    }
    return res.json({ success: true, data: user })
  } catch (error) {
    return res.json({ success: false, message: error.message })

  }
})

router.get("/api/status/get", authenticate, async (req, res) => {
  try {

    const loggeduser = await registerModel.find({ _id: { $ne: req.user.id } });
    return res.json({ success: true, data: loggeduser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
