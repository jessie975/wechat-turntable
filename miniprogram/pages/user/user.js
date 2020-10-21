import router from '../../utils/router'

Page({
  data: {
    showLoading: true
  },
  navigateTo(e) {
    const type = e.target.dataset.type
    router.push(type)
  },
  onShow() {
    setTimeout(() => {
      this.setData({
        showLoading: false
      })
    }, 1000)
  }
})