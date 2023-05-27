const db=require('../db/index')
const bcrypt=require('bcryptjs')
// 导入token包
const jwt=require('jsonwebtoken')
const config=require('../config')

// 创建注册用户信息处理函数
exports.regUser=(req,res)=>{
  const user=req.body
  const sql='select phone,nickname from user'
  db.query(sql,(err,results)=>{
    if(err) return res.cc(err)
    let phoneC= results.some(item => {
      let comPars=bcrypt.compareSync(user.phone,item.phone)
      if(comPars){
        return true
      }
      return false
    })
    let nicknameC= results.some(item => {
      if(user.nickname===item.nickname){
        return true
      }
      return false
    })
    
    if(phoneC){
      return res.cc('手机号已注册')
    }
    if(nicknameC){
      return res.cc('用户名重复')
    }
       // 加密
       user.password=bcrypt.hashSync(user.password,10)
      // 加密手机号
      user.phone=bcrypt.hashSync(user.phone,10)
      const sqlStr='insert into user(phone,nickname,password) values (?,?,?)'
      db.query(sqlStr,[user.phone,user.nickname,user.password],(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows!==1) return res.cc('注册用户失败，请稍后再试')
       res.cc('注册成功',200)
     })
     });
  }
// 创建登录处理函数
exports.login=(req,res)=>{
  const userInfo=req.body
  let t =/^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  let temp=t.test(userInfo.phone)
  if(!temp) return res.cc('请输入正确的手机号')
  // 创建 sql 语句
  const sqlStr='select * from user'
  db.query(sqlStr,(err,results)=>{
    // console.log(results);
    let id=-1    
    if(err) return res.cc(err)
    let flag=results.some(item=>{
      let compare=bcrypt.compareSync(userInfo.phone,item.phone)
      if(compare){
        id=item.uid
        return true
      }
      return false
    })
    if(!flag) return res.cc('账号未注册，是否前往注册')
    let sql='select * from user where uid=?'
    db.query(sql,[id],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
      let compare=bcrypt.compareSync(userInfo.password,results[0].password)
      if(!compare) return res.cc('登录失败，账号或密码错误')
      let user={...results[0],password:'',phone:''}
    // 对用户信息进行加密，生成token 字符串
      const tokenStr=jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
      res.send({
      status:200,
      msg:'登录成功',
      token:'Bearer '+tokenStr
    })
    })
  })
}

// 创建获取个人信息接口
exports.myInfo=(req,res)=>{
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='select uid,nickname,headerPh,watchlist,publishMenu,collect,indent,shopping,fans,integral,birthday,signature,sex from user where uid=?'
    db.query(sqlStr,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
      res.send({
        status:200,
        msg:'请求成功',
        data:results[0]
      }) 
    })
  })
}
