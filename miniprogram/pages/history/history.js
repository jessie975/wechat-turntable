import Model from '../../model/model'
import {formatDate} from '../../utils/util'

const model = new Model()

Page({
  data: {
    list: [],
    isEmpty: false
  },

  cleanHistory() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确认清除所有历史记录吗？',
      success (res) {
        if (res.confirm) {
          model.cleanHistory()
          that.getData()
          that.setData({isEmpty: true})
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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
  },

  onLoad() {
    this.getData()
  },

  onReady() {

  },

  onShow() {
    this.getData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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