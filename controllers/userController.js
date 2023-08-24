const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.query);
  try {
    const isExistUser = await User.findOne({ email: email });

    if (isExistUser) {
      const isValidPassword = await bcrypt.compareSync(password, isExistUser.password);

      if (isValidPassword) {
        const token = jwt.sign({ id: isExistUser._id, isAdmin: isExistUser.isAdmin }, process.env.SECRET, { expiresIn: '1h' });
        return res.status(200).json({
          status: 'success',
          data: {
            id: isExistUser._id,
            fullname: isExistUser.fullname,
            email: isExistUser.email,
            isAdmin: isExistUser.isAdmin,
            token,
            shippingAddress: isExistUser.shippingAddress
          }
        });
      } else {
        return res.status(401).json({
          status: 'error',
          message: 'invalid credential'
        });
      }


    } else {
      return res.status(400).json({
        status: 'error',
        message: 'user not found'
      })
    }

  } catch (err) {

    return res.status(400).json({
      status: 'error',
      message: `something went wrong ${err}`
    })
  }
}





module.exports.userSignUp = async (req, res) => {
  const { email, fullname, password } = req.body;

  try {
    const isExistUser = await User.findOne({ email: email });
    if (isExistUser) {
      return res.status(422).json({
        status: 'error',
        message: 'user already exist'
      });
    }
    const hashedPassword = await bcrypt.hash(password ?? '123456', 12);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      status: 'success',
      message: 'user successfully registered'
    });
  } catch (err) {

    return res.status(400).json({
      status: 'error',
      message: err
    })
  }

}


module.exports.updateUserProfile = async (req, res) => {

  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.fullname = req.body.fullname || user.fullname;
      user.email = req.body.email || user.email;
      user.shippingAddress = req.body.shippingAddress || user.shippingAddress;
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        user.password = hashedPassword;
      }
      const updatedUser = await user.save();
      const token = jwt.sign({ id: updatedUser._id, isAdmin: updatedUser.isAdmin }, 'tokenGenerate');
      return res.status(200).json({
        status: 'success',
        data: {
          id: updatedUser._id,
          fullname: updatedUser.fullname,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token,
          shippingAddress: updatedUser.shippingAddress
        }
      });

    } else {
      return res.status(404).json({
        status: 'error',
        message: 'user not found'
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: `something went wrong ${err}`
    });
  }

}



module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.userId }).select({ password: 0 });
    return res.status(200).json(user);

  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: `something went wrong ${err}`
    });
  }
}


module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select({ password: 0 }).sort({ createdAt: -1 })

    return res.status(200).json(users);

  } catch (err) {
    return res.status(400).json({
      status: 'error',
      message: `something went wrong ${err}`
    });
  }
}