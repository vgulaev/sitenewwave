(function($) {
	$.widget("ui.combobox", {
		_create : function() {
			var input, that = this, select = this.element.hide(), selected = select.children(":selected"), value = selected.val() ? selected.text() : "", wrapper = this.wrapper = $("<span>").addClass("ui-combobox").insertAfter(select);

			function removeIfInvalid(element) {
				var value = $(element).val(), matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(value) + "$", "i"), valid = false;
				select.children("option").each(function() {
					if ($(this).text().match(matcher)) {
						this.selected = valid = true;
						return false;
					}
				});
				if (!valid) {
					// remove invalid value, as it didn't match anything
					$(element).val("").attr("title", value + " didn't match any item").tooltip("open");
					select.val("");
					setTimeout(function() {
						input.tooltip("close").attr("title", "");
					}, 2500);
					input.data("autocomplete").term = "";
					return false;
				}
			}

			input = $("<input>").appendTo(wrapper).val(value).attr("title", "").addClass("ui-state-default ui-combobox-input").autocomplete({
				delay : 0,
				minLength : 0,
				source : function(request, response) {
					var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
					response(select.children("option").map(function() {
						var text = $(this).text();
						if (this.value && (!request.term || matcher.test(text) ))
							return {
								label : text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
								value : text,
								option : this
							};
					}));
				},
				select : function(event, ui) {
					ui.item.option.selected = true;
					that._trigger("selected", event, {
						item : ui.item.option
					});
				},
				change : function(event, ui) {
					if (!ui.item)
						return removeIfInvalid(this);
				}
			}).addClass("ui-widget ui-widget-content ui-corner-left");

			input.data("autocomplete")._renderItem = function(ul, item) {
				return $("<li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul);
			};

			$("<a>").attr("tabIndex", -1).attr("title", "Show All Items").tooltip().appendTo(wrapper).button({
				icons : {
					primary : "ui-icon-triangle-1-s"
				},
				text : false
			}).removeClass("ui-corner-all").addClass("ui-corner-right ui-combobox-toggle").click(function() {
				// close if already visible
				if (input.autocomplete("widget").is(":visible")) {
					input.autocomplete("close");
					removeIfInvalid(input);
					return;
				}

				// work around a bug (likely same cause as #5265)
				$(this).blur();

				// pass empty string as value to search for, displaying all results
				input.autocomplete("search", "");
				input.focus();
			});

			input.tooltip({
				position : {
					of : this.button
				},
				tooltipClass : "ui-state-highlight"
			});
		},

		destroy : function() {
			this.wrapper.remove();
			this.element.show();
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);

function printlist() {
	/*$.ajax({
		type : "POST",
		url : "itemtable.py",
		async : true,
		data : {
			"likecondition" : $("#searchstring").val()
		},
		success : function(html) {
			$("#main").html(html)
		}
	})*/
	createCookie("locate","ru",10);
	//createCookie("locate","ru",10);
}

function filled_options_from_string(selectid, html) {
	optionsforapend = html.split(" ");
	addedIndex = 0;
	for (el in optionsforapend) {
		if ($.trim(optionsforapend[el]) != "") {
			options = document.createElement("option");
			options.value = optionsforapend[el];
			text = document.createTextNode(optionsforapend[el]);
			options.appendChild(text);
			$(selectid.jqueryid).append(options);
			addedIndex = addedIndex + 1;
		}
		;
	}
	if (addedIndex == 0) {
		$(selectid.jqueryid).remove()
	} else if (addedIndex == 1) {
		$(selectid.jqueryid).val(options.value);
		add_selector();
	}
	;
	// $("#main").html(html);
}

function filed_options_for_seperator_id(selectid) {

	if (document.URL == "http://127.0.0.1:8020/sitenewwave/onlineservices/index.html") {
		str1 = "Арматура Балка Воронка Ендова";
		str2 = "Желоб Заглушка Квадрат";
		str3 = "Колено Конек Кронштейн";
		if (selectid.jqueryid == "#selector1") {
			filled_options_from_string(selectid, str1);
		} else if (selectid.jqueryid == "#selector2") {
			filled_options_from_string(selectid, str2);
		} else {
			filled_options_from_string(selectid, str3);
		}
	}
	;

	fullnamecondition = "";
	orderindex = selectid.intid;

	$("#searchPanel> select").each(function(index, el) {
		if (el.value != "null") {
			fullnamecondition = fullnamecondition + el.value + "%";
		}
	});

	if (fullnamecondition == "")
		fullnamecondition = "%";
	//fullnamecondition = $.trim(fullnamecondition) + "%";

	if (document.URL == "http://tdymk.ru/onlineservices/index.html") {
		$.ajax({
			type : "POST",
			url : "getwords.py",
			async : true,
			data : {
				"fullnamecondition" : fullnamecondition,
				"orderindex" : selectid.intid
			},
			success : function(html) {
				filled_options_from_string(selectid, html);
			}
		})
	}
}

function onchange_selector(el) {
	selectorIndex = parseInt($("#searchPanel").attr("selectorIndex"));
	currentIndex = parseInt(el.getAttribute("index"));
	for (var i = currentIndex + 1; i < selectorIndex + 1; i++) {
		$("#selector" + i.toString()).remove();
	};
	$("#searchPanel").attr("selectorIndex", currentIndex)
	if (el.value != "null")
		add_selector();
}

function add_selector() {

	selectorIndex = parseInt($("#searchPanel").attr("selectorIndex"))
	var selectorid = {
		intid : selectorIndex + 1,
		strid : "selector" + (selectorIndex + 1).toString(),
		jqueryid : "#selector" + (selectorIndex + 1).toString()
	}
	idselector = selectorid.strid;
	selectorbody = document.createElement("select");
	selectorbody.setAttribute("id", selectorid.strid)
	selectorbody.setAttribute("index", selectorid.intid)

	options = document.createElement("option");
	options.value = "null";
	text = document.createTextNode("Выбери что ни будь");
	options.appendChild(text);
	selectorbody.appendChild(options);

	$("#searchPanel").append(selectorbody);

	$("#searchPanel").attr("selectorIndex", selectorid.intid)

	$(selectorid.jqueryid).addClass("beautifulselector");
	$(selectorid.jqueryid).change(function() {
		onchange_selector(this);
	});

	optionsforapend = filed_options_for_seperator_id(selectorid);

	//$( selectorid.jqueryid ).combobox();
}

function managesearchPanel() {
	add_selector();
}