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
	powerMusic1: document.getElementById('scoreMusic1'),
	powerMusic2: document.getElementById('scoreMusic2'),
	powerMusic3: document.getElementById('scoreMusic3'),
	scoreCount: 0,
	//初始化状态
	init : function(){
		for (var i = 0; i < 2 ;i++ ){
			this.create();
		}
		this.control();
		this.eliminate();
	},
	//创建规则
	create : function(){
		var date = [];
		for (var i = 0;i<this.exDate.length;i++ ){
			if (!this.exDate[i]){
				date.push(i);
			}
		}
		if (!date.length){
			alert('游戏结束,您的得分为'+this.score);
			return;
		}
		var num =  Math.floor(Math.random()*date.length)
		var xY = date[num];
		var x = xY%4*110+10;
		var y = parseInt(xY/4)*110+10;
		var oBox = document.createElement('div');
		oBox.className = 'box value';
		oBox.left = x;
		oBox.top = y;
		oBox.index = xY;
		oBox.style.left = x+'px';
		oBox.style.top = y+'px';
		oBox.innerHTML = 2;
		oBox.value = 2;
		box_wrap.appendChild(oBox);
		this.exDate[xY]=1;
	},
	//键盘控制
	control:function(){
		var This = this;
		window.onkeydown = function(ev){
			ev = ev||window.event;
			var dir;
			if(!This.msg) return;
			switch(ev.keyCode)
			{
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
			if (ev.keyCode!=116&&ev.keyCode!=123) return false;
		}

	},
	//运动规则
	move:function(dir){
		var This = this;
		var all = document.getElementsByClassName('box');
		var allBox = [];
		var sw = dir.b==-1;
		var createSwitch = 0;
		for (var i =0; i < all.length; i++ ){
			allBox[all[i].index] = all[i];
		}
		for (var i = sw?0:allBox.length-1;sw?i<allBox.length:i>=0;sw?i++:i--){
			if (allBox[i]){
				while(allBox[i][dir.a]!=175+165*dir.b){
					if (This.exDate[allBox[i].index+dir.c]!=1){
						This.exDate[allBox[i].index]=0;
						var num = allBox[i].index + dir.c;
						allBox[num] = allBox[i];
						allBox[num].index+= dir.c;
						This.exDate[allBox[num].index]=1;
						allBox[num][dir.a]+=110*dir.b;
						allBox[num].style[dir.a]= allBox[num][dir.a] + 'px';
						createSwitch++;
						This.msg = false;
						//allBox.splice(allBox[i].index,1);
						//This.move(dir);
					}else{
						if (allBox[allBox[i].index+dir.c] && (allBox[i].value == allBox[allBox[i].index+dir.c].value)){
							allBox[allBox[i].index+dir.c].parentNode.removeChild(allBox[allBox[i].index+dir.c]);
							allBox[allBox[i].index+dir.c].value =0;
							This.exDate[allBox[i].index]=0;
							allBox[i].index+= dir.c;
							This.exDate[allBox[i].index]=1;
							allBox[i][dir.a]+=110*dir.b;
							allBox[i].style[dir.a]= allBox[i][dir.a] + 'px';
							allBox[i].value*=2;
							var value = allBox[i].value;
							allBox[i].innerHTML = value;
							this.score += value;
							this.power += value/50;
							allBox[i].className ='box value-'+value;
							this.scoreShow.innerHTML = this.score;
							createSwitch++;
							if(this.power > 100){
								this.power = 100;
								this.powerShow.innerHTML = '可点击消除一个2的模块';
							}
							this.powerShow.style.width = this.power+'%';
							This.msg = false;
							This.scoreCount = ++This.scoreCount % 3
							if (This.scoreCount === 0) {
								This.powerMusic1.play()
							} else if (This.scoreCount === 1) {
								This.powerMusic2.play()
							} else {
								This.powerMusic3.play()
							}
						}
						break;
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
