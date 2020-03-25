//home.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.jpg',
    metoo: '请点击上方头像获取授权信息.',
    nickName: '',
    welcome: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    if (app.globalData.hasUserInfo) {
      this.setData({
        metoo: 'Hello!',
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        welcome: '欢迎使用e游趣玩公众平台!',
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          metoo: 'Hello!',
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          welcome: '欢迎使用e游趣玩公众平台!',
          hasUserInfo: true
        })
      }
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      metoo: 'Hello!',
      avatarUrl: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName,
      welcome: '欢迎使用e游趣玩公众平台!',
      hasUserInfo: true
    })
  }
})