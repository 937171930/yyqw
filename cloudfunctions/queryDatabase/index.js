const cloud = require('wx-server-sdk')

cloud.init({
  env: 'yyqw-init',
})

const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection(event.databaseName).doc(event.id).update({
      data:{
        [event.key1]: event.value1,
        [event.key2]: event.value2
      }
    })
  } catch (e) {
    console.error(e)
  }

}