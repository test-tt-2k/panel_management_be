import Member from "../models/Member.js";

export const login = async (req, res, next) => {
  try {
    const existMember = await Member.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!existMember)
      return res
        .status(400)
        .json({ message: "Username hoặc password không chính xác" });

    return res.status(200).json({ data: existMember });
  } catch (error) {
    next(error);
  }
};

export const createMember = async (req, res, next) => {
  try {
    const existMember = await Member.findOne({ username: req.body.username });
    if (existMember)
      return res.status(400).json({ message: "Username đã tồn tại" });
    const newMember = new Member(req.body);
    await newMember.save();
    return res.status(200).json({ message: "Tạo member thành công" });
  } catch (error) {
    next(error);
  }
};

export const deleteMember = async (req, res, next) => {
  try {
    await Member.findOneAndDelete(req.params.id);
    return res.status(200).json({ message: "Xoá member thành công" });
  } catch (error) {
    next(error);
  }
};

export const listMember = async (req, res, next) => {
  try {
    const listMembers = await Member.find({ isAdmin: false });
    return res
      .status(200)
      .json({ message: "Get list member successfully", data: listMembers });
  } catch (error) {
    next(error);
  }
};
