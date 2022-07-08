const User = require('../model/userModel');
const bcrypt = require('bcrypt');
// 암호화를 위한 라이브러리
module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({username});

        if(usernameCheck) {
            return res.json({msg: "Username already used", status: false});
            // username이 이미 존재할 경우 응답 값
        }

        const emailCheck = await User.findOne({email});

        if(emailCheck) {
            return res.json({msg: "Email already used", status: false});
            // username이 이미 존재할 경우 응답 값
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword
        });

        delete user.password;
        return res.json({status: true, user});
    }catch(ex) {
        next(ex);
        // 현재 응답, 요청 종료를 유보하고 다음 단계로 넘기기
    }
};


module.exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user) {
            return res.json({msg: "Plz check username", status: false});
            // login 시 등록된 username이 없는 경우
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        // 암호화 된 비밀번호와 입력된 비밀번호 비교

        if(!isPasswordValid) {
            return res.json({msg: "Plz check password", status: false});
        }
        delete user.password;
        return res.json({status: true, user});
    }catch(ex) {
        next(ex);
        // 현재 응답, 요청 종료를 유보하고 다음 단계로 넘기기
    }
};


module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        });
        return res.json({isSet: userData.isAvatarImageSet, image: userData.avatarImage})
    }catch(ex) {
        next(ex)
    }
};


module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };