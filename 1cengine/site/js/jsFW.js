/*
* JavaScript library ver. 0.0.5
* Copyright (c) 2007-2008 Sergey Voronkov(grey_asd@mail.ru)
* Пожалуста не удаляйте и не изменяйте эти коментарии.
* 
*   Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
*/
var jsFW = function()
{
	return {
		version:'0.0.3',
		mail:''
	};
};
var userAgent = navigator.userAgent.toLowerCase();
jsFW.browser = {
	version: (userAgent.match( /.+?(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	chrome:(/chrome/i).test(userAgent),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};
/**
* Расширение стандартных обьектов
*/
jsFW.extendPrototype = function(obj,proto)
{
	for(var i in proto)
		if(!obj.prototype[i]) 
			obj.prototype[i] = proto[i];
};

jsFW.Prototype = function(obj,proto)
{
	for(var i in proto) if(!obj[i]) obj[i] =(function(proto){return function(){return proto.apply(this,[this].concat(Array.prototype.slice.apply(arguments)))}})(proto[i]);
	return obj;
};
/** Создание ленивой функции
* @param {Function} Функция которая будет вычеслина только один раз
* @param {Array} Мосив аргументов передаваемые в функцию при вычесление
* @return {Function} Ленивая функция
*/
jsFW.lazy = function(fun,arg)
{
	var res;
	return function() { return res || (res = fun.apply(this,arg || []))};
};
/** Лямбда вырожения
* @param {String} 
* @return {Function}  функция
*/
jsFW.lambda = function(lambda)
{
	var t = lambda.split('->');
	var params = t.length>1?t[0].split(','):[];
	var fun = t[1]||t[0];
	return new Function(params,'return ('+ fun +')');
};

/**
* Создает новый клас на основе базового
* @param {Class} Наследуемый класс
* @param {Function} Функция возврощающая прототип обьекта класса
* @return {Class} Новый класс
*/
jsFW.Class = function(proto,base/*,interface, ....*/)
{
	var _interface = Array.prototype.slice.call(arguments,2);
	var _class = function(fun,arg)
	{
		if(this.constructor == _class)
		{
			if(this.__constructor) this.__constructor.apply(this,arguments);
			if(_interface.length>0) jsFW.Interface.ensureImplements.apply(this,[this].concat(_interface));
		}
		else
		{
			if(typeof fun != 'string') {arg = fun;fun=false;}
			if(!fun) fun = '__constructor';
			if(_class.prototype[fun])
			{
				this.__base = base;
				var r =  _class.prototype[fun].apply(this,arg||[]);
				this.__base = _class;
				return r;
			}
		}
	};
	if(base)
	{
		var instance = function(){};
		instance.prototype = base.prototype;
		_class.prototype = new instance();
	}
	_class.prototype.constructor = _class;
	if(proto instanceof Function) proto = proto(base);
	jsFW.hash.extend(_class.prototype,proto);
	_class.prototype.__base = base;
    _class.base = base;
	return _class;
};
/**
* Интерфейс
*/
jsFW.Interface = function(name,method)
{
	if(arguments.length!=2) throw new Error("Интерфейс конструируется с "+arguments.length+" аргументами, должно быть 2");
	this.name = name;
	this.method = method;
};

jsFW.Interface.ensureImplements = function(object/*,interface, ....*/)
{
	if(arguments.length<2) throw new Error("Функция jsFW.Interface выполняется с "+arguments.length+" аргументами, должно быть более 2х");
	for(var i=1,len=arguments.length;i<len;i++)
	{
		for(var j=0,inter = arguments[i],method = inter.method,mlen=method.length;j<mlen;j++)
			if(!object[method[j]] || typeof object[method[j]] !== 'function') throw ("В обьекте не реализован метод "+method[j]+" из интервейса "+inter.name);
	}
};
jsFW.cookie = {
    get:function(name)
    {
        if('cash' in this) return this.cash[name];
        if(document.cookie)
        {
            this.cash = document.cookie.split('; ').map('c->c.split("=")').toHash();
            return this.cash[name];
        }
    },
    set:function(name,value, expires, path, domain, secure)
    {
        document.cookie = name + "=" + escape(value) +
    	((expires) ? "; expires=" + expires : "") +
    	((path) ? "; path=" + path : "") +
    	((domain) ? "; domain=" + domain : "") +
    	((secure) ? "; secure" : "");
        
    },
    del:function(name, path, domain) 
    {
    	if(this.get(name)) 
    	{
    		this.set(name,'','Thu, 01-Jan-70 00:00:01 GMT', path,domain);
    		delete this.cash[name];
    	}
    }
};
/**
* Обьект для работы с кешем
*/
jsFW.hash = {
/**
	* Дополняет хеш свойствами других хешов 
	* @param {Object} Дополняемый хеш
	* @param {Object} Донор (Может быть несколько)
	* @return {Object} Измененый хеш
	*/
	extend:function(hash/*, ....*/)
	{
        var hash2;
		for(var i=1,len = arguments.length;i<len;i++)
        {
            hash2 = arguments[i];
            for(var prop in arguments[i]) hash[prop] = hash2[prop];
        }
		return hash;
	},
	unite:function(hash)
	{
		for(var i=1,len = arguments.length;i<len;i++)
		{
			var hash2 = arguments[i];
            var h;
			for(var prop in hash2)
			{
                h = hash2[prop];
				if(h != undefined)
				{
					if(typeof h == 'object' && prop in hash)
						this.unite(hash[prop],h);
					else 
						hash[prop] = h;
				}
			}
		}
		return hash;
	},
	/** 
	* Осуществляет слияние двух и более хешов
	* @param {Object} Хеши более двух
	* @return {Object} Новый хеш
	*/
	merge:function()
	{
		var hash = {};
		for(var i=0,len = arguments.length;i<len;i++) for(var prop in arguments[i]) hash[prop] = arguments[i][prop];
		return hash;
	},
	/**
	* Поиск ключа по значению
	* @param {Object} hash Хеш где искать
	* @param {Object} value Значение которое искать
	* @return {String} Ключь
	*/
	indexOf:function(hash,value)
	{
		for(var i in hash) if(hash[i]==value) return i;
		return false;
	},
	/**
	* Выполняет функцию над всеми элиментами хеша
	* @param {Object}	Хеш
	* @param {Function}	выполняемая функция вида function(element,key,hash)
	* @param {Object}	Относительно ково будет выполнятся функция если не указана то относительно текущего елимента
	* @return {Object}
	*/
	each:function(hash,iterator,s)
	{
		var res = {};
		if(typeof iterator == 'function')
			for(var i in hash) res[i] = iterator.call(s || hash[i],hash[i],i,hash);
		else
			for(var i in hash) res[i] = (s[iterator] || hash[i][iterator])(hash[i],i,hash);
		return res;
	},
	/** Размер хеша *
	* @param {Object} 
	* @return {Number} 
	*/
	size:function(hash)
	{
		var size = 0;for(var i in hash) size++;
		return size;
	},
	/** Меняет местами ключь <-> значение *
	* @param {Object}
	* @return {Object}
	*/
	invert:function(hash)
	{
		var res = {};
		for(var i in hash) res[hash[i]] = i;
		return res;
	},
	/** Преобразует хеш в строку http запроса 
	*	@param {Object}
	*	@return {String}
	*/
	toHttpStr:function(hash)
	{
		if(typeof hash == 'string') return hash;
		var res = [];
		for(var i in hash)
		{
			if(hash[i]!=undefined)
			{
				if(hash[i] instanceof Array){ if(hash[i].length) res.push(hash[i].map(function(v){ return i+'='+encodeURIComponent(v);}).join('&'));
				}else res.push(encodeURIComponent(i)+'='+encodeURIComponent(hash[i]));
			}
			
		}
		return res.join('&').replace(/%20/g, "+");
	},
	/** Преобразовывает строку http запроса в хеш
	* @param {String}
	* @return {Object}
	*/
	fromHttpStr:function(http)
	{
		var param = decodeURIComponent(http).replace(/[\+]/g,' ').split('&');
		var res = {};
		for(var i=0,len=param.length;i<len;i++)
		{
			var t = param[i].split('=');
			if(!res[t[0]])
				res[t[0]] = t[1];
			else
			{
				if(!(res[t[0]] instanceof Array))
					res[t[0]] = [res[t[0]]];
				res[t[0]].push(t[1]);
			}
		}
		return res;
	},
	/** Клонирует хеш
	*	@param {Object} хеш
	*	@param {int} Клонировать детей
	*	@return {Object} 
	*/
	clone:function(hash,ischild)
	{
		if('object' != typeof hash) return hash;
		var t = {};
		if(ischild) 
			for(var i in hash) t[i] = arguments.callee(hash[i],ischild--);
		else
			for(var i in hash) t[i] = hash[i];
		return t;
	},
	serialize:function(hash)
	{
		switch(typeof hash)
        {
            case 'number': return hash;
            case 'string': return "'"+hash+"'";
            case 'object':
                if(hash instanceof Array) return '['+hash.map(arguments.callee).join(',')+']';
                if(hash instanceof Date) return hash.toString();
       			var t=[];
    			for(var i in hash)
    			{
    				t.push(i+':'+arguments.callee(hash[i]));
    			}
    			return '{'+t.join(',')+'}';
            default:
                return hash.toString();
		}
	}
};
/**
 * Возвращает случайное целое число в диапазоне от min до max *
 * @param {Object} min минимальное значение 
 * @param {Object} max максимальное значение 
 * @return {Integer} 
 */ 
Math.rand = function(min, max) { var res = Math.random(); return (min == undefined || max == undefined) ? res : Math.floor(res * (max - min + 1) + min)}; 
jsFW.extendPrototype(Array, 
{
	/**
	* Возврощает индекс в мосиве по значению
	* @param {Object}	Искомое значение
	*@return {Number}	Индекс значения в масиве
	*/
	indexOf:function(value)
	{
		for(var i=0,len=this.length;i<len;i++) if(this[i]===value) return i;
		return -1;
	},
	/**
	* Ищет обьект в массиве с помощью функции
	* @param {Function}
	* @param {Object}
	* @return {Array}
	*/
	find:function(iterator,s)
	{
		for(var i=0,len=this.length;i<len;i++)	if(iterator.call(s,this[i],i,this)) return this[i];
		return false;
	},
	/**
	* Накладывает функцию на массив
	* @param {Function}
	* @param {Object}
	* @return {Array}
	*/
	map:function(iterator,s)
	{
		var res = [];
		for(var i=0,len=this.length;i<len;i++)	res.push(iterator.call(s,this[i],i,this));
		return res;
	},
	/**
	* Выполняет функцию над всеми элиментами хеша
	* @param {Function}	выполняемая функция вида function(element,key,hash)
	* @param {Object}	Относительно ково будет выполнятся функция если не указана то относительно текущего елимента
	* @return {Array}
	*/
	each:function(iterator,s,arg)
	{
		if(typeof iterator == 'function')
			for(var i=0,len=this.length;i<len;i++) iterator.call(s,this[i],i,this,arg);
		return this;
	},
	clone:function()
	{
		var res = [];
		for(var i=0,len=this.length;i<len;i++) res.push(this[i]);
		return res;
	},
	fun:function(iterator,arg)
	{
		var res = [];
		var arg = arg || [];
		for(var i=0,len=this.length;i<len;i++) if(typeof this[i][iterator] == 'function') res.push(this[i][iterator].apply(this[i],arg));
		return res;
	},
	/**
	*
	* @param {Function}
	* @param {Object}
	* @return {Array}
	*/
	filter:function(filter,s)
	{
		var ret = [];
		for(var i=0,len=this.length;i<len;i++) if(this[i] != undefined && filter.call(s,this[i],i,this)) ret.push(this[i]);
		return ret;
	},
	/**
	* Находит элимент и удаляет его
	* @param {Object}
	* @return {Object}
	*/
	removeElement:function(el)
	{
		var i = this.indexOf(el);
		if(i>=0) this.splice(i,1);
		return el;
	},
	toHash:function()
	{
		var res = {};
		for(var i=0,len=this.length;i<len;i++) res[this[i][0]] = this[i][1];
		return res;
	},
	indexOfKey:function(el,key)
	{
		for(var i=0,len=this.length;i<len;i++)if(this[i][key] == el)return i;
		return -1;
	},
	/**
	* Вернуть уникальный масив
	*/
	unique:function() {
		var res = [];
		for(var i=0,len=this.length; i<len; i++) if(res.indexOf(this[i]) == -1) res.push(this[i]);
		return res;
	},
	// Возвращает значение первого элемента массива и удаляет его из массива. Длина массива уменьшается на один.
	shift:function() {
		return this.slice(0,1);
	},
	/**
	* последовательно передаёт в функцию свертки значение аккумулятора и очередное значение из списка, а результат помещает в аккумулятор
	* @param {Function} функцию свертки (которая принимает два значения, и возвращает одно)
	*/
	reduce:function(iterator,a,s)
	{
		for(var i=0,len=this.length;i<len;i++)
			a = iterator.call(s,a,this[i]);
		return a;
	},
	max:function(iterator,a)
	{
		var iter = iterator || function(m,c){return Math.max(m,c)};
		return this.reduce(iter,a);
	},
	min:function(iterator,a)
	{
		var iter = iterator || function(m,c){return Math.min(m,c)};
		return this.reduce(iter,a);
	},
	/**
	* Возврощает массив с элиментами входящих в оба массива
	* @param {Object}
	* @return {Object}
	*/
	and:function(a)
	{
		var res = [];
		for(var i=0,len=this.length;i<len;i++) if(a.indexOf(this[i])!=-1) res.push(this[i]);
		return res;
	},
	/**
	* Возврощает массив с элиментами входящих хотябы в один масив
	* @param {Object}
	* @return {Object}
	*/
	or:function(a)
	{
		return this.concat(a);
	}
});

jsFW.extendPrototype(String, 
{
	repeat:function(n){
		var str = this;
		while(--n > 0) str += this;
		return str;
	},
	pad:function(pad_length, pad_string, pad_type)
	{
		var str = pad_string || ' ';
		var len = (pad_length - this.length)/str.length;
		if(len<=0) return this;
		var pad_str = str.repeat(len);
		switch(pad_type)
		{
			case 'left': return pad_str + this;
			default: return this + pad_str;
		}
	},
	trim:function()
	{
		return this.replace(/^\s+|\s+$/g, "");
	},
	toInt:function(v)
	{
		if(this == '') return 0;
		return parseInt(this,v || 10);
	}
});
/**
* Работа с сабытиями
*/
/**
	* Создает делигата событий
	* @param {Object} 	Относительно ково запустится функция
	* @param {Function}	Функция
	* @param {Array}	Дополнительные параметры
	* @return {Function}	Функция вида function(s,e,param1,param2,...);
	*/
jsFW.delegate = function(i, m, p){
    return function()
    {
        if(m)
        {
            var arg = [this];
            for(var j=0,l = arguments.length;j<l;j++) arg.push(arguments[j]);
            if(!('1' in arg)) arg[1] = window.event;
            return m.apply(i,arg.concat(p||[]));
        }
        return false;
    }
};
jsFW.event = 
{
	keys:{backspace:8,tab:9,enter:13,esc:27,left:37,up:38,right:39,down:40,del:46,home:36,end:35,pageup:33,pagedown:34,insert:45},
	fix:function(event)
	{
		var e = jsFW.hash.extend({},event);
		if ( !e.target && e.srcElement ) e.target = e.srcElement;
		// check if target is a textnode (safari)
		if (jsFW.browser.safari && e.target.nodeType == 3) e.target = event.target.parentNode;
		// Add relatedTarget, if necessary
		if ( !e.relatedTarget && e.fromElement )
			e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement;
		// Calculate pageX/Y if missing and clientX/Y available
		if ( e.pageX == null && e.clientX != null ) {
			var de = document.documentElement, b = document.body;
			e.pageX = e.clientX + (de && de.scrollLeft || b.scrollLeft || 0);
			e.pageY = e.clientY + (de && de.scrollTop || b.scrollTop || 0);
		}
		// Add which for key events
		if ( !e.which && (e.charCode || e.keyCode) )e.which = e.charCode || e.keyCode;
		
		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !e.metaKey && e.ctrlKey ) e.metaKey = e.ctrlKey;
		// Add which for click: 1 == left; 2 == middle; 3 == right
		// Note: button is not normalized, so don't use it
		if ( !e.which && e.button )e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ));
		return e;
	},
	layer:function(o,e)
	{
		if(!e.layerX || !e.layerY)
		{
			var p = jsFW.element.offset(o);
			return {x:e.clientX - p.left,y:e.clientY-p.top};
		}
		return {x:e.layerX,y:e.layerY};
	},
	/**
	*	Добавить событие к обьекту
	* @param {Object}	Обьект к которому привязывается событие
	* @param {String}	Тип события
	* @param {Function}	Функция выполняемая при событие
	* @return {Object}	Обьект к которому привязывается событие
	*/
	add:function(o,event,callback)
	{
		var object = jsFW.element(o);
		if(!object) return false;
		if(!callback) return object;
		if(!object.__events) object.__events = {};
		if(!object.__events[event])
		{
			object.__events[event] = object[event]?[object[event]]:[];
			object[event] = function(e)
			{
				var arg = arguments;
				try{if(e==undefined || (!jsfw.browser.msie && Event && e instanceof Event)) arg = [jsFW.event.fix(e || window.event)];}catch(e){}
				return jsFW.event.call(object,event,arg);
			}
		}
		object.__events[event].push(callback);
		return object;
	},
	/**
	*	Удаление события
	*	@param {Object}	Обьект у которого удоляется событие
	*	@param {String}		Тип события
	*	@param {Function}	Удоляемая функция (может не быть)
	*	@return {Object}	Обьект у которого удоляется событие
	*/
	remove:function(object,event,fun)
	{
		if(event && fun)
			object.__events[event].removeElement(fun);
		else
		{
			for(var i in object.__events) delete object[i];
			delete object.__events;
		}
		return object;
	},
	/**
	*	Выполнение событий у обьекта
	*	@param {Object}	Обьект 
	*	@param {String}		Тип события
	*	@param {Array}		Аргументы
	*/
	call:function(object,event,arg)
	{
		if(event instanceof Array)
		{
			for(var i=0,len=event.length;i<len;i++)
				arguments.callee(object,event[i],arg);
			return true;
		}
		var arg = arg || [];
		if(object.__events && object.__events[event])
		{
			var e = object.__events[event];
			for(var i=0,len=e.length;i<len;i++)
			{
				var res = e[i].apply(object,arg||[]);
				if(!res && res !=undefined) return false;
			}
		}
		else
			return object[event]?object[event].apply(object,arg||[]):true;
		return true;
	},
	/**
	* Событие срабатывающее один раз
	*/
	one:function(object,event,fun)
	{
		jsFW.event.add(object,event,function()
		{
			jsFW.event.remove(object,event,arguments.callee);
			return fun.apply(this,arguments);
		});
	},
	/**
	* Событие сробатывающее с задержкой
	*/
	time:function(obj,startevent,stopevent,callback,time)
	{
		var onclick = obj.onclick, timeout = null;
		jsFW.event.add(obj,startevent,function()
		{
			var arg = arguments,_this = this;
			timeout = setTimeout(function(){callback.apply(_this,arg);},time || 500);
			return false;
		});
		jsFW.event.add(obj,stopevent,function()
		{
			if(timeout) clearTimeout(timeout);
		});
	},
	/**
	* Событие навидения
	*/
	
	hover: function(object,fun,params) {
		function handleHover(e) {
			var p = e.relatedTarget;
			while ( p && p != this ) try { p = p.parentNode; } catch(e) { p = this; };
			if ( p == this ) return false;
			e.hover = e.type == "mouseover";
			var p = [e].concat(params);
			return fun.apply(this,p);
		}
		jsFW.event.add(object,'onmouseover',handleHover);
		jsFW.event.add(object,'onmouseout',handleHover);
		return object;
	}
};
jsFW.Object = jsFW.Class({
    __constructor:function(o){if(o && o.events)for(var e in o.events) this.addEvent(e,o.events[e]);},
	addEvent:function(type,callback){return jsFW.event.add(this,type,callback);},
	removeEvent:function(type,callback){return jsFW.event.remove(this,type,callback);},
	callEvent:function(type,arg){return jsFW.event.call(this,type,arg);}
});
/**
* Работа с DOM обьектами
*/
jsFW.element = function(arg)
{
	var res = [].concat(arg).map(function(id){return jsFW.element.get(id)});
	res.fun = function(iterator)
	{
		var res = [];
		var arg = Array.prototype.slice.apply(arguments);
		for(var i=0,len=this.length;i<len;i++)
		{
			arg[0] = this[i];
			res.push(iterator.apply(this,arg));
		}
		res.fun = arguments.callee;
		return res;
	};
	return res.length>1?res:res[0];
};
jsFW.hash.extend(jsFW.element,
{
	
	/**
	* Получение обьекта по id
	* @param {string} 		Id или сам обьект
	* @return {DOMObject}	Найденный обьект
	*/
	get:function(id)
	{
		if(typeof id == 'string') return document.getElementById(id);
		return id;
	},
	getTag:function(tag,className,parent,callback)
	{
		if(parent instanceof Function)callback = parent,parent = null;
		if(className == '*') className = false;
		parent = jsFW.element(parent)||document.body;
		var el = parent.getElementsByTagName(tag);
		var a = [];
		for(var i = 0,len=el.length;i<len;i++)
		{
			if(!className || jsFW.element.ifClass(el[i],className))
			{
				var e = el[i];
				if(callback) e = callback(e,i);
				if(e == 'break') break;
				a.push(e);
			}
		}
		return a;
	},
	parent:function(element,tag,cName)
	{
		var p = element.parentNode;
		if(tag && tag!='*')
		{
			if(cName) while(p && p.tagName && p.tagName.toLowerCase() !== tag && p.className!==cName) p = p.parentNode;
			else while(p && p.tagName && p.tagName.toLowerCase() !== tag) p = p.parentNode;
		}
		else if(cName) while(p && p.className!==cName) p = p.parentNode;
		return p;
	},
	/**
	* Создание DOM елимента
	* @param {String} 		Название тега или html
	* @param {Object}		Параметры элимента - может не быть
	* @param {DOMObject}	Радительский элимент(куда добавить) - может не быть
	* @return {DOMObject}	Новый элимент
	*/
	create:function(tag,p,parent)
	{ 
		var el = null;
		try{
			if(tag.indexOf('<')>=0)
				el = jsFW.element.create('div',{innerHTML:tag}).childNodes[0];
			else
				el = document.createElement(tag);
		}catch(e){console.dir(e);return false;}
		
		if(p && p.appendChild) parent = p;
		else if(p)
        {
            for(var prop in p)
            {
                var p2 = p[prop];
                if(typeof p2 == 'object' && prop in el)
                {
                    var el2 = el[prop];
                    for(var prop2 in p2) el2[prop2] = p2[prop2];
                }
                else
                    el[prop] = p2;
            }
        }
		if(parent) parent.appendChild(el);
		return el; 
	},
    
	/**
	* Присоиденение елимента к ноду
	* @param {DOMObject} 		Элимент который нужно присоеденить или его id
	* @param {DOMObject}		Элимент к котрому присоединяется или его id
	* @return {DOMObject} 		Присоединяемый элимент
	*/
	appendTo:function(element,parent)
	{
		if(element && parent) parent.appendChild(element);
		return element;
	},
	/**
	* Присоиденение к елименту один или несколько нодов
	* @param {DOMObject} 		Элимент к котрому присоединяется или его id
	* @param {DOMObject}		Один или много(Array) элиментов или их id
	* @return {DOMObject} 		элимент
	*/
	append:function(element,child)
	{
		var el = jsFW.element(element);
		var ch = jsFW.element(child);
		if(el && ch) for(var i=0,ch= [].concat(ch),len=ch.length;i<len;i++) el.appendChild(ch[i]);
	},
	/**
	* Вставка элимента перед нодом
	*/
	before:function(element,next)
	{
		var el = jsFW.element(element);
		var nx = jsFW.element(next);
		if(el && nx && nx.parentNode) nx.parentNode.insertBefore(el,nx);
		return el;
	},
	/**
	* Вставка элимента после нода
	*/
	after:function(element,prev)
	{
		var el = jsFW.element(element);
		var pr = jsFW.element(prev);
		if(el && pr && pr.parentNode)
			if(pr.nextSibling) pr.parentNode.insertBefore(el,pr.nextSibling);
			else pr.parentNode.appendChild(el);
		
	},
	/**
	* Делает елимент пустым
	* @param {DOMObject}
	* @return {DOMObject}
	*/
	empty:function(element)
	{
		if(element)
		{
			var old = element.style.display;
			element.style.display = 'none';
			var ch = element.childNodes;
			for(var i=ch.length;i>0;)
				jsFW.element.remove(ch[--i]);
			element.style.display = old;
		}
		return element;
	},
	/**
	* Удаляет элимент из dom
	* @param {DOMObject}
	* @return {DOMObject}
	*/
	remove:function(element)
	{
		if(element && element.parentNode) element.parentNode.removeChild(element);
		return element;
	},
	swap:function(n1,n2)
	{
		var r1 = n1.nextSibling,r2 = n2.nextSibling,p1 = n1.parentNode,p2 = n2.parentNode;
		if(p1)
		{
			if(r1)p1.insertBefore(n2,r1);else p1.appendChild(n2);
			if(!p2) p1.removeChild(n1);
		}
		if(p2)
		{
			if(r2)p2.insertBefore(n1,r2);else p2.appendChild(n1);
			if(!p1) p2.removeChild(n2);
		}
		return n1;
	},
	/**
	* Возращает или записывает в элимент текст зависит от второво аргумента
	* @param {DOMObject}
	* @param {String}
	* @return {DOMObject}
	*/
	text:function(element,txt)
	{
		if(element)
		{
			if(txt == undefined) return element.textContent || element.innerText;
			if(element.textContent!=undefined)
				element.textContent=txt;
			else
				element.innerText=txt;
		}
		return element;
	},
	/**
	* Добовляет класс к обьекту *
	* @param {DOMObject}
	* @param {String} 		Имя класса
	* @return {DOMObject}
	*/
	addClass:function(element,cName)
	{
		if(element && !((new RegExp("\\b"+cName+"\\b","i")).test(element.className))) element.className += ' '+cName;
		return element;
	},
	/**
	* Удаляет класс  обьекта *
	* @param {DOMObject}
	* @param {String} 		Имя класса
	* @return {DOMObject}
	*/
	removeClass:function(element,cName)
	{
		if(element) element.className = element.className.replace((new RegExp("\\b"+cName.split('|').join('\\b|\\b')+"\\b","i")),'');
		return element;
	},
	toggleClass:function(element,cName,newName)
	{
		if(element) element.className = element.className.replace((new RegExp("\\b"+cName.split('|').join('\\b|\\b')+"\\b","i")),newName);
		return element;
	},
	/**
	* Проверка элимента является ли он обьектом класса cName 
	*/
	ifClass:function(element,cName)
	{
		if(!element) return false;
		return (new RegExp("\\b"+cName.split('|').join('\\b|\\b')+"\\b","i")).test(element.className);
	},
	/**
	* Задать прозрачность елименту
	*/
	opacity:function(element, nOpacity)
	{
		var opacity = (function()
		{
			if (typeof document.body.style.opacity == 'string') // CSS3 compliant 
				return function(element, nOpacity) {element.style['opacity'] = nOpacity};
			else if (jsFW.browser.mozilla)return function(element, nOpacity) {element.style['MozOpacity'] = nOpacity};
			else if (jsFW.browser.safari) return function(element, nOpacity) {element.style['KhtmlOpacity'] = nOpacity};
			else if (jsFW.browser.msie && jsFW.browser.version >5.5) // Internet Exploder 5.5+
			{
				return function(element, nOpacity) {
					nOpacity *= 100;
					// Если уже установлена прозрачность, то меняем её через коллекцию filters, иначе добавляем прозрачность через style.filter
					var oAlpha = element.filters['DXImageTransform.Microsoft.alpha'] || element.filters.alpha;
					if (oAlpha) oAlpha.opacity = nOpacity;
					else element.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+nOpacity+")"; // Для того чтобы не затереть другие фильтры используем "+="
				};
			}
			else
				return function(){}; //нет прозрачности
		})();
		jsFW.element.opacity = opacity;
		opacity.call(this,element, nOpacity);
	},
	/**
	* Получение позиции курсора в элименте
	*/
	getCaretPos:function(el)
	{
		if(jsFW.browser.msie)
		{
			var tr = document.selection.createRange().duplicate();
			var ntr = el.createTextRange();
			tr.move("character", 0);
			ntr.move("character", 0);
			try {
				// If control doesnt have focus, you get an exception.
				// Seems to happen on reverse-tab, but can also happen on tab (seems to be a race condition - only happens sometimes).
				// There appears to be no workaround for this - googled for quite a while.
				ntr.setEndPoint("EndToEnd", tr);
				return String(ntr.text).replace(/\r/g, "").length;
			} catch (e) {}
			return 0;
		}
		return el.selectionStart;
	},
	getCaretPosHtml:function(el)
	{
		if(jsFW.browser.msie)
		{
			var sel = document.selection.createRange();
			var clone = sel.duplicate();
			sel.collapse(true);
			clone.moveToElementText(el);
			clone.setEndPoint('EndToEnd', sel);
			return clone.text.length;
		}
		return 0;
	},
	/**
	* Установка курсора
	*/
	setCursor:function(el,start,len)
	{
		var s = start || 0;
		var end = s + (len || 0);
		el.focus();
		if (el.setSelectionRange) { // Mozilla
			el.setSelectionRange(s, end);
		}
		else if (el.createTextRange) { // IE
			var range = el.createTextRange();
			range.moveStart('character', s);
			//alert(end-el.value.length);
			range.moveEnd('character',end-el.value.length);
			range.select();
		}
	},
	offset:function(el,parent)
	{
		
		var obj=el,ww = obj.offsetWidth, hh = obj.offsetHeight;
		for (var xx = 0,yy = 0; obj != null && obj != parent;)
		{
			xx += obj.offsetLeft-obj.scrollLeft;
			yy += obj.offsetTop-obj.scrollTop;
			obj = obj.offsetParent
		}
		return {left:xx, top:yy, right:xx + ww, bottom:yy + hh};
	},
	css:function(el)
	{
		var o = jsFW.element(el);
		if(o)
		{
			var p = arguments[1];
			if(typeof p == 'object')
				jsFW.hash.extend(o.style,p);
			else if(arguments.length == 2)
				return App.getCss(o,p);
			else
				o.style[p] = arguments[2];
		}
		return o;
	},
	getCss:function(el,prop)
	{
		if(elem = jsFW.element(el))
		{
			if (document.defaultView && document.defaultView.getComputedStyle)
			{
				if (prop.match(/[A-Z]/)) prop = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
				return document.defaultView.getComputedStyle(elem, "").getPropertyValue(prop);
			}
			// external stylesheet for Explorer and Opera 9
			if (elem.currentStyle)
			{
				var i;
				while ((i=prop.indexOf("-"))!=-1) prop = prop.substr(0, i) + prop.substr(i+1,1).toUpperCase() + prop.substr(i+2);
				return elem.currentStyle[prop];
			}
		}
		return "";
	},
	hitTest:function(el,x,y)
	{
		var p = jsFW.element.offset(el);
		var w = el.offsetWidth;
		var h = el.offsetHeight;
		return (p.left < x && x < p.left+w && p.top < y && y < p.top + h);
	},
	replace:function(n1,n2)
	{
		var r1 = n1.nextSibling,p1 = n1.parentNode;
		if(p1)
		{
			if(r1)p1.insertBefore(n2,r1);
			else p1.appendChild(n2);
			p1.removeChild(n1);
		}
		return n2;
	},
	next:function(el,tag,cName)
	{
		var next = el.nextSibling;
		tag = tag.toLowerCase();
		for(;next && next.tagName.toLowerCase() != tag && !(cName && jsFW.element.ifClass(next,cName));next = obj.nextSibling);
		return next;
	}
});

jsFW.fx = function(){};
jsFW.hash.extend(jsFW.fx,{
	/**
	* Выполняет функцию переодически с параметрами изменяющимися от start до end
	* @param {Array} Начальные значения
	* @param {Array} Конечные значения
	* @param {Object} Опции {time:int,fps:int,oncalbackStart:function(p:Array),oncalback:function(p:Array),oncalbackEnd:function(p:Array)}
	* @return {Function} Возврощает саму себя для построение цепочек анимации  jsFW.fx.animate()()()()
	*/
	animate:function()
	{
		var list = [],end_anime=false;
		function step_animate(start,end,options,sender)
		{
			var s = start,
				o = jsFW.hash.extend({
					time:1000,
					fps:30
				},options)
				step = o.time*o.fps/1000,
				to = 1000/o.fps,
				send = sender || window,
				d = s.map(function(v,i){return (this[i]-v)/step;},end),
				sum = function(v,i){return v+this[i]};
			if(o.oncalbackStart) o.oncalbackStart.call(send,s);
			(function()
			{
				s = s.map(sum,d);
				if(o.oncalback) o.oncalback.call(send,s);
				if(--step) setTimeout(arguments.callee,to);
				else
				{
					if(o.oncalbackEnd) o.oncalbackEnd.call(send,s);
					if(list.length>0)
					{
						var arg = list[0];
						arg[2] = jsFW.hash.extend(o,arg[2]);
						step_animate.apply(this,arg);
						list.splice(0,1);
					}
					else
						end_anime = true; 
				}
			})();
		}
		step_animate.apply(this,arguments);
		return function()
		{
			if(end_anime) step_animate.apply(this,arguments);
			else list.push(Array.prototype.slice.call(arguments,0));
			return arguments.callee;
		}
	},
	/**
	* Маргание обьектом
	*/
	blink:function(element,o)
	{
		if(element.blink) return;
		var o = jsFW.hash.extend({
			count:5,
			time:500
		},o);
		element.blink = true;
		(function()
		{
			if(element.style.visibility == 'hidden')
			{
				element.style.visibility = '';
				if(o.count == 0)
				{
					delete element.blink;
					return;
				}
			}
			else
			{
				element.style.visibility = 'hidden';
				o.count--;
			}
			if(element.blink) setTimeout(arguments.callee,o.time);
		})();
        return {
            stop:function()
            {
                delete element.blink;
            }
        }
	}
});

