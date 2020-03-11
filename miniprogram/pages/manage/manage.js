import Model from '../../model/model'
import router from '../../utils/router.js'
import $ from '../../utils/tool'

const app = getApp()
const model = new Model()

Page({

  data: {
    list: [],
    isEmpty: null,
    addBtnScale: 1,
    showAdd: true,
    touchStart: null,
    showMove: '',
    deleteIndex: null
  },
  onPageScroll (e) { 
    const scale = 1 - e.scrollTop / 100
    if (scale <= 1 && scale > 0) {
      this.setData({
        addBtnScale: scale,
        showAdd: true
      })
    } else {
      this.setData({
        showAdd: false
      })
    }
  },
  toAdd() {
    router.push('add')
  },
  toEdit(e) {
    const {list} = this.data
    router.push('addUpdate', {}, res => {
      res.eventChannel.emit('updateDecide', {
        data: list[e.detail],
        isHot: false
      })
    })
  },
  toHome(e) {
    const {list} = this.data
    const {title, options, _id} = list[e.target.dataset.index]
    app.globalData.decide = {
      title,
      options,
      _id
    }
    router.reLaunch('home')
  },
  async delete(e) {
    const {list} = this.data
    const index = e.target.dataset.index
    list.splice(index, 1)
    this.setData({
      list,
      deleteIndex: null
    })
    await model.deleteDecide(list[index]._id)
  },
  touchStart(e) {
    this.setData({
      touchStart: e.touches[0].pageX,
    })
  },
  touchMove(e) {
    const {touchStart} = this.data
    const moveDistance = e.touches[0].pageX - touchStart
    this.setData({
      showMove: moveDistance < 0 ? 'left' : 'right',
      deleteIndex: e.target.dataset.index
    })
  },
  async getUserDecide() {
    $.loading()
    const {result:list} = await model.getUserDecide()
    this.setData({
      list,
      isEmpty: list.length === 0
    })
    $.hideLoading()
  },
  onLoad() {
    this.getUserDecide()
  },

  onReady: function () {

  },

  onShareAppMessage: function () {

  }
})