//home.js
const app = getApp()
const Img2Base64 = require('../../constants/img2Base64.js');
var idinfolist = [
  { code: "用户", text: '123' },
  { code: "用户等级", text: '0' },
  { code: "累计消费", text: '0' },
  { code: "距离下一等级", text: '0' },
  { code: "注册日期", text: '0' },
  { code: "最后消费日期", text: '0' },
  { code: "最后登录日期", text: '0' }
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
    inputValue: '', //用于显示输入语句
    searchinput: '' //用户输入的查询语句
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
  }
})