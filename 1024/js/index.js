var Entrance = {
  init: function () {
    if (this.testMb()) {
      this.initMb()
    } else {
      this.initPc()
    }
  },
  testMb: function () {
    var ua = navigator.userAgent
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
    var isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
    var isAndroid = ua.match(/(Android)\s+([\d.]+)/)
    var isMobile = isIphone || isAndroid
    return isMobile
  },
  initMb: function () {
    var css = '<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"><link href="./css/styleMb.css" rel="stylesheet"/>' // '<link href="http://www.web-jackiee.com/works/jquery/oldcowPlayer/css/styleMb.css" rel="stylesheet"/>'
    var js = document.createElement('script')
    js.src = './js/mb.js' // 'http://www.web-jackiee.com/works/jquery/oldcowPlayer/js/mb.js'
    var _self = this
    document.head.innerHTML += css
    document.body.appendChild(js)
  },
  initPc: function () {
    var css = '<link href="./css/stylePc.css" rel="stylesheet"/>' // '<link href="http://www.web-jackiee.com/works/jquery/oldcowPlayer/css/stylePc.css" rel="stylesheet"/>'
    var js = document.createElement('script')
    js.src = './js/pc.js' // 'http://www.web-jackiee.com/works/jquery/oldcowPlayer/js/pc.js'
    var _self = this
    document.head.innerHTML += css
    document.body.appendChild(js)
  }
}

Entrance.init()
