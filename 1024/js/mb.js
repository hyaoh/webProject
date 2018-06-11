!(function () {

var Game = {
	//分数
	score : 0,
	//分数显示窗口
	scoreShow : document.getElementById('score').getElementsByTagName('span')[0],
	//能量条
	power : 0,
	//能量条显示
	powerShow : document.getElementById('box_prow').getElementsByTagName('span')[0],
	//可消除模块集合
	valueBox : [],
	//按键频率判断
	msg : true,
	//消除按键判断
	clickSw : false,
  // 屏幕大小
  screen : {
    w: 0,
    h: 0
  },
  // 方块大小
  blockSize : 0,
	bgMusic: document.getElementById('bgMusic'),
	//初始化状态
	init : function(){
    this.screen = {
      w: window.screen.width,
      h: window.screen.height
    }
    this.setSize()
		for (var i = 0; i < 2 ;i++ ){
			this.create();
		}
		this.control();
		this.eliminate();
	},
  setSize : function () {
    var wrapWidth = this.screen.w - 20
    var _wrap = document.getElementById('wrap')
    var _box_wrap = document.getElementById('box_wrap')
    _wrap.style.height = wrapWidth + 'px'
    _wrap.getElementsByTagName('ul')[0].style.height = wrapWidth + 'px'
    _box_wrap.style.width = wrapWidth - 8 + 'px'
    _box_wrap.style.height = wrapWidth - 8 + 'px'
    this.blockSize = Math.floor((wrapWidth - 40) / 4)
    var blockSize = this.blockSize.toFixed(1) + 'px'
    var css = '<style>#wrap ul li {width: ' + blockSize + '; height: ' + blockSize + ';} #wrap #box_wrap .box {width: ' + blockSize + '; height: ' + blockSize + ';line-height: ' + blockSize + '}</style>'
    document.head.innerHTML = document.head.innerHTML + css
  },
	//创建规则
	create : function(){
		var date = [];
		for (var i = 0; i < this.exDate.length; i++){
			if (!this.exDate[i]){
				date.push(i);
			}
		}
		if (!date.length){
			alert('游戏结束,您的得分为'+this.score);
			return;
		}
    var blockSize = this.blockSize
		var num =  Math.floor(Math.random() * date.length)
		var xY = date[num];
		var x = xY % 4 * (blockSize + 8) + 8
		var y = parseInt(xY / 4) * (blockSize + 8) + 8;
		var oBox = document.createElement('div');
		oBox.className = 'box value';
		oBox.left = x;
		oBox.top = y;
		oBox.index = xY;
		oBox.style.left = x + 'px';
		oBox.style.top = y + 'px';
		oBox.innerHTML = 2;
		oBox.value = 2;
		box_wrap.appendChild(oBox);
		this.exDate[xY]=1;
	},
	//键盘控制
	control:function(){
		var This = this
    var bigContainer = document.getElementsByClassName('game-2048')[0]
    var touchStX
    var touchStY
    var touchEndX
    var touchEndY
		window.addEventListener('touchstart', function (e) {
			This.bgMusic.play()
    })
		window.addEventListener('touchmove', function (e) {
			e.preventDefault()
    })
    bigContainer.addEventListener('touchstart', function (e) {
      touchStX = e.touches[0].pageX
      touchStY = e.touches[0].pageY
    })
    bigContainer.addEventListener('touchmove', function (e) {
			e.preventDefault()
      touchEndX = e.touches[0].pageX
      touchEndY = e.touches[0].pageY
    })
    bigContainer.addEventListener('touchend', function (e) {
      var moveDir = This.getMoveDir(touchStX, touchStY, touchEndX, touchEndY)
      if(!This.msg) return
      switch(moveDir) {
				case 37:
				dir = {a:'left',b:-1,c:-1};
				This.move(dir);
				break;
				case 38:
				dir = {a:'top',b:-1,c:-4};
				This.move(dir);
				break;
				case 39:
				dir = {a:'left',b:1,c:1};
				This.move(dir);
				break;
				case 40:
				dir = {a:'top',b:1,c:4};
				This.move(dir);
				break;
  		}
    })
	},
  getMoveDir: function (stX, stY, endX, endY) {
    if (endX > stX) { // 右半块
      if (endY > stY) {
        return (endY - stY) > (endX - stX) ? 40 : 39
      } else {
        return (stY - endY) > (endX - stX) ? 38 : 39
      }
    } else { // 左半块
      if (endY > stY) {
        return (endY - stY) > (stX - endX) ? 40 : 37
      } else {
        return (stY - endY) > (stX - endX) ? 38 : 39
      }
    }
  },
	//运动规则
	move:function(dir){
		var This = this;
		var all = document.getElementsByClassName('box');
		var allBox = [];
		var sw = dir.b === -1;
		var createSwitch = 0;
		var playSwitch = true
		for (var i = 0; i < all.length; i++ ){
			allBox[all[i].index] = all[i];
		}
		var moveSize = this.blockSize + 8
    var midle = (8 + 8 + 3 * moveSize) / 2 // 左最大边距 + 右最大边距
		var constant = midle - 8
		for (var i = sw ? 0 : allBox.length - 1; sw ? i < allBox.length :i >= 0; sw ? i++ : i--) {
			if (allBox[i]) {
				while(allBox[i][dir.a] != midle + constant * dir.b) {
					if (This.exDate[allBox[i].index + dir.c] != 1) {
						This.exDate[allBox[i].index] = 0
						var num = allBox[i].index + dir.c
						allBox[num] = allBox[i]
						allBox[num].index+= dir.c
						This.exDate[allBox[num].index] = 1
						allBox[num][dir.a] += moveSize * dir.b
						allBox[num].style[dir.a]= allBox[num][dir.a] + 'px'
						createSwitch++
						This.msg = false
						//allBox.splice(allBox[i].index,1);
						//This.move(dir);
					} else {
						if (allBox[allBox[i].index+dir.c] && (allBox[i].value == allBox[allBox[i].index+dir.c].value)) {
							allBox[allBox[i].index+dir.c].parentNode.removeChild(allBox[allBox[i].index+dir.c])
							allBox[allBox[i].index+dir.c].value = 0
							This.exDate[allBox[i].index] = 0
							allBox[i].index+= dir.c
							This.exDate[allBox[i].index]=1
							allBox[i][dir.a]+= moveSize * dir.b
							allBox[i].style[dir.a]= allBox[i][dir.a] + 'px'
							allBox[i].value*= 2;
							var value = allBox[i].value
							allBox[i].innerHTML = value
							this.score += value
							this.power += value / 50
							allBox[i].className ='box value-'+ value
							this.scoreShow.innerHTML = this.score;
							createSwitch++
							if(this.power > 100){
								this.power = 100
								this.powerShow.innerHTML = '可点击消除一个2的模块';
							}
							this.powerShow.style.width = this.power+'%'
							This.msg = false;
							if (playSwitch) {
								document.getElementById('scoreMusic1').play()
								playSwitch = false
							}
						}
						break
					}
				}
			}
		}
		if(createSwitch) setTimeout(function(){
			This.create.call(This);
			This.msg = true;
			if(This.power<100) return;
			This.clickSw = true;
			This.valueBox = document.getElementsByClassName('value');
			for (var i=0;i<This.valueBox.length;i++){
				This.valueBox[i].onclick = function(){
					if(!This.clickSw || this.value!=2) return;
	   				this.parentNode.removeChild(this);
					This.exDate[this.index] = 0;
					This.power = 0;
					This.powerShow.style.width = 0;
					This.powerShow.innerHTML = '';
					This.clickSw = false;
				};
				This.valueBox[i].onmouseenter = function(){
					if(!This.clickSw) return;
	   				this.className+=' hover'
				};
				This.valueBox[i].onmouseleave = function(){
					if(!This.clickSw) return;
	   				this.className =this.className.replace(' hover','');
				};
			}
		},500);
	},
	//消除模块
	eliminate : function(){
		var This = this;
		for (var i=0;i<this.valueBox.length;i++){
			this.valueBox[i].addEventListener("click", function(){
   				alert(1);
			});
		}
		/*
		oBox.onclick = function(){
			console.log(1);
			if(This.power>=100 && this.value == 2){
				this.parentNode.removeChild(this);
				This.exDate[this.index] = 0;
				This.power = 0;
			}
		}*/
	},
	//占格数据
	exDate:[ 0,0,0,0,
			 0,0,0,0,
			 0,0,0,0,
			 0,0,0,0 ],

};
Game.init();
})()
