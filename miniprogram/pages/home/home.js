//home.js
const app = getApp()
const db = wx.cloud.database()
const Img2Base64 = require('../../constants/img2Base64.js');
var idinfolist = [
  { code: "用户", text: '0.00' },
  { code: "用户等级", text: '普通用户' },
  { code: "累计消费", text: '0.00' },
  { code: "距离下一等级", text: '30.00' },
  { code: "注册日期", text: '2020.03.26' },
  { code: "最后消费日期", text: '-' },
  { code: "最后登录日期", text: '2020.03.26' }
]

Page({
  data: {
    avatarUrl: Img2Base64.homeBg[0],
    metoo: '请点击上方头像授权登录.',
    nickName: '',
    welcome: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    listData: idinfolist,
    openid: ''
  },

  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框 
          wx.getUserInfo({
            success: res => {
              var string = 'listData[0]';
              this.setData({
                metoo: 'Hello!',
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                welcome: '欢迎使用e游趣玩公众平台!',
                [string]: { code: "用户", text: res.userInfo.nickName},
                hasUserInfo: true
              })
            }
          })
        }
      }
    })

    // 调用云函数,获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] 调用成功 openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    /******* 用户注册 *******/
    db.collection('users').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        var lastLoadDate = 'listData[6]';
        var registerDate = 'listData[4]';
        this.setData({
          [lastLoadDate]: { code: "最后登陆日期", text: res.data[0].lastLoadDate },
          [registerDate]: { code: "注册日期", text: res.data[0].registerDate },
        })
        var TIME = new Date();
        const year = TIME.getFullYear().toString();
        const month = (TIME.getMonth() + 1 < 10) ? '0' + (TIME.getMonth() + 1).toString() : (TIME.getMonth() + 1).toString();
        const day = (TIME.getDate() < 10) ? '0' + TIME.getDate().toString() : TIME.getDate().toString();
        const hour = (TIME.getHours() < 10) ? '0' + TIME.getHours().toString() : TIME.getHours().toString();
        const munite = (TIME.getMinutes() < 10) ? '0' + TIME.getMinutes().toString() : TIME.getMinutes().toString();
        const second = (TIME.getSeconds() < 10) ? '0' + TIME.getSeconds().toString() : TIME.getSeconds().toString();
        const formatDate = [year, month, day].join('.') + ' ' + [hour, munite, second].join(':');
        if(res.data.length!=0){
          console.log('该用户已注册,更新数据库记录.')
          db.collection('users').doc(res.data[0]._id).update({
            data: {
              lastLoadDate: formatDate.toString()
            },
            success: res => {
              console.log('[数据库] [更新记录] 成功.')
            },
            fail: err => {
              console.error('[数据库] [更新记录] 失败：', err)
            }
          })
        }
        else{
          console.log('新用户，新增数据库记录.')
          db.collection('users').add({
            data: {
              level: 0,
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
        hasUserInfo: true
      })
    }
  },

})