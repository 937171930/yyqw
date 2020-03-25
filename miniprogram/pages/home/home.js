//home.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    nickName: '请点击左侧头像获取授权信息.',
    logged: false,
  },

  onLoad: function (options) {
    var that = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: '"' + res.userInfo.nickName + '"' + '欢迎使用e游平台!',
        })
      }
    })
  },
})