/**
 * 处理数据
 * @param {Array} sector 扇区
 * @param {Number} starAngle：开始的角度
 */
export const calAngle = (sector, startAngle) => {
  // 计算数据总和
  let count = 0
  sector.forEach((item) => {
    count += item.order
  })

  // 计算出开始的弧度和所占比例
  return sector.map((item) => {
    item.proportion = item.order / count
    item.startAngle = startAngle
    startAngle += 2 * Math.PI * item.proportion
    return item
  })
}

/**
 * 处理文本换行:将满足定义的宽度的文本作为value单独添加到数组中,最后返回的数组的每一项就是我们处理后的每一行了
 * @param {Object} context         画布上下文
 * @param {String} text            需要处理的长文本
 * @param {Number} maxLineWidth    自己定义的一行文本最大的宽度
 */
export const getLineTextList = (context, text, maxLineWidth) => {
  const wordList = text.split('')
  let tempLine = ''
  const lineList = []
  for (let i = 0; i < wordList.length; i++) {
    // measureText: 测量文本尺寸信息。目前仅返回文本宽度
    // fontSize的大小,所以基于这个,我们将maxLineWidth设置为当前字体大小的倍数
    if (context.measureText(tempLine).width >= maxLineWidth) {
      lineList.push(tempLine)
      maxLineWidth -= context.measureText(text[0]).width
      tempLine = ''
    }
    tempLine += wordList[i]
  }
  lineList.push(tempLine)
  return lineList
}
