export default class {
  constructor() {
    const database = wx.cloud.database()
    this.UserDb = database.collection('users')
    this.DecideDb = database.collection('decides')
    this._ = database.command
  }

  get date() {
    return wx.cloud.database({env: this.env}).serverDate()
  }
}