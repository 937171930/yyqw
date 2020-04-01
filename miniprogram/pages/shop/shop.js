const app = getApp()
const md5 = require('../../constants/md5.js');

Page({
  data:{
    items: ['代理专区', '好帮手', '小蜜', '莫愁如意', '天机', '答题器', '多开防封器', '打图工具', '白号'],
    currentDataTop: 0,
    currentDataBottom: 0,
    ip: '',
    payObj: {
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success(res) { },
      fail(res) { }
    },
    
  },
//HF8734HGF012GBF0V7B1AHGV87BWVNIU
  onLoad: function () {
  },

  //获取当前滑块的index
  bindchangeTop(event) {
    const that = this;
    that.setData({
      currentDataTop: event.detail.current
    })
    let myComponent = this.selectComponent('#myComponent'); // 页面获取自定义组件实例
    myComponent.onItemTap1(); // 通过实例调用组件事件
  },

  //点击切换，滑块index赋值
  checkCurrentTop(event) {
    const that = this;
    if (that.data.currentDataTop === event.detail.currentTarget.dataset.index) {
      return false;
    } else {

      that.setData({
        currentDataTop: event.detail.currentTarget.dataset.index
      })
    }
  },

  //获取当前滑块的index
  bindchangeBottom(event) {
    const that = this;
    that.setData({
      currentDataBottom: event.detail.current
    })
  },

  //点击切换，滑块index赋值
  checkCurrentBottom(event) {
    const that = this;
    if (that.data.currentDataBottom === event.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentDataBottom: event.target.dataset.current
      })
    }
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        currentTab: 1
      })
    }
  },

  TLXM: function () {
    var nonceStr = Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8); //生成32位随机字符串  
    
    //将除签名之外的所有Object信息存放到Map中
    var prepayObj = new Map();
    var timeStamp = Date.parse(new Date()).toString();
    prepayObj.set('appid', 'wxdb6e78bc05e16d95');
    prepayObj.set('mch_id', '1582121661');
    prepayObj.set('device_info', '13126672377');
    prepayObj.set('nonce_str', nonceStr);
    prepayObj.set('attach', 'Pay Test');
    prepayObj.set('body', 'JSAPI');
    prepayObj.set('openid', app.globalData.openid);
    prepayObj.set('notify_url', 'https://www.baidu.com');
    prepayObj.set('out_trade_no', timeStamp);
    prepayObj.set('total_fee', 2800);
    prepayObj.set('trade_type', 'JSAPI');

    //对Map进行排序，计算MD5签名
    var arrayObj = Array.from(prepayObj);
    arrayObj.sort(function (a, b) { return a[0].localeCompare(b[0]) });
    var sortedPrepayObj = new Map(arrayObj.map(i => [i[0], i[1]]));
    var stringA = new String();
    sortedPrepayObj.forEach(function (value, key) {
　　　stringA += key + '=' + value + '&';
　　});
    var stringSignTemp = stringA + "key=HF8734HGF012GBF0V7B1AHGV87BWVNIU"
    let sign = md5.hexMD5(stringSignTemp).toUpperCase();
    console.log(stringA);
    console.log(sign);

    var xmlPrepayObj = new String();
    xmlPrepayObj += '<xml>\n';
    sortedPrepayObj.forEach(function (value, key) {
　　　xmlPrepayObj += ' <' + key + '>' + value + '</' + key + '>\n';
　　});
    xmlPrepayObj += ' <sign>' + sign + '</sign>\n';
    xmlPrepayObj += '</xml>';
    console.log(xmlPrepayObj);

    wx.request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //别忘了把api.mch.weixin.qq.com域名加入小程序request白名单，这个目前可以加
      method: 'POST',
      head: 'application/x-www-form-urlencoded',
      data: xmlPrepayObj, //设置请求的 header
      success: function (res) {
        console.log("返回商户", res.data);
        var Parser = require('../../lib/dom-parser');
        var XMLParser = new Parser.DOMParser();
        var doc = XMLParser.parseFromString(res.data);
        var resultCode = doc.getElementsByTagName('return_code')[0].firstChild.nodeValue;
        if (resultCode == 'FAIL') {
          var errDes = doc.getElementsByTagName('err_code_des')[0].firstChild.nodeValue;
          console.log(errDes);
          wx.showToast({
            title: errDes,
            icon: 'none',
            duration: 3000
          })
        } 
        else {
          //发起支付
          var prepay_id = doc.getElementsByTagName('prepay_id')[0].firstChild.nodeValue;
          //签名  
          var key = 'HF8734HGF012GBF0V7B1AHGV87BWVNIU'; //商户key必填，在商户后台获得
          var appId = 'wxdb6e78bc05e16d95';             //appid必填
          var timeStamp = (Date.parse(new Date())/1000).toString();
          var nonceStr = Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8); //生成32位随机字符串 
          var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
          console.log("签名字符串", stringSignTemp);
          var sign = md5.hexMD5(stringSignTemp).toUpperCase();
          console.log("签名", sign);
          var param = { "timeStamp": timeStamp, "package": 'prepay_id=' + prepay_id, "paySign": sign, "signType": "MD5", "nonceStr": nonceStr }
          console.log("param小程序支付接口参数", param);
          wx.requestPayment(
            {
              "timeStamp": timeStamp, 
              "package": 'prepay_id=' + prepay_id, 
              "paySign": sign, 
              "signType": "MD5", 
              "nonceStr": nonceStr,
              'success': function (res) {
                  console.log(res);
              },
              'fail': function (res) {
                  console.log(res);
              },
              'complete': function (res) {
                  console.log(res);
              }
          })
        }
      },
    })
  },

  TLXMDT: function () {
    var nonceStr = Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8); //生成32位随机字符串  

    //将除签名之外的所有Object信息存放到Map中
    var prepayObj = new Map();
    var timeStamp = Date.parse(new Date()).toString();
    prepayObj.set('appid', 'wxdb6e78bc05e16d95');
    prepayObj.set('mch_id', '1582121661');
    prepayObj.set('device_info', '13126672377');
    prepayObj.set('nonce_str', nonceStr);
    prepayObj.set('attach', 'Pay Test');
    prepayObj.set('body', 'JSAPI');
    prepayObj.set('openid', app.globalData.openid);
    prepayObj.set('notify_url', 'https://www.baidu.com');
    prepayObj.set('out_trade_no', timeStamp);
    prepayObj.set('total_fee', 300);
    prepayObj.set('trade_type', 'JSAPI');

    //对Map进行排序，计算MD5签名
    var arrayObj = Array.from(prepayObj);
    arrayObj.sort(function (a, b) { return a[0].localeCompare(b[0]) });
    var sortedPrepayObj = new Map(arrayObj.map(i => [i[0], i[1]]));
    var stringA = new String();
    sortedPrepayObj.forEach(function (value, key) {
      　　　stringA += key + '=' + value + '&';
    　　});
    var stringSignTemp = stringA + "key=HF8734HGF012GBF0V7B1AHGV87BWVNIU"
    let sign = md5.hexMD5(stringSignTemp).toUpperCase();
    console.log(stringA);
    console.log(sign);

    var xmlPrepayObj = new String();
    xmlPrepayObj += '<xml>\n';
    sortedPrepayObj.forEach(function (value, key) {
      　　　xmlPrepayObj += ' <' + key + '>' + value + '</' + key + '>\n';
    　　});
    xmlPrepayObj += ' <sign>' + sign + '</sign>\n';
    xmlPrepayObj += '</xml>';
    console.log(xmlPrepayObj);

    wx.request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //别忘了把api.mch.weixin.qq.com域名加入小程序request白名单，这个目前可以加
      method: 'POST',
      head: 'application/x-www-form-urlencoded',
      data: xmlPrepayObj, //设置请求的 header
      success: function (res) {
        console.log("返回商户", res.data);
        var Parser = require('../../lib/dom-parser');
        var XMLParser = new Parser.DOMParser();
        var doc = XMLParser.parseFromString(res.data);
        var resultCode = doc.getElementsByTagName('return_code')[0].firstChild.nodeValue;
        if (resultCode == 'FAIL') {
          var errDes = doc.getElementsByTagName('err_code_des')[0].firstChild.nodeValue;
          console.log(errDes);
          wx.showToast({
            title: errDes,
            icon: 'none',
            duration: 3000
          })
        }
        else {
          //发起支付
          var prepay_id = doc.getElementsByTagName('prepay_id')[0].firstChild.nodeValue;
          //签名  
          var key = 'HF8734HGF012GBF0V7B1AHGV87BWVNIU'; //商户key必填，在商户后台获得
          var appId = 'wxdb6e78bc05e16d95';             //appid必填
          var timeStamp = (Date.parse(new Date()) / 1000).toString();
          var nonceStr = Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(2, 8); //生成32位随机字符串 
          var stringSignTemp = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key=" + key;
          console.log("签名字符串", stringSignTemp);
          var sign = md5.hexMD5(stringSignTemp).toUpperCase();
          console.log("签名", sign);
          var param = { "timeStamp": timeStamp, "package": 'prepay_id=' + prepay_id, "paySign": sign, "signType": "MD5", "nonceStr": nonceStr }
          console.log("param小程序支付接口参数", param);
          wx.requestPayment(
            {
              "timeStamp": timeStamp,
              "package": 'prepay_id=' + prepay_id,
              "paySign": sign,
              "signType": "MD5",
              "nonceStr": nonceStr,
              'success': function (res) {
                console.log(res);
              },
              'fail': function (res) {
                console.log(res);
              },
              'complete': function (res) {
                console.log(res);
              }
            })
        }
      },
    })
  },
})