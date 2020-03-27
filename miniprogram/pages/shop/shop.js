const app = getApp()

Page({
  data:{
    items: ['代理专区', '好帮手', '小蜜', '莫愁如意', '天机', '答题器', '多开防封器', '打图工具', '白号'],
    currentDataTop: 0,
    currentDataBottom: 0,
  },

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
})