(function()
{
	var displayblock;
	var displayBody;
	var tagSelect;
	var isBlock = false;
	jsFW.displayBlock = function(o)
	{
		if(isBlock) return;
		var o = o ||{};
		displayBody = jsFW.element('body');
		if(!displayblock)
		{
			displayblock = jsFW.element.create("div",{style:{display:'block',className:'fixed',width:'100%',height:'100%',position:(jsFW.browser.msie && jsFW.browser.version < 7)?'absolute':'fixed',top:'0',left:'0',zIndex:'100'}},document.body);
		}
		else
			document.body.appendChild(displayblock);
		displayblock.style.height = document.body.clientHeight + "px";
		jsFW.element.opacity(displayblock,o.opacity || 1.0);
		displayblock.style.backgroundColor = o.backgroundColor==undefined?'#BEBEBE':o.backgroundColor;
		if(o.onclick) displayblock.onclick = o.onclick;
		if(!o.opacity && o.backgroundColor!='') displayBody.style.display = 'none';
		if(jsFW.browser.msie && jsFW.browser.version < 7)
		{
			tagSelect = [];
			$.getTag('select','*',function(el)
			{
				tagSelect.push(el);
				el.style.visibility = 'hidden';
			});
		}
	};
	jsFW.displayUnblock = function()
	{
		if(displayblock)
		{
			jsFW.element.remove(displayblock);
			displayblock.onclick =null;
			if(displayBody)
			{
				displayBody.style.display = '';
				displayBody.style.overflow = '';
			}
		}
		if(tagSelect)
		{
			for(var i=0,len = tagSelect.length;i<len;i++)
			{
				tagSelect[i].style.visibility = '';
			}
			tagSelect = false;
		}
	};
})();
jsFW.HttpRequest = jsFW.Class(function(){
return {
	__constructor:function(o)
	{
		this.async = true;
		this.method = 'post';
		this.type = 'text';
		this.timeout = 1000;
		jsFW.hash.extend(this,o);
		this.dfailed = jsFW.delegate(this,this.failed);
		this.dProcessReqChange = jsFW.delegate(this,this.processReqChange);
	},
	processReqChange:function()
	{
		try {if (this.req.readyState == 4) {
				if (this.req.status == 200) this.success(); // todo вернут равенство
				else this.failed(this.req.status);
			}}
		catch(e) {
			this.failed(e);
			//throw e;
		}
	},
	createRequest:function()
	{
		if (window.XMLHttpRequest) {
			try {
				this.req = new XMLHttpRequest();
			} catch (e){}
		} else if (window.ActiveXObject) {
			try {
				this.req = new ActiveXObject('Msxml2.XMLHTTP');
			} catch (e){
				try {
					this.req = new ActiveXObject('Microsoft.XMLHTTP');
				} catch (e){return ;}
			}
		}
		this.req.onreadystatechange = this.dProcessReqChange;
		
	},
	failed:function(error)
	{
		if(this.itimeout) clearTimeout(this.itimeout);
		this.callEvent('onfailed',[error]);
		this.callEvent('onload',[error,false]);
	},
	getStatus:function()
	{
		return this.req.status;
	},
	getStatusText:function()
	{
		return this.req.statusText;
	},
	getData:function()
	{
		var data = null;
		function toXml(s, doc) {
			if (window.ActiveXObject) {
				doc = new ActiveXObject('Microsoft.XMLDOM');
				doc.async = 'false';
				doc.loadXML(s);
			}
			else
				doc = (new DOMParser()).parseFromString(s, 'text/xml');
			return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
		};
		if(this.type == 'xml')
		{
			data = this.req.responseXML;
			if (!data && this.req.responseText != null) data = toXml(this.req.responseText);
		}
		else if(this.type == 'json')
			data = eval('('+this.req.responseText+')');
		else
			data = this.req.responseText;
		
		return data;
	},
	success:function()
	{
		if(this.itimeout) clearTimeout(this.itimeout);
		try
		{
			var data = this.getData();
			this.callEvent('onsuccess',[data]);
			this.callEvent('onload',[data,true]);
		}catch(e)
		{
			console.dir(e)
			this.failed(e);
		}
	},
	send:function(url,param)
	{
		if('string' != typeof url)
		{
			param = url;
			url = this.url;
			if(!url) throw new Error('Не указан url');
		}
		this.createRequest();
		
		var a = url.split('?');
		url = a[0];
		if(a[1]) param = jsFW.hash.extend(jsFW.hash.fromHttpStr(a[1]),param);
		param = jsFW.hash.toHttpStr(param) || null;
		if(!this.callEvent('onsend',[param])) return;
		if(param && this.method.toLowerCase()=='get'){
			url += '?'+param;
			param = null;
		}
		var method = param?this.method:'get';
		this.req.open(method,url,this.async);
		if(param) this.req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		this.req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		this.req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		this.req.send(param);
		if(this.timeout) this.itimeout = setTimeout(this.dfailed,this.timeout);
		return this;
	}
}},jsFW.Object);

