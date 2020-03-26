//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环
        env: 'yyqw-init',
        traceUser: true,
      })
    }

    this.globalData = {
      openid: ''
    };

    // 调用云函数,获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] 调用成功 openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        if(this.openidCallback){
          this.openidCallback(res.result.openid);
        }
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})
