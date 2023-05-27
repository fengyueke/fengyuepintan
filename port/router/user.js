const express = require('express')
const route=express.Router()

const {reg_schema,login_schema} = require('../schema/user')
const expressJoi=require('@escook/express-joi')
const {regUser,login,myInfo}=require('../router-handler/user')
// 注册新用户
route.post('/register',expressJoi(reg_schema),regUser)

// 登录
route.post('/login',login)

// 获取个人信息
route.get('/myinfo',myInfo)


module.exports=route