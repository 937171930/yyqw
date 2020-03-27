const app = getApp()

Page({
  data:{
    items: ['代理专区', '好帮手', '小蜜', '莫愁如意', '天机', '答题器', '多开防封器', '打图工具', '白号'],
    currentData: 0,
    currentData1: 0,
  },

  onLoad: function () {

  },

  //获取当前滑块的index
  bindchange(event) {
    const that = this;
    that.setData({
      currentData: event.detail.current
    })
    let myComponent = this.selectComponent('#myComponent'); // 页面获取自定义组件实例
    myComponent.onItemTap1(); // 通过实例调用组件事件
  },

  //点击切换，滑块index赋值
  checkCurrent(event) {
    const that = this;
    console.log(event.detail.currentTarget.dataset.index)
    if (that.data.currentData === event.detail.currentTarget.dataset.index) {
      return false;
    } else {

      that.setData({
        currentData: event.detail.currentTarget.dataset.index
      })
    }
  },

  //获取底部滑块的index
  changeName1(event) {
    const that = this;
    that.setData({
      currentData1: event.detail.currentTarget.dataset.index
    })
  }

})