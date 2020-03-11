/* eslint-disable no-mixed-operators */
import {calAngle, getLineTextList} from 'calSector'

export const draw = (context, series, x, y, r, startAngle) => {
  const sector = calAngle(series, startAngle)
  // 描边
  context.lineWidth = 2
  context.strokeStyle = '#ffffff'
  // 文字
  let maxLineWidth = 100
  let font = 14
  if (sector.length > 6) {
    maxLineWidth -= (sector.length - 6) * 10
    font -= (sector.length - 6)
  }

  sector.forEach((item) => {
    /**
     * 绘制扇形
     */
    context.save()
    context.beginPath()
    context.fillStyle = item.color
    context.moveTo(x, y)
    context.arc(x, y, r, item.startAngle, item.startAngle + 2 * Math.PI * item.proportion)
    context.closePath()
    context.fill()
    context.stroke() // 描边
    context.restore()

    /**
     * 绘制文字
     */
    context.save()
    context.fillStyle = '#fff'
    context.font = `${font}px sans-serif`
    // 改变canvas原点的位置
    // TODO:*3是测试最合适的结果，按照公式应该是/2
    context.translate(
      x + Math.cos(item.startAngle + item.proportion * 3) * r,
      y + Math.sin(item.startAngle + item.proportion * 3) * r
    )
    // 文字旋转角度,这个旋转是相对于原点进行旋转的.
    context.rotate(item.startAngle + item.proportion * 3 + Math.PI / 2)
    getLineTextList(context, item.text, maxLineWidth).forEach((line, index) => {
      // 要绘制的文字,开始绘制的x坐标,开始绘制的y坐标
      context.fillText(line, -context.measureText(line).width / 2, ++index * 35)
    })
    context.restore()
  })

  /**
   * 绘制指针底盘
   */
  context.save()
  context.beginPath()
  context.moveTo(x, y)
  context.arc(x, y, 25, 0, 2 * Math.PI)
  context.fillStyle = '#fff'
  context.shadowOffsetX = 1
  context.shadowOffsetY = 1
  context.shadowOffsetColor = '#eee'
  context.fill()
  context.restore()

  /**
   * 绘制指针
   */
  context.save()
  context.beginPath()
  context.fillStyle = '#fff'
  context.moveTo(x - 10, x - 15)
  context.lineTo(x, x - 50)
  context.lineTo(x + 10, x - 15)
  context.closePath()
  context.fill()
  context.restore()

  /**
   * 绘制文字环
   */
  context.save()
  context.beginPath()
  context.moveTo(x, y)
  context.arc(x, y, 20, 0, 2 * Math.PI)
  context.fillStyle = '#eee'
  context.fill()
  context.restore()

  /**
   * 绘制start文字
   */
  context.save()
  context.beginPath()
  context.fillStyle = '#333'
  context.font = '12px sans-serif'
  // 文字居中
  context.translate(x, y - 5)
  context.fillText('Start', -context.measureText('Start').width / 2, 8)
  context.restore()

  context.draw()
}
