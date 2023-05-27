const express = require('express')
const app = express()
const db=require('./db/index')
const joi=require('joi')
const jwt = require('jsonwebtoken')
const qs=require('qs')
const dayjs=require('dayjs')

// 解析POST提交过来的表单数据
app.use(express.urlencoded({ extended: false }));
// 设置跨域
const cors=require('cors')
app.use(cors())

// 优化res.send()
app.use(function(req,res,next){
  res.cc=function(err,status=1){
    res.send({
      status,
      msg: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 配置解析 token 的中间件
const expressJwt=require('express-jwt')
const config=require('./config')
app.use(expressJwt.expressjwt({secret:config.jwtSecretKey,algorithms:['HS256']}).unless({path:[/^\/my\//]}))

// 分类页的请求接口
app.get('/api/classify',(req,res)=>{
  db.query('select * from classify',(err,results)=>{
    if(err) return res.cc(err)
    res.send({status:200,msg:'请求成功',data: results})
  })
})
// 首页的请求接口
app.get('/my/home',(req,res)=>{
  page=parseInt(req.query.page)
  limitNum=parseInt(req.query.limit)
  page=(page-1)*limitNum
  let sqlStr='select * from menu left outer join user on (menu.userId=user.uid) limit ?,?'
  db.query(sqlStr,[page,limitNum],(err,results)=>{
    if(err) return res.cc(err)
    results.forEach(item => {
      delete item.password
    });
    res.send({status:200,msg:'请求成功',data:results})
  })
})
// 请求用户信息接口
app.get('/my/userInfo',(req,res)=>{
  id=parseInt(req.query.uid)
  let sqlStr='select uid,nickname,headerPh,watchlist,collect,indent,shopping,fans,integral from user where uid=?'
  db.query(sqlStr,[id],(err,results)=>{
    if(err) return res.cc(err)
    res.send({status:200,msg:'请求成功',data:results[0]})
  })
})
// 菜谱接口
app.get('/api/menu',(req,res)=>{
  id=parseInt(req.query.id)
  let sqlStr ='select * from menu where id=?'
  db.query(sqlStr,[id],(err,results)=>{
    if(err) return res.cc(err)
        res.send({status:200,msg:'请求成功',data:results[0]})
    })
  })
// 百度百科中的营养功效模块
app.get('/api/baike/nutritional',(req,res)=>{
  id=parseInt(req.query.id)
  db.query('select * from nutritional',(err,results)=>{
    if(err) return res.cc(err)
    results.forEach(item => {
      if(item.menuId===id){
        res.send({status:200,msg:'请求成功',data:item})
      }
    });
  })
})
// 百度百科中的饮食禁忌模块
app.get('/api/baike/taboo',(req,res)=>{
  id=parseInt(req.query.id)
  db.query('select * from taboo',(err,results)=>{
    if(err) return res.cc(err)
    results.forEach(item => {
      if(item.menuId===id){
        res.send({status:200,msg:'请求成功',data:item})
      }
    });
  })
})
// 查询热门搜索
app.get('/my/hotSearch',(req,res)=>{
  let sqlStr='select id,title,search from menu ORDER BY search DESC limit 0,6'
  db.query(sqlStr,(err,results)=>{
    if(err) return res.cc(err)
    res.send({status:200,msg:'请求成功',data:results})
  })
})
// 查询
app.get('/api/search',(req,res)=>{
  active=parseInt(req.query.active)
  val=req.query.val
  page=parseInt(req.query.page)
  limit=parseInt(req.query.limit)
  page=(page-1)*limit
  if(active===0){
    // let sqlStr="select id,title from menu where title like '%?%'"
    db.query(`select m.id,m.title,m.url,m.liked,m.collect,m.publishTime,u.nickname from menu m LEFT JOIN user u on m.userId=u.uid where title like '%${val}%' or inventory like '%${val}%' ORDER BY collect DESC limit ${page},${limit}`,(err,results)=>{
      if(err) return res.cc(err)
      res.send({status:200,msg:'请求成功',data:results})
    })
  }else if(active===1){
    db.query(`select uid,nickname,headerPh from user where nickname like '%${val}%' ORDER BY active DESC limit ${page},${limit}`,(err,results)=>{
      if(err) return res.cc(err)
      res.send({status:200,msg:'请求成功',data:results})
    })
  }
})
// 获取活跃达人
app.get('/my/active',(req,res)=>{
  db.query('select uid,nickname,headerPh from user ORDER BY active DESC limit 0,5',(err,results)=>{
    if(err) return res.cc(err)
    res.send({status:200,msg:'请求成功',data:results})
  })
})

// 挂载注册登录路由
const userRoute=require('./router/user')
app.use('/my',userRoute)

// 挂载修改用户信息
const updateUser=require('./router/updateUser')
app.use('/api',updateUser)

// 获取在库头像
app.get('/api/getHeaderPh',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let sqlStr='select * from headerPh limit ?,?'
  db.query(sqlStr,[page,limit],(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data: results
    })
  })
})

// 获取当前用户消息推送状态
app.get('/api/getNews',(req,res)=>{
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='select * from setNews where uid=?'
    db.query(sqlStr,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(!results.length){
          let sql='insert into setNews(uid) values (?)'
          db.query(sql,[data.uid],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
          })
      }
      if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
      res.send({
        status:200,
        msg:'请求成功',
        data:results[0]
      })
    })
  })
})
app.post('/api/setNews',(req,res)=>{
  let arr=req.body
  arr= qs.parse(arr)
  arr= arr.list.map(item => {
    return item
  });
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='update setNews set comment=?,collect=?,attention=?,official=?,everyday=? where uid=?'
    db.query(sqlStr,[arr[0],arr[1],arr[2],arr[3],arr[4],data.uid],(err,results)=>{
      if(err) return res.cc(err)
      res.cc('修改成功',200)
    }) 
  })
})
// 消息页数据请求
app.get('/my/getHotAction',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let sqlStr='select * from hotAction ORDER BY publishTime desc limit ?,?'
  db.query(sqlStr,[page,limit],(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})

// 集市banner 轮播
app.get('/my/getMarketSwiper',(req,res)=>{
  let sqlStr='select * from market_swiper ORDER BY active DESC LIMIT 0,4'
  db.query(sqlStr,(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})

// 获取限时抢购
app.get('/my/getMarketLimit',(req,res)=>{
  let sqlStr='select * from market_limitTimer ORDER BY active DESC limit 0,6'
  db.query(sqlStr,(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})

// 获取最新商品
app.get('/my/getMarketNewTarde',(req,res)=>{
  let sqlStr='select id,title,price,month,banner from market_newtrade ORDER BY publishTime DESC LIMIT 0,12'
  db.query(sqlStr,(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})
// 推荐
app.get('/my/getMarketRecommend',(req,res)=>{
  let sqlStr='select a.id,a.mid,b.banner,b.title from market_recommend a LEFT JOIN market b on a.mid=b.id ORDER BY a.active DESC limit 0,6'
  db.query(sqlStr,(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})
// 综合
app.get('/my/getMarketMonth',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let sqlStr='select id,banner,title,price,volume from market ORDER BY month DESC limit ?,?'
  db.query(sqlStr,[page,limit],(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})
// 销量
app.get('/my/getMarketVolume',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let sqlStr='select id,banner,title,price,volume from market ORDER BY volume DESC limit ?,?'
  db.query(sqlStr,[page,limit],(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})
// 价格
app.get('/my/getMarketPrice',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  if(data.desc==='false'){
    let sqlStr='select id,banner,title,price,volume from market ORDER BY price limit ?,?'
    db.query(sqlStr,[page,limit],(err,results)=>{
      if(err) return res.cc(err)
      res.send({
        status:200,
        msg:'请求成功',
        data:results
      })
    })
  }else{
    let sqlStr='select id,banner,title,price,volume from market ORDER BY price desc limit ?,?'
    db.query(sqlStr,[page,limit],(err,results)=>{
      if(err) return res.cc(err)
      res.send({
        status:200,
        msg:'请求成功',
        data:results
      })
    })
  }
  
})
// 新品
app.get('/my/getMarketTime',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let sqlStr='select id,banner,title,price,volume from market ORDER BY publishTime desc limit ?,?'
  db.query(sqlStr,[page,limit],(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})

// 获取导航中的信息
app.get('/my/getMarketRice',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let title=data.title
  // console.log(data);
  if(title==='米面粮油'){
    if(data.nav==='综合'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='南北干货'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='米面油'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='方便速食'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='销量'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='南北干货'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='米面油'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='方便速食'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='价格'){
      if(data.isDesc==='true'){
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='南北干货'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='米面油'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='方便速食'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }else{
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='南北干货'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='米面油'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='方便速食'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }
      
    }
    if(data.nav==='新品'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='南北干货'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='米面油'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='方便速食'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
  }
  if(title==='果蔬生鲜'){
    if(data.nav==='综合'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='水果蔬菜'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='生肉类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='水产品'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='销量'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='水果蔬菜'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='生肉类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='水产品'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='价格'){
      if(data.isDesc==='true'){
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='水果蔬菜'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='生肉类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='水产品'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }else{
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='水果蔬菜'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='生肉类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='水产品'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }
      
    }
    if(data.nav==='新品'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='水果蔬菜'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='生肉类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='水产品'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
  }
  if(title==='厨房电器'){
    if(data.nav==='综合'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='制备类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='准备类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='烹饪类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='销量'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='制备类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='准备类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='烹饪类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='价格'){
      if(data.isDesc==='true'){
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='制备类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='准备类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='烹饪类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }else{
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='制备类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='准备类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='烹饪类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }
      
    }
    if(data.nav==='新品'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='制备类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='准备类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='烹饪类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
  }
  if(title==='调味品'){
    if(data.nav==='综合'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
    }
    if(data.nav==='销量'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
    }
    if(data.nav==='价格'){
      if(data.isDesc==='true'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
      }else{
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
      }
    }
    if(data.nav==='新品'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
    }
  }
  if(title==='养生食材'){
    if(data.nav==='综合'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='酒类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='茶类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='药材'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='销量'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='酒类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='茶类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='药材'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY volume desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
    if(data.nav==='价格'){
      if(data.isDesc==='true'){
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='酒类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='茶类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='药材'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }else{
        if(data.classify==='全部'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='酒类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='茶类'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='药材'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
        if(data.classify==='其他'){
          let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY price desc limit ?,?'
          db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
            if(err) return res.cc(err)
            res.send({
              status:200,
              msg:'请求成功',
              data:results
            })
          })
        }
      }
      
    }
    if(data.nav==='新品'){
      if(data.classify==='全部'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='酒类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='茶类'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='药材'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
      if(data.classify==='其他'){
        let sqlStr='select id,banner,title,price,volume from market where nav=? and classify=? ORDER BY publishTime desc limit ?,?'
        db.query(sqlStr,[title,data.classify,page,limit],(err,results)=>{
          if(err) return res.cc(err)
          res.send({
            status:200,
            msg:'请求成功',
            data:results
          })
        })
      }
    }
  }
})

// 获取商品详细信息
app.get('/my/getMarketDetails',(req,res)=>{
  let id=req.query.id
  id=parseInt(id)
  let sqlStr='select a.id,a.mid,a.banner,a.title,a.month,a.name,a.freight,a.recommend,a.specification,a.comment,a.commentId,a.commentBanner,a.commentGood,a.qualified,b.name shopName,b.logo,b.stock,b.describe,b.serve,b.speed from market a LEFT JOIN market_merchant b on a.mid=b.mid where id=?'
  db.query(sqlStr,[id],(err,results)=>{
    if(err) return res.cc(err)
    if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
    res.send({
      status:200,
      msg:'请求成功',
      data:results[0]
    })
  })
})

// 根据商铺id获得具体信息
app.get('/my/getMarketStoke',(req,res)=>{
  let data=req.query
  let id=parseInt(data.id)
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let sqlStr=`select id,banner,title,price,volume,freight from market where mid=? ORDER BY ${data.classify} DESC limit ?,?`
  if(data.desc==='false'){
    sqlStr=`select id,banner,title,price,volume,freight from market where mid=? ORDER BY ${data.classify} limit ?,?`
   }
  db.query(sqlStr,[id,page,limit],(err,results)=>{
    if(err) return res.cc(err)
    res.send({
      status:200,
      msg:'请求成功',
      data:results
    })
  })
})

// 获取商铺具体信息
app.get('/my/getMarketShop',(req,res)=>{
  let id=req.query.id
  id=parseInt(id)
  let sqlStr='select name,logo,address,creation,phone from market_merchant where mid=?'
  db.query(sqlStr,[id],(err,results)=>{
    if(err) return res.cc(err)
    if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
    res.send({
      status:200,
      msg:'请求成功',
      data:results[0]
    })
  })
})

// 获取好友动态
app.get('/my/getDynamic',(req,res)=>{
  let data=req.query
  let page=parseInt(data.page)
  let limit=parseInt(data.limit)
  page=(page-1)*limit
  let uid=0
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    uid=data.uid
  })
  let sql=''
  data.watch.forEach((item,index)=>{
    item=parseInt(item)
    if(index!==data.watch.length-1){
      sql+='userId='+item+' or '
    }else{
      sql+='userId='+item
    }
  })
  let sqlStr=`select id,url,likes,introduce,comment,commentId,commentTime,publishTime,userId from menu where ${sql} ORDER BY publishTime desc limit ?,?`
  db.query(sqlStr,[page,limit],(err,results)=>{
    if(err) return res.cc(err)
    let arr=[]
    results.some(item => {
      if(item.likes.includes(uid)){
        arr.push(true)
      }else{
        arr.push(false)
      }
      // console.log(item.likes);
    });
    res.send({
      status:200,
      msg:'请求成功',
      data:results,arr
    })
  })
})
// 评论接口
app.post('/api/sendCommend',(req,res)=>{
  let time=dayjs().format('YYYY-MM-DD HH:mm:ss')
  let data=req.body
  let id=parseInt(data.id)
  let txt=data.comment
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sql='select comment,commentId,commentTime from menu where id=?'
    db.query(sql,[id],(err,results)=>{
      if(err) return res.cc(err)
      let comment =results[0].comment
      let commentId=results[0].commentId
      let commentTime=results[0].commentTime
      comment+='&'+txt
      commentId+='&'+data.uid
      commentTime+='&'+time
      let sqlStr='update menu set comment=?,commentId=?,commentTime=? where id=?'
      db.query(sqlStr,[comment,commentId,commentTime,id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
        res.cc('发送成功',200)
      })  
    })
  })
})

// 修改当前用户是否喜欢
app.get('/my/updateDynamicLike',(req,res)=>{
  let id=parseInt(req.query.id)
  let sql='select id,likes from menu where id=?'
  let token=req.headers.authorization
  token=token.split(' ')[1]
  let uid=0
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    uid=data.uid+''
  })
  db.query(sql,[id],(err,results)=>{
    if(err) return res.cc(err)
    if(results.length!==1) return res.cc('系统繁忙请稍后再试')
    let str=results[0].likes
    if(str.includes(uid)){
      let arr=str.split(',')
      arr.forEach((item,index) => {
        if(item===uid){
          arr.splice(index,1)
        }
      });
      str=arr.toString()
      let sqlStr='update menu set likes=? where id=?'
      db.query(sqlStr,[str,id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
        res.cc('修改成功',200)
      })
    }else{
      let arr=str.split(',')
      arr.push(uid)
      str=arr.toString()
      let sqlStr='update menu set likes=? where id=?'
      db.query(sqlStr,[str,id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
        res.cc('修改成功',200)
      })
    }
      
  })
})

// 关注用户接口
app.post('/api/focus',(req,res)=>{
  let id=parseInt(req.body.uid)
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sql1='select watchlist from user where uid=?'
    db.query(sql1,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
      let list=results[0].watchlist.split(',')
      let flag= list.some(item=>{
        item=parseInt(item)
        if(item===data.uid) {
          return true
        }
        return false
      })
      if(!flag){
        let sqlStr='update user set watchlist=? where uid=?'
        let dd=[...list]
        dd.push(''+data.uid)
        dd= dd.join()
        db.query(sqlStr,[dd,data.uid],(err,results)=>{
          if(err) return res.cc(err)
          if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
        })
      }else{
        let sqlStr='update user set watchlist=? where uid=?'
        let dd=[...list]
        let da=[]
        dd.forEach(item=>{
          item=parseInt(item)
          if(item!==data.uid){
            da.push(item)
          }
        })
        da=da.join()
        db.query(sqlStr,[da,data.uid],(err,results)=>{
          if(err) return res.cc(err)
          if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
        })
      }
    })
    let sql2='select fans from user where uid=?'
    db.query(sql2,[id],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
      // console.log(results[0].fans);
      if(results[0].fans!==null){
        let list=results[0].fans.split(',')
        let flag= list.some(item=>{
          item=parseInt(item)
          if(item===data.uid){
            return true
          }
          return false
        })
        if(!flag){
          if(list[0]===''){
            let sqlStr='update user set fans=? where uid=?'
            let dd=''+data.uid
            db.query(sqlStr,[dd,id],(err,results)=>{
              if(err) return res.cc(err)
              if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
              res.cc('操作成功',200)
            })
          }else{
            let sqlStr='update user set fans=? where uid=?'
            let temp=[...list]
            temp.push(data.uid)
            temp=temp.join()
            db.query(sqlStr,[temp,id],(err,results)=>{
              if(err) return res.cc(err)
              if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
              res.cc('操作成功',200)
            })
          }
         
        }else{
          let sqlStr='update user set fans=? where uid=?'
          let temp=[...list]
          let dd=[]
          temp.forEach(item=>{
            item=parseInt(item)
            if(item!==data.uid){
              dd.push(item)
            }
          })
          dd=dd.join()
          db.query(sqlStr,[dd,id],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
            res.cc('操作成功',200)
          })
        }
      }else{
        let sqlStr='update user set fans=? where uid=?'
        let temp=''+data.uid
        db.query(sqlStr,[temp,id],(err,results)=>{
          if(err) return res.cc(err)
          if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
          res.cc('操作成功',200)
        })
      }
    })
  })
})
// 获取用户关注
app.get('/api/getFocus',(req,res)=>{
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sql='select watchlist from user where uid=?'
    db.query(sql,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.length!==1) return res.cc('系统繁忙，请稍后再试')
      if(results[0].watchlist!==null && results[0].watchlist!==''){
          let list=results[0].watchlist.split(',')
          let flag= list.some(item=>{
            item=parseInt(item)
            if(item===data.uid){
              return true
            }
            return false
          })
          if(!flag){
            return res.cc('未关注',200)
          }else{
            return res.cc('已关注',200)
          }
        }else{
          return res.cc('未关注',200)
        }
    })
  })
})
// 用户收藏接口
app.post('/api/collect',(req,res)=>{
  let id=parseInt(req.body.id)
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sql='select collect from user where uid=?'
    db.query(sql,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      let list=results[0].collect.split(',')
      if(results[0].collect!==null){
        if(results[0].collect!==''){
          let flag= list.some(item=>{
            item=parseInt(item)
            if(item===id){
              return true
            }
            return false
          })
          if(flag){
            let sqlStr='update user set collect=? where uid=?'
            let temp=[]
            list.forEach(item=>{
              item=parseInt(item)
              if(item!==id){
                temp.push(item)
              }
            })
            temp=temp.join()
            db.query(sqlStr,[temp,data.uid],(err,results)=>{
              if(err) return res.cc(err)
              if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
              res.cc('操作成功',200)
            })
          }else{
            let sqlStr='update user set collect=? where uid=?'
            let temp=[...list]
            temp.push(id)
            temp=temp.join()
            db.query(sqlStr,[temp,data.uid],(err,results)=>{
              if(err) return res.cc(err)
              if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
              res.cc('操作成功',200)
            })
          }
        }else{
          let sqlStr='update user set collect=? where uid=?'
          let temp=''+id
          db.query(sqlStr,[temp,data.uid],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
            res.cc('操作成功',200)
          })
        }
        
      }else{
        let sqlStr='update user set collect=? where uid=?'
        let temp=''+id
        db.query(sqlStr,[temp,data.uid],(err,results)=>{
          if(err) return res.cc(err)
          if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
          res.cc('操作成功',200)
        })
      }
    })
  })
})
// 获取用户收藏
app.get('/api/getCollect',(req,res)=>{
  let id=parseInt(req.query.id)
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='select collect from user where uid=?'
    db.query(sqlStr,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results[0].collect!==null && results[0].collect!==''){
        let temp=results[0].collect.split(',')
        let flag= temp.some(item=>{
          item=parseInt(item)
          if(item===id){
            return true
          }
          return false
        })
        if(flag){
          return res.cc(true,200)
        }else{
          return res.cc(false,200)
        }
      }else{
        return res.cc(false,200)
      }
      res.cc('ok',0)
    })
  })
})

