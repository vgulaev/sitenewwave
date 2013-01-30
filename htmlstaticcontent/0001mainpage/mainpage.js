(function($) {
	$.oSlideshow = function(options) {
		$.extend($.oSlideshow.conf, options || {});
		this.oImage = ($.oSlideshow.conf['imageContSelector']) ? $($.oSlideshow.conf['imageContSelector']) : {};
		this.oTitle = ($.oSlideshow.conf['titleContSelector']) ? $($.oSlideshow.conf['titleContSelector']) : {};
		this.oText = ($.oSlideshow.conf['textContSelector']) ? $($.oSlideshow.conf['textContSelector']) : {};
		this.aData = [];
		this.iCurrentIndex = 0;
		this.iMaxIndex = 0;
		this.intervalId = null;
		this.init()
	};
	$.oSlideshow.conf = {
		'imageContSelector' : '.obj-photoreports-image',
		'titleContSelector' : '.obj-photoreports-desc h2',
		'textContSelector' : '.obj-photoreports-desc p',
		'switcherItemSelector' : '.obj-photoreports-item',
		'activeClassName' : 'active',
		'slideshow' : true,
		'interval' : 5000,
		'duration' : 500
	};
	$.oSlideshow.prototype.init = function() {
		var oSelf = this;
		$($.oSlideshow.conf['switcherItemSelector']).each(function(i) {
			var oImg = $(this).find('img'), oLink = $(this), sImage = oLink.attr('href'), sTitle = oImg.attr('alt'), sText = oLink.attr('title');
			oSelf.aData[i] = {
				'image' : sImage,
				'title' : sTitle,
				'text' : sText
			};
			oImg.click(function() {
				oSelf.setActiveItem(i);
				if (true == $.oSlideshow.conf['slideshow']) {
					if (null != oSelf.intervalId) {
						clearInterval(oSelf.intervalId)
					}
					oSelf.intervalId = setInterval(function() {
						oSelf.showNextItem()
					}, $.oSlideshow.conf['interval'])
				}
				return false
			})
		});
		oSelf.iMaxIndex = oSelf.aData.length - 1;
		if (true == $.oSlideshow.conf['slideshow']) {
			oSelf.intervalId = setInterval(function() {
				oSelf.showNextItem()
			}, $.oSlideshow.conf['interval'])
		}
	};
	$.oSlideshow.prototype.showNextItem = function() {
		this.iCurrentIndex++;
		if (this.iCurrentIndex > this.iMaxIndex) {
			this.iCurrentIndex = 0
		}
		this.setActiveItem(this.iCurrentIndex)
	};
	$.oSlideshow.prototype.setActiveItem = function(num) {
		$($.oSlideshow.conf['switcherItemSelector']).removeClass($.oSlideshow.conf['activeClassName']);
		$($.oSlideshow.conf['switcherItemSelector']).eq(num).addClass($.oSlideshow.conf['activeClassName']);
		this.oImage.prepend('<img src="' + this.aData[num].image + '" />').find('img:eq(1)').fadeOut($.oSlideshow.conf['duration'], function() {
			$(this).remove()
		});
		this.oTitle.text(this.aData[num].title);
		this.oText.text(this.aData[num].text);
		this.iCurrentIndex = num
	};
	$.fn.extend({
		slideshow : function(options) {
			new $.oSlideshow(options)
		}
	})
})(jQuery);

function makeslideshowathead() {
	if ($('.slideshow').length > 0) {
		$('.slideshow').slideshow({
			'imageContSelector' : '#post-header',
			'switcherItemSelector' : '.slideshow-switcher a'
		})
	}
}

function toggleTabs(){
	$("div#catalog-tab1").toggle()
	$("div#catalog-tab2").toggle()
}

$("a.catalog-tab1").click( toggleTabs() )
$("a.catalog-tab2").click( toggleTabs() )