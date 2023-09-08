const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(
    app.listen(8000, () => {
        console.log("Backend Ready!");
    })
  )
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan("common"));
app.use(express.json());

// Public images path
app.use("/images", express.static(path.join(__dirname, "public/images")));

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage: storage});

app.post("/api/upload", upload.single("file"), (req, res) => {

  try {
    
    const file = req.file;

    return res.status(200).json(file);

  } catch (err) {
    console.log(err);
  }

});

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);