jsFW.HttpRequest.submit = function(o)
{
	(new jsFW.HttpRequest({url:o.url,type:o.type,method:o.method || 'post'}))
		.addEvent('onsuccess',o.success)
		.addEvent('onfailed',o.failed)
		.addEvent('onload',o.load)
		.send(o.param);
}

jsFW.FormHttpRequest = jsFW.Class(function(){
	FormHttpRequestId = 0;
	function submit()
	{
		this.callEvent('onsubmit');
		this.send();
		return false;
	}
	function initSubmit()
	{
		if(this.form)
		{
			jsFW.event.add(this.form,'onsubmit',jsFW.delegate(this,submit));
		}
	}
	return {
		__constructor:function(form,o)
		{
			this.__base([o]);
			this.form = form;
			initSubmit.call(this);
		},
		createRequestForm:function()
		{
			this.req = {
			responseText: null,
			responseXML: null,
			status: 0,
			statusText: 'n/a',
			getAllResponseHeaders: function() {},
			getResponseHeader: function() {},
			setRequestHeader: function() {}
			};
		},
		onSubmit:function()
		{
			for(var i=0,input = this.form.getElementsByTagName('input'),len = input.length;i<len;i++)
				if(input[i].type == 'submit') input[i].disabled = false;
		},
		offSubmit:function()
		{
			for(var i=0,input = this.form.getElementsByTagName('input'),len = input.length;i<len;i++)
				if(input[i].type == 'submit') input[i].disabled = true;
		},
		getParam:function(form,isform)
		{
			var form = form || this.form;
			var res = {};
			var elements = form.elements;
			function add(name,value)
			{
				if(!name) return;
				if(res[name])
				{
					if(!(res[name] instanceof Array)) res[name] = [res[name]];
					res[name].push(value);
				}
				else
					res[name] = value;
			}
			for(var i=0,len=elements.length;i<len;i++)
			{
				var el = elements[i];
				switch(el.type)
				{
					case 'file': 
						if(isform) return false;
						add(el.name,el.value);
						break;
					case 'checkbox':
					case 'radio':
						if(!el.checked) continue;
					default:
						add(el.name,el.value);
				}
			}
			return res;
		},
		success:function()
		{
			this.onSubmit();
			return jsFW.HttpRequest.prototype.success.apply(this,arguments);
		},
		failed:function()
		{
			this.onSubmit();
			return this.__base('failed');
		},
		send:function(url,form)
		{
			var form = form || this.form;
			this.form = form;
			this.offSubmit();
			if(!form) return;
			var param = this.getParam(form,true);
			if(param)
			{
				return this.__base('send',[url || form.action,param]);
			}
			else
			{
				if(!this.callEvent('onsend',[param])) return;
				this.createRequestForm();
			}
			var id = 'jqFormIO' + FormHttpRequestId++;
			var io = jsFW.element.create('<iframe id="' + id + '" name="' + id + '" />',{style:{position:'absolute',top: '-1000px',left: '-1000px'}},document.body);
			var op8 = jsFW.browser.opera && window.opera.version() < 9;
			if (jsFW.browser.msie || op8) io.src = 'javascript:false;document.write("");';
			var cbInvoked = 0;
			var _this = this;
			jsFW.event.add(io,'onload',function()
			{
				if (cbInvoked++) return;
				jsFW.event.remove(io,'onload',arguments.callee);
				try
				{
					var doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;
					_this.req.responseText = doc.body ? doc.body.innerHTML : null;
					_this.req.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
					_this.success();
				}
				catch(e)
				{
					_this.failed(e);
					throw e;
				}
				setTimeout(function() {
					jsFW.element.remove(io);
				}, 100);
			});
			
			var encAttr = form.encoding ? 'encoding' : 'enctype';
			var t = form.target;
			form.target = id;
			form.method = 'POST';
			if(url) form.action = url;
			form[encAttr] = 'multipart/form-data';
			form.submit();
			form.target = t; // reset target
		}
	};
},jsFW.HttpRequest);
/** Источник данных
*/
jsFW.DataSource = jsFW.Class(function(){
	function getData(data,path)
	{
		if(path) data = path.split('/').reduce(function(a,c)
        {
            if(!a) return false;
            if(a instanceof Array)
            {
                var conf = c.indexOf('=');
                if(conf>=0)
                {
                    var i = a.indexOfKey(c.substr(conf+1),c.substr(0,conf));
                    if(i>=0) return a[i];
                    return false;
                }
            }
            return a[c];
        },data);
		return data;
	}
	return {
		__constructor:function(data,path){
			if(data)
			{
				if(data instanceof jsFW.DataSource) this.data = data.getData(path);
				else this.data = getData(data,path)
			}
		},
		getData:function(path)
		{
			return getData(this.data,path);
		},
		setData:function(data,path)
		{
			if(path){
				path = path.split('/')
				var end = path.pop();
                var a = this.getData(path.join('/'));
                if(a instanceof Array)
                {
                    var conf = c.indexOf('=');
                    if(conf>=0)
                    {
                        end = a.indexOfKey(c.substr(conf+1),c.substr(0,conf));
                        if(end<0) return false;
                    }
                }
				a[end] = data;
			}
			else this.data = data;
			this.callEvent('onchange',[data,path]);
		},
		each:function(iter,s,path)
		{
			var data = this.getData(path);
			if(data instanceof Array)
			{
				for(var key=0,len=data.length;key<len;key++) iter.call(s,data[key],key,this,path);
			}else if('object' == typeof data)
			{
				for(var key in data) iter.call(s,data[key],key,this,path);
			}
			return this;
		}
	}
},jsFW.Object);

