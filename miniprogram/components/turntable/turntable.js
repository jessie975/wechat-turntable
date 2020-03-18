import {draw} from './utils/draw'
import {distanceToStop, rotate, getDistance} from './utils/rotate'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canvasId: { // 转盘ID
      type: String
    },
    sector: { // 扇区
      type: Array,
      observer: '__updateSector'
    },
    width: { // 转盘宽：单位px
      type: Number,
      value: 320
    },
    checkIndex: { // 作弊模式选中的扇区索引
      type: Number,
      value: 3,
      observer: '__checkIndex'
    },
    hasMusic: { // 音乐开关
      type: Boolean,
      observer: '_changeMusicValue'
    },
    hasVibrate: { // 振动开关
      type: Boolean,
      value: true,
      observer: '_changeVibrateValue'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    context: null,
    radius: 0, // 由于单位是px，所以需要通过比例去计算相适应的半径
    canClick: true,
    touchStart: false,
    startX: null,
    startY: null,
    time: null,
    remeberDistance: 0
  },

  // 组件生命周期函数，在组件实例进入页面节点树时执行
  attached() {
    this.init()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 转盘初始化
     */
    async init() {
      const {sector, width, canvasId} = this.data
      const clientWidth = this.getRatioRadius()
      const radius = width / 2 * clientWidth // 圆心x,y,半径相等
      const context = wx.createCanvasContext(canvasId, this)
      // const context = canvas.getContext()
      await draw(context, sector, radius, radius, radius, 0) // 初始角度0
      this.setData({
        context,
        radius
      })
    },
    /**
     * 获取设备宽，计算相应宽
     */
    getRatioRadius() {
      let w = 0
      wx.getSystemInfo({
        success(res) {
          w = res.windowWidth / 375// 按照750的屏宽
        },
      })
      return w
    },
    /**
     * 旋转结束音效 
     */
    playMusic() {
      const stopMusic = wx.createInnerAudioContext()
      stopMusic.autoplay = true
      stopMusic.src = 'audio/end.wav'
      stopMusic.onPlay(() => {})
    },
    /**
     * 旋转结束
     */
    rotateEnd(startAngle) {
      const {hasMusic, checkedIndex} = this.data
      this.setData({
        canClick: true,
        remeberDistance: startAngle
      })
      hasMusic && this.playMusic()
      // 将结果传递给父组件
      this.triggerEvent("getResult", checkedIndex )
    },
    /**
     * 自动旋转
     */
    rotateAuto() {
      const {
        canClick, sector, context, radius, hasVibrate, checkIndex
      } = this.data
      if (canClick) { // 转盘旋转结束，可再次旋转
        this.triggerEvent("rotateStart", true)
        this.setData({canClick: false})
        const {distance, checkedIndex} = distanceToStop(sector, checkIndex)
        this.setData({checkedIndex})
        // hasVibrate && this.playVibrate()
        rotate(context, sector, radius, radius, radius, distance, 0, this.rotateEnd.bind(this), hasVibrate)
      }
    },
    touchStart(e) {
      const touch = e.changedTouches[0]
      this.setData({
        touchStart: true,
        startX: touch.x,
        startY: touch.y
      })
    },
    touchMove(e) {
      const {
        startX, startY, radius, context, sector, touchStart, remeberDistance, canClick
      } = this.data
      // 记录开始移动的时间，如果结束时间 - 开始时间 < 0，那么速率很快，后期执行相应的旋转函数
      if (touchStart && canClick) {
        this.setData({
          time: new Date().getSeconds(),
          touchStart: false
        })
      }
      // 慢速率手动旋转转盘
      if (canClick) {
        const touch = e.changedTouches[0]
        const distance = getDistance(touch.x, touch.y, radius, startX, startY)
        console.log('touchMove -> distance', distance)
        const result = distance + remeberDistance
        draw(context, sector, radius, radius, radius, result)
      }
      
    },
    touchEnd(e) {
      const {
        radius, time, startX, startY
      } = this.data
      let {remeberDistance} = this.data
  
      const touch = e.changedTouches[0]
      const btnLeft = radius - 25 // 指针区域：半径 - + 底盘半径25
      const btnRight = radius + 25
  
      // 指针区域
      if (touch.x > btnLeft && touch.x < btnRight && touch.y > btnLeft && touch.y < btnRight) {
        this.rotateAuto()
      } else { // 转盘区域
        const endTime = new Date().getSeconds()
        if (endTime - time === 0) { // 快速率手动旋转
          this.rotateAuto()
        } else {
          remeberDistance += getDistance(touch.x, touch.y, radius, startX, startY)
        }
      }
  
      this.setData({
        touchStart: true,
        remeberDistance
      })
    },

    /**
     * 父子通信
     */
    _changeMusicValue(newVal) {
      this.setData({
        hasMusic: newVal
      })
    },
    _changeVibrateValue(newVal) {
      this.setData({
        hasVibrate: newVal
      })
    },
    _checkIndex(newVal) {
      this.setData({
        checkIndex: newVal
      })
    },
    __updateSector(newVal) {
      this.setData({
        sector: newVal
      })
      this.init()
    }
  }
})
