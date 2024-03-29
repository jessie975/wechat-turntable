import Model from '../../model/model'
import {formatDate} from '../../utils/util'

const model = new Model()

Page({
  data: {
    list: [],
    isEmpty: false,
    showLoading: true,
    tip: '加载中...'
  },

  async cleanHistory() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确认清除所有历史记录吗？',
    }).then((res) => {
      if (res.confirm) {
        this.setData({showLoading: true, tip: '清空中...'})
        const result = model.cleanHistory()
        return result
      } else if (res.cancel) {
        return false
      }
    }).then((res) => {
      if (res.result) {
        that.getData()
      }
    })
  },

  async getData() {
    const {data} = await model.getUserInfo()
    const list = data[0].history

    if (list.length !== 0) {
      list.forEach(item => {
        item.date = formatDate(item.date)
      })
    }
    this.setData({
      list,
      isEmpty: list.length === 0
    })
    this.setData({showLoading: false})
  },

  onLoad() {
    this.getData()
  },

  async onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.setData({showLoading: true, tip: '刷新中...'})
    this.getData()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    const {list} = this.data
    let index = -1
    let title = ''
    let path = ''
    if (e.from === 'button') {
      index = e.target.dataset.index
      const target = list[index]
      title = `我在${target.title}里选中了${target.result}`
      path = `/pages/home/home?id=${target._id}&checkIndex=${target.checkIndex}`
    }
    
    return {
      title,
      path,
      imageUrl: '../../images/shareImg.jpg',
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})