jsFW.JsonLoader = jsFW.Class(function()
{
	function eSucces(req,data)
	{
		var lm = data._lm || req.req.getResponseHeader('Date');
		this.lm = lm?new Date(lm):new Date();
		if(data)
		{
			if(this.appendData)
			{
				this.data = jsFW.hash.unite(this.data,data);
				this.callEvent('onchange',[data]);
			}
			else
				this.setData(data,this.path);
			this.callEvent('onload',arguments);
		}
        if(this.o.loader) this.o.loader.hide();
	};
	function efailed(){
        if(this.o.loader) this.o.loader.hide();
		this.callEvent('onfailed',arguments);
	};
	function synchronize()
	{
		this.load(null,this.params,false,true);
	}
	return {
		__constructor:function(o)
		{
			this.o = jsFW.hash.extend({
				method:'post',
				timeSynchronize:10000,
				synchronize:false
			},o);
			this.__base([this.o.data,this.o.path]);
			this.req = new jsFW.HttpRequest({method:this.o.method,type:'json'});
			this.req.addEvent('onsuccess',jsFW.delegate(this,eSucces));
			this.req.addEvent('onfailed',jsFW.delegate(this,efailed));
		},
		// Обнавить данные
		update:function()
		{
			this.load(null,this.params);
		},
		// Загрузить данные
		load:function(url,params,path,lm)
		{
			this.url = url || this.o.url;
			if(this.url)
			{
				this.params = params;
                this.path = path;
				var params = jsFW.hash.extend({},this.o.params,params);
				if(lm && this.lm) 
				{
					params['_lm'] = this.lm.getFullYear()+'-'
					+(this.lm.getMonth()+1)+'-'
					+this.lm.getDate()+' '
					+this.lm.getHours()+':'
					+this.lm.getMinutes()+':'
					+this.lm.getSeconds();
					this.appendData = true;
				}
				else
				{
					delete params['_lm'];
					this.appendData = false;
				}
				if(this.o.synchronize)
				{
					if(this.timeout) clearTimeout(this.timeout);
					this.timeout = setTimeout(jsFW.delegate(this,synchronize),this.o.timeSynchronize);
				}
                if(this.o.loader) this.o.loader.show();
				this.req.send(this.url,params);
			}
		}
	}
},jsFW.DataSource);

