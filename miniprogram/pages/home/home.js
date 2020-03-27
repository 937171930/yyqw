//home.js
const app = getApp()
const db = wx.cloud.database()
const Img2Base64 = require('../../constants/img2Base64.js');
var idinfolist = [
  { code: "用户", text: '' },
  { code: "用户等级", text: 'Lv.0' },
  { code: "累计消费", text: '0' },
  { code: "距离下一等级", text: '30' },
  { code: "注册日期", text: '' },
  { code: "最后消费日期", text: '-' },
  { code: "最后登录日期", text: '' }
]

Page({
  data: {
    avatarUrl: Img2Base64.homeBg[0],
    backgroundImageUrl: Img2Base64.homeBg[1],
    metoo: '请点击上方头像授权登录.',
    nickName: '',
    welcome: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    listData: idinfolist,
    openid: '',
    enter: ''
  },

  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          wx.getUserInfo({
            success: res => {
              this.setData({
                metoo: 'Hello!',
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                welcome: '欢迎使用e游趣玩公众平台!',
                ['listData[0]']: { code: "用户", text: res.userInfo.nickName},
                hasUserInfo: true,
                enter: '进入商城'
              })
            }
          })
        }
      }
    })

    /******* 用户数据库处理 *******/
    if (app.globalData.openid != ''){
      db.collection('users').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res)

          /*******获取当前时间，并作格式化处理********/
          var TIME = new Date();
          const year = TIME.getFullYear().toString();
          const month = (TIME.getMonth() + 1 < 10) ? '0' + (TIME.getMonth() + 1).toString() : (TIME.getMonth() + 1).toString();
          const day = (TIME.getDate() < 10) ? '0' + TIME.getDate().toString() : TIME.getDate().toString();
          const hour = (TIME.getHours() < 10) ? '0' + TIME.getHours().toString() : TIME.getHours().toString();
          const munite = (TIME.getMinutes() < 10) ? '0' + TIME.getMinutes().toString() : TIME.getMinutes().toString();
          const second = (TIME.getSeconds() < 10) ? '0' + TIME.getSeconds().toString() : TIME.getSeconds().toString();
          const formatDate = [year, month, day].join('.') + ' ' + [hour, munite, second].join(':');

          /*******判断数据库查询结果，判定是否为新用户注册*******/
          if (res.data.length != 0) {     //不是新用户
            console.log('该用户已注册,更新数据库记录.')
            this.setData({
              ["listData[1]"]: { code: "用户等级", text: res.data[0].level },
              ["listData[2]"]: { code: "累计消费", text: res.data[0].totalPay },
              ["listData[3]"]: { code: "距离下一等级", text: res.data[0].nextLevel },
              ["listData[4]"]: { code: "注册日期", text: res.data[0].registerDate },
              ["listData[5]"]: { code: "最后消费日期", text: res.data[0].lastPayDate },
              ["listData[6]"]: { code: "最后登陆日期", text: res.data[0].lastLoadDate },  
            })

            // 调用云函数,更新数据库字段
            wx.cloud.callFunction({
              name: 'queryDatabase',
              data: {
                databaseName: "users",
                id: res.data[0]._id,
                key1: "lastLoadDate",
                value1: formatDate.toString(),
                key2: "nickName",
                value2: this.data.nickName
              },
              success: res => {
                console.log('[云函数] [queryDatabase] 调用成功')
              },
              fail: err => {
                console.error('[云函数] [queryDatabase] 调用失败')
              }
            })
          }
          else {   //新用户
            console.log('新用户，新增数据库记录.')
            this.setData({
              ['listData[4]']: { code: "注册日期", text: formatDate.toString() },
              ['listData[6]']: { code: "最后登陆日期", text: formatDate.toString() },       
            })

            db.collection('users').add({  //在数据库中新增记录
              data: {
                nickName: this.data.nickName,
                level: '普通用户',
                totalPay: 0.00,
                nextLevel: 30.00,
                registerDate: formatDate.toString(),
                lastPayDate: '-',
                lastLoadDate: formatDate.toString()
              },
              success: res => {
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          }
        },
        fail: err => {
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    }
    else{
      app.openidCallback = openid => {  //回调方法，保证方法内语句在onlaunch之后执行
        if (openid != ''){
          db.collection('users').where({
            _openid: openid
          }).get({
            success: res => {
              console.log('[数据库] [查询记录] 成功: ', res)

              /*******获取当前时间，并作格式化处理********/
              var TIME = new Date();
              const year = TIME.getFullYear().toString();
              const month = (TIME.getMonth() + 1 < 10) ? '0' + (TIME.getMonth() + 1).toString() : (TIME.getMonth() + 1).toString();
              const day = (TIME.getDate() < 10) ? '0' + TIME.getDate().toString() : TIME.getDate().toString();
              const hour = (TIME.getHours() < 10) ? '0' + TIME.getHours().toString() : TIME.getHours().toString();
              const munite = (TIME.getMinutes() < 10) ? '0' + TIME.getMinutes().toString() : TIME.getMinutes().toString();
              const second = (TIME.getSeconds() < 10) ? '0' + TIME.getSeconds().toString() : TIME.getSeconds().toString();
              const formatDate = [year, month, day].join('.') + ' ' + [hour, munite, second].join(':');

              /*******判断数据库查询结果，判定是否为新用户注册*******/
              console.log('该用户已注册,更新数据库记录.')
              if (res.data.length != 0) {     //不是新用户
                this.setData({
                  ["listData[1]"]: { code: "用户等级", text: res.data[0].level },
                  ["listData[2]"]: { code: "累计消费", text: res.data[0].totalPay },
                  ["listData[3]"]: { code: "距离下一等级", text: res.data[0].nextLevel },
                  ["listData[4]"]: { code: "注册日期", text: res.data[0].registerDate },
                  ["listData[5]"]: { code: "最后消费日期", text: res.data[0].lastPayDate },
                  ["listData[6]"]: { code: "最后登陆日期", text: res.data[0].lastLoadDate },  
                })

                // 调用云函数,更新数据库字段
                wx.cloud.callFunction({
                  name: 'queryDatabase',
                  data: {
                    databaseName: "users",
                    id: res.data[0]._id,
                    key1: "lastLoadDate",
                    value1: formatDate.toString(),
                    key2: "nickName",
                    value2: this.data.nickName
                  },
                  success: res => {
                    console.log('[云函数] [queryDatabase] 调用成功')
                  },
                  fail: err => {
                    console.error('[云函数] [queryDatabase] 调用失败')
                  }
                })
              }
              else {   //新用户
                console.log('新用户，新增数据库记录.')
                this.setData({
                  ['listData[4]']: { code: "注册日期", text: formatDate.toString() },
                  ['listData[6]']: { code: "最后登陆日期", text: formatDate.toString() },   
                })

                db.collection('users').add({  //在数据库中新增记录
                  data: {
                    nickName: this.data.nickName,
                    level: 'Lv.0',
                    totalPay: 0.00,
                    nextLevel: 30.00,
                    registerDate: formatDate.toString(),
                    lastPayDate: '-',
                    lastLoadDate: formatDate.toString()
                  },
                  success: res => {
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                  },
                  fail: err => {
                    console.error('[数据库] [新增记录] 失败：', err)
                  }
                })
              }
            },
            fail: err => {
              console.error('[数据库] [查询记录] 失败：', err)
            }
          })
        }
      }
    }
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      var string ='listData[0]';
      this.setData({
        metoo: 'Hello!',
        avatarUrl: e.detail.userInfo.avatarUrl,
        nickName: e.detail.userInfo.nickName,
        welcome: '欢迎使用e游趣玩公众平台!',
        [string]: { code: "用户", text: e.detail.userInfo.nickName },
        hasUserInfo: true,
        enter: '进入商城'
      })
    }
  },

})