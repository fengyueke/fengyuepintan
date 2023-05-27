const joi=require('joi')

const phone = joi.string().pattern(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/).required()
const password=joi.string().pattern(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/).required()
const nickname=joi.string().min(1).max(12).required()
const sex=joi.string().min(1).max(2).required()
const birthday=joi.string().required()
const sign=joi.string().max(30).required()
exports.reg_schema={
  body:{
    phone,
    nickname,
    password
  }
}
exports.login_schema={
  body:{
    phone,
    password
  }
}
exports.upPhone_schema={
  body:{
    phone
  }
}
exports.upName_schema={
  body:{
    nickname
  }
}
exports.upPwd_schema={
  body:{
    password
  }
}

exports.upSex_schema={
  body:{
    sex
  }
}
exports.upBtd_schema={
  body:{
    birthday
  }
}
exports.upSign_schema={
  body:{
    sign
  }
}