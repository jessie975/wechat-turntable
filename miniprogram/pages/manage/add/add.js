
import $ from '../../../utils/tool'
import Model from '../../../model/model'
import router from '../../../utils/router'

const app = getApp()

Page({

  data: {
    isAverage: true,
    isCustom: false,
    title: '',
    options: [
      {order: 50.0,  text: '',  width: 375 / 2},
      {order: 50.0, text: '', width: 375 / 2},
    ],
    touchStart: null,
    isUpdate: false,
    _id: null,
    isHot: false
  },

  changeModal(e) {
    const modal = e.target.dataset.type
    this.setData({
      isAverage: modal === 'average',
      isCustom: modal === 'custom'
    })
  },

  averageItem() {
    const {options} = this.data
    const itemOrder = $.saveTwoNum(100 / options.length)
    options.forEach(item => {
      item.width = 375 / options.length
      item.order = itemOrder
    })
    this.setData({
      options
    })
  },

  add() {
    const {options} = this.data
    if (options.length < 12) {
      const newItem = {
        order: $.saveTwoNum(100 / options.length + 1),
        text: '',
        width: 375 / (options.length + 1)
      }
      options.push(newItem)
      this.averageItem()
    } else {
      $.tip('最多只能添加12项哦')
    }
  },

  delete(e) {
    const {options} = this.data
    const index = e.target.dataset.index
    if (options.length <= 2) {
      $.tip('至少需要两个选项哦')
      return
    }
    options.splice(index, 1)
    this.averageItem()
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
    this.setData({
      touchStart: e.touches[0].pageX,
    })
  },

  touchmove(e) {
    const {touchStart, options} = this.data
    const targetIndex = e.target.dataset.index
    const pageX = e.touches[0].pageX
    const moveDistance = pageX - touchStart
    const target = options[targetIndex]
    const targetOriginOrder = target.order

    // 移动距离太短不做计算
    if (moveDistance < 10 && moveDistance > -10) return
    
    if (pageX > 375) {
      target.order = 100
      target.width = 375
    } else if (pageX < 15) {
      target.order = 1
      target.width = 15
    } else {
      target.width = touchStart + moveDistance
      target.order = Math.round(options[targetIndex].width / 3.75)
    }

    const modifyOrder = targetOriginOrder - target.order
    const averageModify = $.saveTwoNum(modifyOrder / (options.length - 1))

    if (modifyOrder !== 0) {
      options.forEach((item, index) => {
        if (index !== targetIndex) {
          // 目标向右移，其他项应该减少相应比例
          item.order = $.saveTwoNum(item.order + averageModify)
          item.width = 375 / (100 / item.order)  
        }
      })
    }

    this.setData({
      options
    })
  },

  touchend(e) {
    const {options} = this.data
    if(!options.every(item => item.order > 0)) {
      $.tip('存在选项为负数，生成转盘后该选项将不再显示', 3000)
    }
    this.setData({
      touchStart: e.changedTouches[0].pageX,
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
      app.globalData.decide = {
        title,
        options,
        _id
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