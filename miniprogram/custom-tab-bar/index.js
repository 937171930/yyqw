// custom-tab-bar/index.js
Component({
  data: {
    currentTab: 0,    // 默认首页为选中页面
    "backgroundColor": "#ffffff",
    "selectedColor": "#d43a3c",
    items: [
      {
        "selectedIconPath": "/images/首页选中.jpg",
        "iconPath": "/images/首页未选中.jpg",
        "pagePath": "pages/home/home",
        "text": "首页"
      },
      {
        "selectedIconPath": "/images/分类选中.jpg",
        "iconPath": "/images/分类未选中.jpg",
        "pagePath": "pages/shop/shop",
        "text": "分类"
      },
      {
        "selectedIconPath": "/images/购物车选中.jpg",
        "iconPath": "/images/购物车未选中.jpg",
        "pagePath": "pages/cart/cart",
        "text": "购物车"
      },
      {
        "selectedIconPath": "/images/我的选中.jpg",
        "iconPath": "/images/我的未选中.jpg",
        "pagePath": "pages/mine/mine",
        "text": "我的"
      }
    ]
  },

  methods: {
    swichNav: function (e) {
      let that = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
        let url = "../../" + e.currentTarget.dataset.url;  // 点击tabbar时，跳转对应的页面
        wx.switchTab({
          url: url,
        })
      }
    },
  }
})
