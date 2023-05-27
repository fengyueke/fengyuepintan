const express = require('express')
const route=express.Router()
const {upName,upPhone,upPwd,upHp,upSex,upBtd,upSign} =require('../router-handler/updateUser')
const expressJoi =require('@escook/express-joi')
const {upName_schema,upPhone_schema,upPwd_schema,upSex_schema,upBtd_schema,upSign_schema} =require('../schema/user')
const { sign } = require('jsonwebtoken')

// 修改昵称
route.post('/upName',expressJoi(upName_schema),upName)
// 修改手机号
route.post('/upPhone',expressJoi(upPhone_schema),upPhone)
// 修改密码
route.post('/upPwd',expressJoi(upPwd_schema),upPwd)
// 修改头像
route.post('/upHp',upHp)
// 修改性别
route.post('/upSex',expressJoi(upSex_schema),upSex)
// 修改生日
route.post('/upBtd',expressJoi(upBtd_schema),upBtd)
// 修改个性签名
route.post('/upSign',expressJoi(upSign_schema),upSign)


module.exports=route