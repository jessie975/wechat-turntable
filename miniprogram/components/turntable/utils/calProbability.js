export const probability = (sector) => {
  const randomList = []
  const averageNum = Math.floor(100 / 12)
  sector.forEach((item, index) => {
    const itemNumber = Math.floor(item.proportion * 100 / averageNum)
    const itemArr = Array.from({length: itemNumber}).fill(index)
    randomList.push(...itemArr)
  })
  const index = Math.floor((Math.random()*randomList.length))
  return randomList[index]
}