jsFW.BackForward = jsFW.Class({
    __constructor:function(){
        this._back = [];
        this._forward = [];
        this._curent;
    },
    isBack:function()
    {return this._back.length>0;},
    isForward:function()
    {return this._forward.length>0;},
    forward:function(){
        if(this.isForward())
        {
            this._back.push(this._curent);
            this._curent = this._forward.pop();
        }
        this.callEvent('onchang');
        return this._curent;
    },
    back:function(){
        if(this.isBack())
        {
            this._forward.push(this._curent);
            this._curent = this._back.pop();
        }
        this.callEvent('onchang');
        return this._curent;
    },
    set:function(curent){
        if(this._curent!=curent)
        {
            if(this._curent!=undefined) this._back.push(this._curent);
            this._forward = [];
            this._curent = curent;
            this.callEvent('onchang');
        }
        return this._curent;
    }
},jsFW.Object);
/**
* AOP
*/
(function(){
function attach(object,filter,link)
{
	var test;
	if(filter.exec) test = function(name){return filter.exec(name)};
	else if(filter.call) test = function(name){return filter.call(this,name)};
	if(test){
		for(var method in object){
			if(test.call(object,method)){
				object[method] = link(object[method]);
			}
		}
	}else{
		filter = filter.split('|');
		for(var i=0,len=filter.length;i<len;i++)
			object[filter[i]] = link(object[filter[i]]);
	}
};
jsFW.aspects = {
	// До
	before:function(object,filter,before)
	{
		var link = function(orig){
			return function(){
				return orig.apply(this, before(arguments, orig, this));
			}
		};
		attach(object,filter,link);
	},
	// После
	after:function(object,filter,after)
	{
		var link = function(orig){
			return function(){
				return after(orig.apply(this, arguments), arguments, orig, this);
			}
		};
		attach(object,filter,link);
	},
	// Вместо
	around:function(object,filter,around)
	{
		 var link = function(orig) {
			return function() {
				return around(arguments, orig, this);
			}
		};
		attach(object,filter,link);
	}
}
})();

