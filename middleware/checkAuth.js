const jwt = require('jsonwebtoken');


module.exports.checkUser = (req, res, next) => {
  console.log('checkuser trigger');
  const token = req.headers.authorization;
  try {

    if (token) {
      const decode = jwt.decode(token, process.env.SECRET);
      if (decode) {
        req.userId = decode.id;

        return next();
      } else {
        return res.status(401).json({
          status: 401,
          message: 'You are not authorised'
        });
      }

    } else {
      return res.status(401).json({
        status: 401,
        message: 'You are not authorised'
      });
    }

  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: 'You are not authorised'
    });
  }

}




module.exports.checkAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  try {

    if (token) {
      const decode = jwt.decode(token, process.env.SECRET);
      if (decode && decode.isAdmin) {
        return next();
      } else {
        return res.status(401).json({
          status: 401,
          message: 'You are not authorised'
        });
      }

    } else {
      return res.status(401).json({
        status: 401,
        message: 'You are not authorised'
      });
    }

  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: 'You are not authorised'
    });
  }

}