
import $ from '../../../utils/tool'
import Model from '../../../model/model'
import router from '../../../utils/router'

Page({

  data: {
    isAverage: true,
    isCustom: false,
    title: '',
    options: [
      {order: 50.0,  text: '',  width: 320 / 2},
      {order: 50.0, text: '', width: 320 / 2},
    ],
    touchStart: null,
    isUpdate: false,
    _id: null,
    isHot: false,
    beforeStep: null,
    beforeMoveOrder: 0
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
        width: 320 / 2
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
    const index = e.target.dataset.index
    this.setData({
      touchStart: e.touches[0].pageX,
      beforeMoveOrder: options[index].order
    })
  },

  touchmove(e) {
    const {touchStart, options, beforeStep, beforeMoveOrder} = this.data
    const targetIndex = e.target.dataset.index
    const pageX = e.touches[0].pageX
    const moveDistance = pageX - touchStart
    const target = options[targetIndex]
    let step = 0

    // 移动距离太短不做计算
    if (moveDistance < 10 && moveDistance > -10) return
    
    if (target.order >= 100 && moveDistance > 0) { // 移到最右
      target.order = 100
      target.width = 320
    } else if (target.order <= 5 && moveDistance < 0) { // 移到最左
      target.order = 5
      target.width = 15
    } else {
      step = Math.round(moveDistance / 3.2)
      if (step % 5 === 0 && beforeStep !== step) {
        this.setData({beforeStep: step})
        target.order = beforeMoveOrder + step
      }
      target.width = touchStart + moveDistance
    }

    this.setData({
      options
    })
  },

  touchend(e) {
    const {options} = this.data
    const index = e.target.dataset.index
    if(!options.every(item => item.order >= 0)) {
      $.tip('存在选项概率为0，转盘将不再显示此项', 3000)
    }
    this.setData({
      touchStart: e.changedTouches[0].pageX,
      beforeMoveOrder: options[index].order
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
      $.loading()
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
        $.hideLoading()
      })
    }
  },

  onReady() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})