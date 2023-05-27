const db=require('../db/index')
const jwt = require('jsonwebtoken')
const config=require('../config')
const bcryptjs =require('bcryptjs')


exports.upName=(req,res)=>{
  let name=req.body
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) res.cc(err)
    let sqlStr='UPDATE user set nickname=? where uid=?'
    let sql='select nickname from user where uid=?'
    let sql2='select nickname from user'
    db.query(sql2,(err,results)=>{
      if(err) return res.cc(err)
      let flag= results.some(item => {
        if(name.nickname===item.nickname) return true
        return false
      });
      if(flag) return res.cc('用户名重复')
      db.query(sql,[data.uid],(err,results)=>{
        if(err) return res.cc(err)
        if(results[0].nickname===name.nickname) return res.cc('请输入您想修改的昵称')
        db.query(sqlStr,[name.nickname,data.uid],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('操作错误，请稍后再试')
        res.cc('修改成功',200)
      })
      })
    })
   
    
  })
}

exports.upPhone=(req,res)=>{
  let phone=req.body
  let bcyPhone=bcryptjs.hashSync(phone.phone,10)
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr ='update user set phone=? where uid=?'
    let sql='select uid,phone from user where uid=?'
    db.query(sql,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('操作错误，请稍后再试')
      if(results[0].phone=== phone.phone) return res.cc('请输入你想要修改成的手机号')
      // db.query(sqlStr,[bcyPhone,data.uid],(err,results)=>{
      //   if(err) return res.cc(err)
      //   if(results.affectedRows!==1) return res.cc('修改失败，请稍后再试')
        res.cc('修改成功',200)
      // })
    })
  })
}

exports.upPwd=(req,res)=>{
  let pwd=req.body.password
  console.log(pwd);
  let bcyPwd=bcryptjs.hashSync(pwd,10)
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    console.log(data);
    let sqlStr='update user set password=? where uid=?'
    let sql='select password from user where uid=?'
    db.query(sql,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('操作错误，请稍后再试')
      let compare=bcryptjs.compareSync(pwd,results[0].password)
      if(compare) return res.cc('不可使用旧密码，请输入新密码')
      db.query(sqlStr,[bcyPwd,data.uid],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('修改失败，请稍后再试')
        res.cc('修改成功',200)
      })
    })
  })
}

exports.upHp=(req,res)=>{
  let id=  req.body.id
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='update user set headerPh=? where uid=?'
    let sql='select headerPh from headerPh where id=?'
    db.query(sql,[id],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
      db.query(sqlStr,[results[0].headerPh,data.uid],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return ('修改失败，请稍后再试')
        res.cc('修改成功',200)
      })
    })


  })
}

exports.upSex=(req,res)=>{
  let sex=req.body.sex
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return err
    let sqlStr='update user set sex=? where uid=?'
    db.query(sqlStr,[sex,data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
      res.cc('修改成功',200)

    })
  })

}

exports.upBtd=(req,res)=>{
  const btd=req.body.birthday
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='update user set birthday=? where uid=?'
    db.query(sqlStr,[btd,data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
      res.cc('修改成功',200)
    })
  })
}

exports.upSign=(req,res)=>{
  let sign=req.body.sign
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)  
    let sqlStr='update user set signature=? where uid=?'
    db.query(sqlStr,[sign,data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows!==1 ) return res.cc('系统繁忙，请稍后再试')
      res.cc('修改成功',200)
    })
  })
}