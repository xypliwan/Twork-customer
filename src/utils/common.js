export default {
  checkTime(time) {
    if (time) {
      var now = new Date(time)
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      var date = now.getDate()
      return (
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date)
      )
    }
  },
  timestampToTime(time) {
    if (time) {
      let now = new Date(time * 1000)
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let date = now.getDate()
      let h = now.getHours()
      let m = now.getMinutes()
      let s = now.getSeconds()
      return (
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date) +
        '    ' +
        (h < 10 ? '0' + h : h) +
        ':' +
        (m < 10 ? '0' + m : m) +
        ':' +
        (s < 10 ? '0' + s : s)
      )
    }
  }
}
