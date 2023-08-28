import Data from "../models/Data.js";
import { google } from "googleapis";
import dotenv from "dotenv";
import stream from "stream";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const driver = google.drive({
  version: "v3",
  auth: oauth2Client,
});

export const create = async (req, res, next) => {
  try {
    const img = req.files.img[0];
    const video = req.files.video[0];
    const bufferStreamImg = new stream.PassThrough();
    bufferStreamImg.end(img.buffer);
    const bufferStreamVideo = new stream.PassThrough();
    bufferStreamVideo.end(video.buffer);

    const dataImg = await driver.files.create({
      media: {
        mimeType: img.mimeType,
        body: bufferStreamImg,
      },
      requestBody: {
        name: img.originalname,
      },
    });

    const dataVideo = await driver.files.create({
      media: {
        mimeType: video.mimeType,
        body: bufferStreamVideo,
      },
      requestBody: {
        name: video.originalname,
      },
    });

    const imgId = dataImg.data.id;
    const videoId = dataVideo.data.id;
    await setPublicFile(imgId);
    const videoUrl = await setPublicFile(videoId);

    const data = new Data({
      imgId,
      videoId,
      videoUrl,
      link: req.body.link,
      content: req.body.content,
      commentContent: req.body.commentContent,
    });

    await data.save();

    return res.status(200).json({ message: "Tạo  mới dữ liệu thành công" });
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    let listData;
    console.log(req.query.date);
    if (req.query.date == "undefined") {
      listData = await Data.find();
    } else {
      var targetDate = new Date(req.query.date);
      var startOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0,
        0,
        0
      );
      var endOfDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate() + 1,
        0,
        0,
        0
      );

      listData = await Data.find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });
    }
    return res
      .status(200)
      .json({ message: "Get list data successfully", data: listData });
  } catch (error) {
    next(error);
  }
};

export const deleteData = async (req, res, next) => {
  try {
    const data = await Data.findOne({ _id: req.params.id });
    await deleteFile(data.videoId);
    await deleteFile(data.imgId);
    await Data.findOneAndDelete(req.params.id);
    return res.status(200).json({ message: "Xoá data thành công" });
  } catch (error) {
    next(error);
  }
};

export const updateData = async (req, res, next) => {
  try {
    const data = await Data.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ message: "update data thành công" });
  } catch (error) {
    next(error);
  }
};
export const getDetail = async (req, res, next) => {
  try {
    const data = await Data.findOne({ _id: req.params.id });
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const setPublicFile = async fileId => {
  try {
    await driver.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const res = await driver.files.get({
      fileId,
      fields: "webViewLink, webContentLink",
    });

    return res.data.webViewLink;
  } catch (error) {
    throw error;
  }
};

const deleteFile = async fileId => {
  await driver.files.delete({ fileId });
};
