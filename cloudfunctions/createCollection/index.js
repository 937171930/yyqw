const cloud = require('wx-server-sdk')

cloud.init({
  env: 'yyqw-init',
})

const db = cloud.database()
exports.main = async (event, context) => {
  try{
    return await db.createCollection(event.name)
  }catch (e){
    console.error(e)
  }
  
}