// 添加购物车模块
app.post('/api/PostCart',(req,res)=>{
  let dt=req.body
  let num=parseInt(dt.num)
  let mid=parseInt(dt.mid)
  let sid=parseInt(dt.sid)
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='insert into cart(specification,message,price,num,mid,sid,uid) values(?,?,?,?,?,?,?)'
    db.query(sqlStr,[dt.sp,dt.msg,dt.price,num,mid,sid,data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
      res.cc('添加成功',200)
    })
  })
})
// 查询购物车模块
app.get('/api/getCart',(req,res)=>{
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='select * from cart where uid=?'
    db.query(sqlStr,[data.uid],(err,results)=>{
      if(err) return res.cc(err)
      res.send({
        status:200,
        msg:'请求成功',
        data:results
      })
    })
  })
})
// 删除购物车中物品
app.get('/api/deleteCart',(req,res)=>{
  let id=parseInt(req.query.id)
  let token=req.headers.authorization
  token=token.split(' ')[1]
  jwt.verify(token,config.jwtSecretKey,(err,data)=>{
    if(err) return res.cc(err)
    let sqlStr='delete from cart where id=? and uid=?'
    db.query(sqlStr,[id,data.uid],(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows!==1) return res.cc('系统繁忙，请稍后再试')
      res.cc('操作成功',200)
    })
  })
}) 


// 定义全局错误中间件
app.use((err,req,res,next)=>{ 

  // 判断验证失败导致的错误
  if(err instanceof joi.ValidationError) return res.cc(err)
  res.cc(err)
})
app.listen(8080,()=>{
  console.log('Server running http://127.0.0.1:8080');
})