jsFW.sclanenie = function(number,arText)
{
	var l = ''+number;
	l = parseInt(l[l.length-1],10);
	if(l == 1) return arText[0];
	else if(l>1 && l<6) return arText[1]
	else return arText[2];
}

/**
* Выполняет функцию после полной загрузки страницы
* @param {Function}		Функция которую нужно выполнить
*/
jsFW.ready = function(fun)
{
	if(jsFW.ready.is_ready) fun.call();
	else jsFW.event.add(jsFW.ready,'onready',fun);
};
jsFW.ready.onloading = function()
{
	jsFW.event.call(jsFW.ready,'onready');
	jsFW.event.remove(jsFW.ready);
	jsFW.ready.is_ready = true;
};
(function(){
	if (jsFW.browser.msie && window == top )
	{
		try {document.documentElement.doScroll("left");
		} catch(e){setTimeout( arguments.callee, 0 );return;}
		jsFW.ready.onloading();
	}
	if (document.addEventListener)document.addEventListener("DOMContentLoaded",jsFW.ready.onloading, false );
})();

/** Simple JavaScript Templating *
*  John Resig - http://ejohn.org/ - MIT Licensed *
* @exsample 
*	<script type="text/html" id="item_tmpl">
*	  <div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "")%>">
*		<div class="grid_1 alpha right">
*		  <img class="righted" src="<%=profile_image_url%>"/>
*		</div>
*		<div class="grid_6 omega contents">
*		  <p><b><a href="/<%=from_user%>"><%=from_user%></a>:</b> <%=text%></p>
*		</div>
*	  </div>
*	</script>
*	var results = document.getElementById("results");
*	results.innerHTML = tmpl("item_tmpl", dataObject);
*	var show_user = tmpl("item_tmpl"), html = "";
*	for ( var i = 0; i < users.length; i++ ) {
*		 html += show_user( users[i] );
*	}
*/
(function(){
	var cache = {};
	jsFW.tmpl = function tmpl(str, data){
	// Выяснить, мы получаем шаблон или нам нужно его загрузить
	// обязательно закешировать результат
	var fn = !/\W/.test(str) ?
	  cache[str] = cache[str] ||
		jsFW.tmpl(document.getElementById(str).innerHTML) :
 
	  // Сгенерировать (и закешировать) функцию, 
	  // которая будет служить генератором шаблонов
	  new Function("obj",
		"var p=[],print=function(){p.push.apply(p,arguments);};" +
 
		// Сделать данные доступными локально при помощи with(){}
		"with(obj){p.push('" +
 
		// Превратить шаблон в чистый JavaScript
		str
			.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'")
		+ "');}return p.join('');");
	return data ? fn( data ) : fn;
  };
})();
String.prototype.lambda = function(){	return jsFW.lambda(this);};

jsFW.aspects.before(Array.prototype,'reduce|map|filter|each|sort|find',function(arg)
{
	if('string' == typeof arg[0]) arg[0] = arg[0].lambda(); 
	return arg;
});
/**
*  Сокращения *
*/
var jsfw = jsFW;
var $ = jsFW.element;
var $C = jsFW.Class;
var $e = jsFW.event;
var $h = jsFW.hash;
var $extend = jsFW.hash.extend;
var $d = jsFW.delegate;
var $m = {x:0,y:0};
jsFW.ready(function(){$e.add(document.body,'onmousemove',function(e){$m = {x:e.clientX,y:e.clientY}})});