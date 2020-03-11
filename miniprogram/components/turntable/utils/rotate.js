import {draw} from './draw'

/**
 * 自定义canvas.requestAnimationFrame方法
 * @param {*} callback
 */

let lastFrameTime = 0
const doAnimationFrame = (callback) => {
  const currTime = new Date().getTime()
  const timeToCall = Math.max(0, 16 - (currTime - lastFrameTime))
  const id = setTimeout(function () { callback(currTime + timeToCall) }, timeToCall)
  lastFrameTime = currTime + timeToCall
  return id
}

/**
 * 确定随机停下的点与起点的距离
 * @param {*} series 扇形块
 * @param {*} checkIndex 指定结果index
 */

export const distanceToStop = (series, checkIndex = -1) => {
  let middleDegrees = 0 // 选中区的中间角度
  let distance = 0
  // 映射出每个扇形区的middleDegrees
  const seriesToDegreesList = series.map((data, index) => {
    const itemRadian = (Math.PI * 2) / series.length
    return itemRadian * index + (itemRadian * (index + 1) - itemRadian * index) / 2
  })
  // 随机生成选中块索引
  let currentPieIndex = checkIndex === -1 ? Math.floor(Math.random() * series.length) : checkIndex
  middleDegrees = seriesToDegreesList[currentPieIndex]
  // 因为指针是垂直向上的，相当坐标系的Math.PI/2,所以我们这里要进行判断来移动角度
  distance = Math.PI * 3 / 2 - middleDegrees
  distance = distance > 0 ? distance : Math.PI * 2 + distance
  // 额外加上后面的值，是为了让转盘多转动几圈，体验更好
  return {
    distance: distance + Math.PI * 20,
    checkedIndex: currentPieIndex
  }
}

/**
 * 自动旋转动画
 * @param {*} context canvas上下文
 * @param {*} series  转盘块
 * @param {*} x 原点x
 * @param {*} y 原点y
 * @param {*} r 转盘半径
 * @param {*} distance 选中项跑到指针位置要转动的距离
 * @param {*} startAngle 开始的角度
 */
export const rotate = (context, series, x, y, r, distance, startAngle = 0) => {
  const changeRadian = (distance - startAngle) / 40
  startAngle += changeRadian

  if (distance - startAngle <= 0.05) return {state: true}
  draw(context, series, x, y, r, startAngle)
  // 循环调用rotate方法，使转盘连续绘制， 形成旋转视觉
  doAnimationFrame(rotate.bind(this, context, series, x, y, r, distance, startAngle))
}

/**
 * 手动旋转
 * @param {*} param0 开始点与中心点的距离
 * @param {*} param1 结束点与中心点的距离
 */

const getAngle = ({x: x1, y: y1}, {x: x2, y: y2}) => {
  const dot = x1 * x2 + y1 * y2
  const det = x1 * y2 - y1 * x2
  const angle = Math.atan2(det, dot) / Math.PI * 180
  return (angle + 360) % 360
}

/**
 * 手动旋转时移动的距离
 * @param {*} moveX 移动点X
 * @param {*} moveY 移动点Y
 * @param {*} w 中心点X，Y和半径R
 * @param {*} startX 鼠标落下的点X
 * @param {*} startY 鼠标落下的点Y
 */

export const getDistance = (moveX, moveY, w, startX, startY) => {
  const angle = getAngle({
    x: startX - w,
    y: startY - w,
  }, {
    x: moveX - w,
    y: moveY - w,
  })
  return angle * Math.PI / 180
}
