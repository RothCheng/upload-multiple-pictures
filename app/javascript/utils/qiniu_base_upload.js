/**
 * 文件上传七牛
 *   : 只处理文件上传到七牛中，文件类型、限制等在使用时处理
 *   参数：Object
 *      file: file
 *      tokenUrl: tokenUrl
 *      --- 回调方法 ----
 *      beforeSend: function(file, fileKey) {} // 开始执行时运行，返回读取的文件与文件名
 *      progress: function(number) {}
 *      success: function(res) {}
 *      failed: function(res) {} // 请求token时的错误、上传文件的错误同时使用此方法
 *      complete: function() {}
 *   实例方法：
 *     destroy 取消调用回调方法并销毁实例
 */
class QiNiuBaseUpload {
  constructor(options) {
    this.file = options.file
    this.tokenUrl = options.tokenUrl
    this.progress = options.progress || function() {}
    this.success = options.success || function() {}
    this.failed = options.failed || function() {}
    this.complete = options.complete || function() {}
    this.beforeSend = options.beforeSend || function() {}

    this.destroyed = false
    this.uploadStart(options.file)
  }

  uploadStart(file) {
    this.beforeSend(file, file.name)
    this.getUploadToken(file)
  }

  destroy() {
    this.destroyed = true
    delete this
  }

  getUploadToken(file) {
    const self = this
    $.ajax({
      url: this.tokenUrl,
      method: 'post',
      data: {
        file_name: file.name
      },
      success: function (response) {
        if (self.destroyed) return
        const token = response && response.token
        const key = response && response.uploadFileName
        if (token) {
          self.uploadFile(file, response.uploadHost, token, key)
        } else {
          self.failed({
            error: response ? response.error : 'get token error',
            response: response
          })
        }
      },
      error: function (e) {
        if (self.destroyed) return
        self.failed({
          error: 'get token error',
          response: e
        })
      }
    })
  }

  uploadFile(file, uploadUrl, token, key) {
    const self = this
    let Qiniu_UploadUrl = uploadUrl || 'http://up-z2.qiniup.com'
    var xhr = new XMLHttpRequest()
    xhr.open('POST', Qiniu_UploadUrl, true)

    var formData, startDate
    formData = new FormData()
    formData.append('key', key)
    formData.append('token', token)
    formData.append('file', file)

    var taking
    xhr.upload.addEventListener("progress", function (evt) {
      // console.log('progress', evt)
      if (self.destroyed) return
      if (evt.lengthComputable) {
        var nowDate = new Date().getTime()
        taking = nowDate - startDate
        var x = (evt.loaded) / 1024
        var y = taking / 1000
        var uploadSpeed = (x / y)
        var formatSpeed
        if (uploadSpeed > 1024) {
            formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s"
        } else {
            formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s"
        }
        var percentComplete = Math.round(evt.loaded * 100 / evt.total)
        self.progress(percentComplete)
      }
    }, false)

    xhr.onreadystatechange = function (response) {
      if (self.destroyed) return
      if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
        var blkRet = JSON.parse(xhr.responseText)
        self.success(blkRet)
      } else if (xhr.status != 200 && xhr.responseText) {
        var blkRet = JSON.parse(xhr.responseText)
        self.failed()
      }
      self.complete()
    }
    startDate = new Date().getTime()
    xhr.send(formData)
  }
}
export default QiNiuBaseUpload
