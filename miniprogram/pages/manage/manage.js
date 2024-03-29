import Model from '../../model/model'
import router from '../../utils/router.js'
import $ from '../../utils/tool'

const app = getApp()
const model = new Model()

Page({

  data: {
    list: [],
    isEmpty: false,
    addBtnScale: 1,
    showAdd: false,
    touchStart: null,
    showMove: '',
    deleteIndex: null,
    showLoading: true,
    tip: '加载中...'
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
    if (!app.globalData.rotateStart) {
      app.globalData.decide = {
        title,
        options,
        _id
      }
      router.reLaunch('home')
    } else {
      $.tip('还有决定未结束，请稍后再切换哦~')
    }
  },
  async delete(e) {
    const {list} = this.data
    const that = this
    const index = e.target.dataset.index
    wx.showModal({
      title: '提示',
      content: `是否确认删除${list[index].title}`,
    }).then((res) => {
      if (res.confirm) {
        this.setData({showLoading: true, tip: '删除中...'})
        model.deleteDecide(list[index]._id)
        return true
      } else if (res.cancel) {
        return false
      }
    }).then((res) => {
      let isEmpty = false
      if (res) {
        list.splice(index, 1)
        that.setData({
          list,
          deleteIndex: null
        })
        if (list.length === 0) {
          isEmpty = true
        }
        this.setData({showLoading: false, isEmpty})
      }
    })
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
      showMove: moveDistance < -20 ? 'left' : 'right',
      deleteIndex: e.target.dataset.index
    })
  },
  async getUserDecide() {
    const {result:list} = await model.getUserDecide()
    this.setData({
      list,
      isEmpty: list.length === 0,
      showAdd: list.length !== 0
    })
    this.setData({showLoading: false})
  },
  onLoad() {
    this.getUserDecide()
  },

  async onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.setData({showLoading: true, tip: '刷新中...'})
    this.getUserDecide()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onShareAppMessage: function () {

  }
})