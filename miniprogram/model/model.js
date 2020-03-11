import Base from './base'
import $ from '../utils/tool'

export default class extends Base {
  register() {
    return this.UserDb.add({
      data: {
        createTime: this.date,
        history: []
      }
    })
  }

  getUserInfo() {
    return this.UserDb.where({_openid: '{openid}'}).limit(1).get()
  }

  getUserDecide() {
    return $.callCloud({
      name: 'getUserDecide'
    })
  }

  addHistory(history) {
    history.date = this.date
    return this.UserDb.where({_openid: '{openid}'}).update({
      data: {
        history: this._.push(history)
      }
    })
  }

  cleanHistory() {
    return this.UserDb.where({_openid: '{openid}'}).update({
      data: {
        history: []
      }
    })
  }

  addDecide(title, options, isCustom) {
    return this.DecideDb.add({
      data: {
        title,
        isCustom,
        options,
        createTime: this.date,
        updateTime: this.date,
        times: 0
      }
    })
  }

  deleteDecide(_id) {
    return this.DecideDb.doc(_id).remove()
  }

  updateDecide(_id, title, options, isCustom) {
    return this.DecideDb.doc(_id).set({
      data: {
        title,
        isCustom,
        options,
        updateTime: this.date
      }
    })
  }

  updateTimes(_id) {
    return this.DecideDb.doc(_id).update({
      data: {
        times: this._.inc(1)
      }
    })
  }

  getHotDecides() {
    return this.DecideDb.where({
      times: this._.gte(1000)
    }).limit(10).orderBy('times', 'desc').get()
  }

  toHomeFromShare(_id) {
    return this.DecideDb.where({
      _id
    }).limit(1).get()
  }
}