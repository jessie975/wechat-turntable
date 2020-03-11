// components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    index: {
      type: Number
    },
    sector: {
      type: [Array, String]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  // 组件生命周期函数，在组件实例进入页面节点树时执行
  attached() {
    // this.dealData(this.data.sector)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dealData(arr) {
      const content = []
      arr.forEach(item => {
        content.push(item.text)
      })
      this.setData({
        sector: content.join('/')
      })
    },
    editDecide(e) {
      this.triggerEvent('getEditIndex', e.currentTarget.dataset.index)
    }
  }
})
