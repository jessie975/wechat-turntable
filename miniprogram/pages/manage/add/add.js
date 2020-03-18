
import $ from '../../../utils/tool'
import Model from '../../../model/model'
import router from '../../../utils/router'

Page({

  data: {
    isAverage: true,
    isCustom: false,
    title: '',
    options: [
      {order: 50,  text: '',  width: 300},
      {order: 50, text: '', width: 300},
    ],
    touchStart: null,
    isUpdate: false,
    _id: null,
    isHot: false,
    beforeOrder: 0,
    beforeWidth: 0,
    showProblem: true,
    showLoading: true
  },

  showProblem() {
    this.setData({
      showProblem: !this.data.showProblem
    })
  },

  changeModal(e) {
    const modal = e.target.dataset.type
    this.setData({
      isAverage: modal === 'average',
      isCustom: modal === 'custom'
    })
  },

  add() {
    const {options} = this.data
    if (options.length < 12) {
      const newItem = {
        order: 50,
        text: '',
        width: 300
      }
      options.push(newItem)
    } else {
      $.tip('最多只能添加12项哦')
    }
    this.setData({
      options
    })
  },

  delete(e) {
    const {options} = this.data
    const index = e.target.dataset.index
    if (options.length <= 2) {
      $.tip('至少需要两个选项哦')
      return
    }
    options.splice(index, 1)
    this.setData({
      options
    })
  },

  inputValue(e) {
    const {options} = this.data
    const index = e.target.dataset.index
    const value = e.detail.value
    options[index].text = value
    this.setData({
      options
    })
  },

  inputTitle(e) {
    const value = e.detail.value
    this.setData({
      title: value
    })
  },

  touchstart(e) {
    const {options} = this.data
    const index = e.currentTarget.dataset.index
    this.setData({
      touchStart: e.touches[0].pageX,
      beforeWidth: options[index].width,
      beforeOrder: options[index].order 
    })
  },

  touchmove(e) {
    const {touchStart, options, beforeWidth, beforeOrder} = this.data
    const targetIndex = e.currentTarget.dataset.index
    const pageX = e.touches[0].pageX
    const moveDistance = Math.floor(pageX - touchStart) * 2
    const target = options[targetIndex]
    let step = 0

    if (target.width < 0) {
      target.width = 0
      target.order = 0
    } else if (target.width > 600) {
      target.width = 600
      target.order = 100
    } else if (target.order < 100 && target.order > 0) {
      target.width = beforeWidth + moveDistance
      step = Math.floor(moveDistance / 6)
      target.order = beforeOrder + step
    } 

    this.setData({
      options
    })
  },

  touchend(e) {
    const {options} = this.data
    const index = e.currentTarget.dataset.index
    const target = options[index]
    if (target.order >= 100) {
      target.order = 99
    }
    if (target.order <= 0) {
      target.order = 1
    }
    this.setData({
      touchStart: e.changedTouches[0].pageX,
      options
    })
  },

  verify() {
    const {title, options} = this.data
    const reject = (message) => ({state: false, message})
    const resolve = (message) => ({state: true, message})
    if (title.length <= 0) {
      return reject('标题不能为空哦')
    }
    if (options.some(item => item.text === '')) {
      return reject('存在选项为空')
    }
    return resolve('校验成功')
  },

  async submit() {
    const {state, message}  = this.verify()
    if (!state) {
      $.tip(message)
    } else {
      const {options, title, isUpdate, _id, isCustom, isHot} = this.data
      const model = new Model()
      let tipMassage = ''
      if (isUpdate) {
        if (isHot) {
          await model.addDecide(title, options, isCustom)
        } else {
          await model.updateDecide(_id, title, options, isCustom)
        }
        tipMassage = '更新转盘成功，即将跳转...'
        $.tip('更新转盘成功，即将跳转...', 1000)
      } else {
        await model.addDecide(title, options, isCustom)
        tipMassage = '创建转盘成功，即将跳转...'
      }
      $.tip(tipMassage, 1000)
      router.reLaunch('home')
    }
  },

  onLoad(options) {
    const {update = false} = options
    if (update) {
      const that = this
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('updateDecide', function({data, isHot}) {
        const {options, isCustom, _id, title} = data
        that.setData({
          _id,
          title,
          options,
          isAverage: !isCustom,
          isCustom,
          isUpdate: true,
          isHot
        })
      })
    }
    this.setData({showLoading: false})
  },

  onReady() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})