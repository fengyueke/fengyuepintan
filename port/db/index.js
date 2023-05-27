const mysql=require('mysql')
const db=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'admin123',
  database:'fengyuepintan'
})

module.exports=db