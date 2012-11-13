var Cloud = jsFW.Class({
	tags:[],
	vx:0.0,
	vy:0.0,
	ax:-0.01,
	ay:-0.01,
	radius:200,
	x:200,
	y:200,
	__constructor:function(o)
	{
		jsFW.hash.extend(this,o);
		this.init();
	},
	init:function()
	{
		this.parent = jsFW.element(this.parent);
		this.initMatrix();
		this.parent.onmousemove = jsFW.delegate(this,this.mousemove);
		jsFW.event.hover(this.parent,jsFW.delegate(this,this.hover));
	},
	mousemove:function(s,e)
	{
		var x = e.clientX;
		var y = e.clientY;
		this.vx = (x/s.clientWidth-0.5)/3;
		this.vy = -(y/s.clientHeight-0.5)/3;
		this.initMatrix();
	},
	hover:function(s,e)
	{
		if(e.hover)
		{
			this.timeout = setInterval(jsFW.delegate(this,this.process),100);
		}
		else if(this.timeout)
		{
			clearInterval(this.timeout);
			this.vx = 0;
			this.vy = 0;
			this.initMatrix();
		}
	},
	initMatrix:function()
	{
		var cosX =Math.cos(this.vx);
		var sinX =Math.sin(this.vx);
		var cosY =Math.cos(this.vy);
		var sinY =Math.sin(this.vy); 
		this.mx = [
			[1,0,0],
			[0,cosY,-sinY],
			[0,sinY,cosY]
		];
		this.my = [
			[cosX,0,sinX],
			[0,1,0],
			[-sinX,0,cosX]
		];
	},
	umn:function(m,v)
	{
		return [
			m[0][0]*v[0]+m[0][1]*v[1]+m[0][2]*v[2],
			m[1][0]*v[0]+m[1][1]*v[1]+m[1][2]*v[2],
			m[2][0]*v[0]+m[2][1]*v[1]+m[2][2]*v[2]
		]
	},
	initTag:function(jtag)
	{
		var tag = new Tag(jtag,this)
		var html = tag.getHtml();
		if(html)
		{
			this.parent.appendChild(html);
			var x = Math.rand(-this.radius,this.radius);
			var my = Math.sqrt(this.radius*this.radius - x*x);
			var y = Math.rand(-my,my);
			var mz = Math.sqrt(this.radius*this.radius - x*x - y*y);
			var z = Math.rand(-mz,mz);
			tag.setPosition({x:x+this.radius+this.x,y:y+this.radius+this.y,z:z+this.radius});
			return tag;
		}
	},
	process:function()
	{
		var dx = this.radius+this.x;
		var dy = this.radius+this.y;
		this.tags.map(function(tag)
		{
			var p = [tag.x-dx,tag.y-dy,tag.z-this.radius];
			var r = this.umn(this.my,p);
			var r = this.umn(this.mx,r);
			tag.setPosition({x:r[0]+dx,y:r[1]+dy,z:r[2]+this.radius});
		},this);
		this.vx += this.ax;
		this.vy += this.ay;
	},
	addTag:function(tag)
	{
		this.tags=this.tags.concat(tag.map(function(e){return this.initTag(e)},this));
	}
});
var Tag = jsFW.Class({
	x:0,
	y:0,
	z:0,
	__constructor:function(o,cloud)
	{
		jsFW.hash.extend(this,o);
		this.fontSize = (100+this.w*20);
		this.cloud = cloud;
		this.init();
	},
	setPosition:function(p)
	{
		this.x = p.x;
		this.y = p.y;
		this.z = p.z;
		this.html.style.left = this.x+'px';
		this.html.style.top = this.y+'px';
		this.html.style.zIndex = this.z+1000;
		var z = 0.2+this.z/this.cloud.radius;
		jsFW.element.opacity(this.html,z);
		this.html.style.fontSize = this.fontSize*(z) +'%';
	},
	getHtml:function()
	{
		if(!this.html) this.html = jsFW.element.create('a',{className:'tag',style:{fontSize:this.fontSize+'%'},innerHTML:this.text,href:this.href});
		return this.html;
	},
	init:function()
	{
		
	}
});