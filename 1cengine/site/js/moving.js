// Generated by CoffeeScript 1.8.0
(function() {
  var exclude_parameters, get_item_list, get_item_table, get_parameters, get_subgroup, group_click, group_menu_back, showGroup2, show_dop_uslugi, show_how_to_make_order, show_rezka, switch_tabs, tabs, tabs_dict;

  Array.prototype.toDict = function(key) {
    return this.reduce((function(dict, obj) {
      if (obj[key] != null) {
        dict[obj[key]] = obj;
      }
      return dict;
    }), {});
  };

  tabs = [
    {
      id: "tabBasket",
      other: ["basketDiv", "showPriceSpan"],
      counter: ["tabPrice"]
    }, {
      id: "tabPrice",
      other: ["pTableContentTab", "showBasketSpan"],
      counter: ["tabBasket"]
    }, {
      id: "closeBasket",
      other: ["pTableContentTab", "showBasketSpan"],
      counter: ["tabBasket"]
    }, {
      id: "switchOrderDiv",
      other: ["orderDiv", "showNDSlabel"],
      counter: ["switchDeliveryDiv", "switchNotificationDiv"],
      active_class: "activeDiv",
      inactive_class: "inactiveDiv"
    }, {
      id: "switchDeliveryDiv",
      other: ["deliveryDiv"],
      counter: ["switchOrderDiv", "switchNotificationDiv"],
      active_class: "activeDiv",
      inactive_class: "inactiveDiv"
    }, {
      id: "switchNotificationDiv",
      other: ["notificationDiv"],
      counter: ["switchOrderDiv", "switchDeliveryDiv"],
      active_class: "activeDiv",
      inactive_class: "inactiveDiv"
    }
  ];

  tabs_dict = tabs.toDict("id");

  switch_tabs = function(id) {
    var counter, counters, other, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    counters = tabs_dict[id]["counter"];
    for (_i = 0, _len = counters.length; _i < _len; _i++) {
      counter = counters[_i];
      _ref = tabs_dict[counter]["other"];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        other = _ref[_j];
        $("#" + other).hide();
      }
      if (tabs_dict[counter]["active_class"]) {
        $("#" + tabs_dict[counter]['id']).removeClass(tabs_dict[counter]['active_class']);
      }
      if (tabs_dict[counter]["inactive_class"]) {
        $("#" + tabs_dict[counter]['id']).addClass(tabs_dict[counter]['inactive_class']);
      }
    }
    _ref1 = tabs_dict[id]["other"];
    for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
      other = _ref1[_k];
      $("#" + other).show();
    }
    if (tabs_dict[id]["active_class"]) {
      $("#" + id).addClass(tabs_dict[id]['active_class']);
    }
    if (tabs_dict[id]["inactive_class"]) {
      return $("#" + id).removeClass(tabs_dict[id]['inactive_class']);
    }
  };

  showGroup2 = function(term) {
    $("#itemName").val(term);
    $("#itemName").change();
    return $.unblockUI();
  };

  App.load_delivery_cost = function() {
    return $.ajax({
      type: "GET",
      url: "/1cengine/json/delivery.json",
      async: false,
      data: "",
      success: function(html) {
        var cost_car, item, key, n_car, opt_string, value, _i, _len, _ref, _ref1;
        opt_string = "<option>--</option>";
        _ref = html[$(".active_city").attr("name")];
        for (key in _ref) {
          value = _ref[key];
          n_car = "Газель";
          if (App.MyBasket._total_weight > 2) {
            n_car = "Длинномер";
          } else if ($(".active_city").attr("name") === "outcity") {
            n_car = "Длинномер";
          } else {
            _ref1 = App.MyBasket._item_list;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              item = _ref1[_i];
              if (item.length > 6) {
                n_car = "Длинномер";
              }
            }
          }
          cost_car = value[n_car];
          opt_string = opt_string + ("<option value='" + cost_car + "'>" + key + "</option>");
          $(".delivery_car").html(n_car);
        }
        $(".city_select").html(opt_string);
        return $(".delivery_cost").html(0);
      }
    });
  };

  show_dop_uslugi = function(chkbox) {
    if ($(chkbox).is(":checked")) {
      $(".is_in_city").show();
      $(".city_choose").show();
      return App.load_delivery_cost();
    } else {
      $(".is_in_city").hide();
      return $(".city_choose").hide();
    }
  };

  show_rezka = function(chkbox) {
    if ($(chkbox).is(":checked")) {
      return $(".rezka_wrapper").show();
    } else {
      return $(".rezka_wrapper").hide();
    }
  };

  show_how_to_make_order = function() {
    var m_css, offset, w_height;
    offset = $("#pTableContentTab").offset();
    w_height = $(window).height() - 260;
    m_css = {
      width: '770px',
      maxHeight: w_height + "px",
      height: 'auto',
      overflow: 'auto',
      paddingTop: '10px',
      paddingRight: '20px',
      paddingBottom: '30px',
      textAlign: 'justify',
      top: '130px',
      left: offset.left + "px"
    };
    $.blockUI({
      message: "<h2>Как выписать счёт</h2>\n<p>\nУважаемый клиент,<br />\nРаздел \"купить онлайн\" представляет собой каталог, где Вы можете найти интересующий Вас металлопрокат.\nВы можете как выбрать группу номенклатуры в левом меню, так и ввести нужное наименование в строку поиска.\nЗатем нужно добавить товар в корзину - для этого достаточно нажать на значок корзины в строке номенклатуры, ввести требуемое количество и нажать кнопку \"в корзину\".\n</p><p>\nДля последующего оформления Вашего заказа нажмите на кнопку \"Корзина\", расположенную в строке со ссылками на прайс. Там Вы можете просмотреть выбранный товар с его стоимостью, выбрать доставку и резку номенклатуры, и завершить оформление заказа.\n</p><p>\nНажав на кнопку \"Оформить\", Вы отправите заказ на регистрацию в нашей системе, это займёт не больше минуты. На указанный Вами адрес электронной почты будет выслано сообщение с номером заказа и приглашением в личный кабинет, где Вы сможете увидеть текущий статус заказа. Вскоре с Вами свяжется наш менеджер, который уточнит детали заказа.\n</p><p>\nПосле чего Вам нужно оплатить и забрать покупки, или же дождаться, когда их привезут.\n</p><p>\nУдачных покупок в нашем интернет магазине.</p>\n<div class=\"closeHowToMakeOrder\">Я понял, спасибо</div>",
      css: m_css
    });
    $(".blockMsg").draggable();
    $(".closeHowToMakeOrder").click(function() {
      return $.unblockUI();
    });
    return $(document).on("keyup", function(e) {
      e.preventDefault();
      if (e.which === 27) {
        return $.unblockUI();
      }
    });
  };

  get_item_list = function(hash) {
    $("body").css("cursor", "wait");
    $("#itemName").val("");
    return $.ajax({
      type: "GET",
      url: "/1cengine/py_scripts/get_ncatalog_items.py",
      async: true,
      data: "hash=" + encodeURIComponent(hash) + "",
      success: function(html) {
        App.C_HASH = hash;
        return get_item_table(html);
      }
    });
  };

  get_subgroup = function(element, g_name, g_hash) {
    return $.ajax({
      type: "GET",
      url: "/1cengine/py_scripts/get_ncatalog_item_group.py",
      async: false,
      data: "term=" + encodeURIComponent(g_hash) + "",
      success: function(html) {
        var my_content;
        $(element).append(html);
        $(".menu_back_button").click(function() {
          return group_menu_back();
        });
        $(".sungroup_show_button").click(function() {
          return get_parameters();
        });
        $(".sidebar_checkbox").click(function() {
          return exclude_parameters(this);
        });
        my_content = $('<a href=# onClick="$(\'.sungroup_show_button\').click(); return false">Выбрать</a>');
        return $(".sidebar_checkbox").tooltipster({
          content: my_content,
          interactive: true,
          animation: 'fade',
          delay: 200,
          position: 'right',
          offsetX: 100,
          timer: 3000,
          trigger: "click",
          theme: "tooltipster-my"
        });
      }
    });
  };

  group_click = function(element) {
    return $(element).click(function() {
      var g_hash, g_name, li_element;
      li_element = $(this).parent();
      g_name = $(this).parent().attr("name");
      g_hash = $(this).parent().attr("inid");
      if ($(li_element).hasClass("active_group") === false) {
        get_item_list(g_hash);
        $("#groups_list").find("li.main_group").removeClass("active_group");
        $("li.main_group").hide();
        $(li_element).addClass("active_group");
        $(li_element).show();
      }
      if ($(li_element).children().is(".subgroup_c") === false) {
        return get_subgroup(li_element, g_name, g_hash);
      } else {
        return $(li_element).children().show();
      }
    });
  };

  group_menu_back = function() {
    $("li.main_group").show();
    $("#groups_list").find("li.main_group").removeClass("active_group");
    $(".subgroup_c").hide();
    $(".subgroup_c").find("input[type=checkbox]").prop('checked', false);
    $(".subgroup_c").find("input[type=checkbox]").prop('disabled', false);
    return $(".choice_container").removeClass("choice_disabled");
  };

  get_parameters = function() {
    var hash, params;
    params = "";
    $(".active_group").find("input[type=checkbox]:checked:enabled").each((function(_this) {
      return function(index, element) {
        return params = params + "'" + $(element).attr("name") + "',";
      };
    })(this));
    params = params + ";";
    $("#itemName").val("");
    hash = $(".active_group").attr("inid");
    return $.ajax({
      type: "GET",
      url: "/1cengine/py_scripts/get_ncatalog_items.py",
      async: true,
      data: "hash=" + encodeURIComponent(hash) + "&params=" + encodeURIComponent(params) + "",
      success: function(html) {
        App.C_HASH = hash;
        App.PAGE = 1;
        return get_item_table(html);
      }
    });
  };

  exclude_parameters = function(chk_box) {
    var hash, params, preload_header;
    preload_header = {
      backgroundImage: "url('/1cengine/nsite/images/input_preloader.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right center"
    };
    $(".choice_header").css(preload_header);
    params = "";
    $(".active_group").find("input[type=checkbox]:checked:enabled").each((function(_this) {
      return function(index, element) {
        return params = params + "'" + $(element).attr("name") + "',";
      };
    })(this));
    params = params + ";";
    $("#itemName").val("");
    hash = $(".active_group").attr("inid");
    return $.ajax({
      type: "GET",
      url: "/1cengine/py_scripts/get_excluded.py",
      async: true,
      data: "params=" + encodeURIComponent(params) + "&hash=" + encodeURIComponent(hash) + "",
      success: function(html) {
        var param_string;
        param_string = html;
        $(".active_group").find("input[type=checkbox]").each((function(_this) {
          return function(index, element) {
            $(element).parent().removeClass("choice_disabled");
            $(element).prop('disabled', false);
            if (param_string.indexOf($(element).attr("name")) > -1) {
              $(element).prop('checked', false);
              $(element).prop('disabled', true);
              return $(element).parent().addClass("choice_disabled");
            }
          };
        })(this));
        return $(".choice_header").css("background-image", "none");
      }
    });
  };

  get_item_table = function(html) {
    var params;
    $("#qRes").html(html);
    $("#qRes").fadeIn(400);
    if ($(".item").length >= 1) {
      $("#hollowResult").empty();
    } else {
      $("#hollowResult").html("<p class='hollow_result'>Извините, но по заданному запросу товар не найден</p>");
    }
    if ($(".item").length === 20) {
      $("#show_next_prev").show();
    } else {
      if (App.PAGE === 1) {
        $("#show_next_prev").hide();
      }
    }
    $("body").css("cursor", "default");
    $(".bItem").click(function() {
      var char_id, elem_id, item, nid;
      elem_id = $(this).attr("name");
      char_id = $(this).closest("table").find($(".item_billet_select_char option:selected")).attr("name");
      if (char_id === void 0) {
        char_id = "0";
      }
      nid = char_id + ":" + elem_id;
      item = App.Item.elem_exist(nid);
      if (item === false) {
        return item = new App.Item(nid);
      } else {
        return item.show_modal();
      }
    });
    $(".oItem").click(function() {
      var char_id, elem_id, item, nid;
      elem_id = $(this).attr("name");
      char_id = $(this).closest("table").find($(".item_billet_select_char option:selected")).attr("name");
      if (char_id === void 0) {
        char_id = "0";
      }
      nid = char_id + ":" + elem_id;
      item = App.Item.elem_exist(nid);
      if (item === false) {
        return item = new App.Item(nid);
      } else {
        return item.show_modal();
      }
    });
    $(".more").click(function() {
      var name;
      name = $(this).attr("name");
      $("#" + name).hide();
      $("." + name).show();
    });
    $(".less").click(function() {
      var name;
      name = $(this).attr("name");
      $("#" + name).show();
      $("." + name).hide();
    });
    $(".eye").each((function(_this) {
      return function(index, element) {
        var img_class;
        img_class = $(element).attr('class').split(' ')[1];
        return $(element).tooltipster({
          content: "<img src='images/eye_pic/" + img_class + ".png' />",
          animation: 'fade',
          position: 'top',
          trigger: "click",
          theme: "tooltipster-my",
          contentAsHTML: true
        });
      };
    })(this));
    $(".item_billet_select_char").change(function() {
      var c_button, char, stock;
      char = $(this).parent().find($(".item_billet_select_char option:selected")).attr("name");
      stock = $(this).parent().find($(".item_billet_select_char option:selected")).attr("stock");
      $(this).parent().parent().parent().parent().find($(".item_billet_select_price")).removeClass("selected_price");
      $(this).parent().parent().parent().parent().find(".item_billet_select_price").each((function(_this) {
        return function(index, element) {
          if ($(element).attr("for") === char) {
            return $(element).addClass("selected_price");
          }
        };
      })(this));
      if (stock === "0") {
        c_button = $(this).parent().parent().parent().parent().find(".bItem");
        c_button.removeClass("bItem").addClass("oItem");
        c_button.find(".buySpan").html("Под заказ");
      }
      if (stock === "1") {
        c_button = $(this).parent().parent().parent().parent().find(".oItem");
        c_button.removeClass("oItem").addClass("bItem");
        return c_button.find(".buySpan").html("Рассчитать");
      }
    });
    params = "";
    $(".active_group").find("input[type=checkbox]:checked:enabled").each((function(_this) {
      return function(index, element) {
        return params = params + "'" + $(element).attr("name") + "',";
      };
    })(this));
    params = params + ";";
    return $.ajax({
      type: "GET",
      url: "/1cengine/py_scripts/get_ncatalog_count_items.py",
      async: true,
      data: "hash=" + encodeURIComponent(App.C_HASH) + "&params=" + encodeURIComponent(params) + "",
      success: function(html) {
        var i, page_list;
        App.PAGE_COUNT = Math.ceil(html / 20);
        i = 1;
        page_list = "<ul>";
        App.PAGE;
        while (i !== App.PAGE_COUNT + 1) {
          if (i === App.PAGE) {
            page_list = page_list + ("<li name='" + i + "' class='active_page'>" + i + "</li>");
          } else {
            page_list = page_list + ("<li name='" + i + "'>" + i + "</li>");
          }
          i++;
        }
        page_list = page_list + "</ul>";
        $(".count_all_result").html(page_list);
        return $(".count_all_result").find("li").each((function(_this) {
          return function(index, element) {
            return $(element).click(function() {
              var page_needed;
              page_needed = $(this).attr("name");
              App.PAGE = page_needed - 1;
              return $(".next_result").click();
            });
          };
        })(this));
      }
    });
  };

  $(document).ready(function() {
    var c_url, is_empty, item, name, things;
    $.blockUI.defaults.css.borderRadius = '10px';
    $.blockUI.defaults.fadeIn = 100;
    $.blockUI.defaults.fadeOut = 100;
    $.blockUI.defaults.css.backgroundColor = 'white';
    $.blockUI.defaults.css.cursor = 'defaults';
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)';
    $.blockUI.defaults.css.fontSize = '14px';
    $.blockUI.defaults.css.width = '700px';
    $.blockUI.defaults.css.paddingTop = '70px';
    $.blockUI.defaults.css.paddingLeft = '20px';
    App.PAGE = 1;
    if ($("#tags").css("display") === "none") {
      $("#showGroupsDiv").show();
    }
    for (item in tabs_dict) {
      name = item;
      $("#" + name).click(function() {
        switch_tabs(this.id);
        if (name === "switchNotificationDiv") {
          return yaCounter23067595.reachGoal('GoToBasket');
        }
      });
    }
    $("#itemName").autocomplete({
      source: "/1cengine/py_scripts/item_autocomplete.py",
      autoFocus: false,
      minLength: 0,
      select: function(event, ui) {
        $(this).val(ui.item.label);
        $(this).change();
        $(this).blur();
        return $(this).click();
      }
    }, 0).click(function() {
      return $(this).autocomplete("search", $(this).val());
    });
    $("#itemName").change(function() {
      var value;
      $(".active_group").removeClass("active_group");
      $(".active_subgroup").removeClass("active_subgroup");
      $("#seotext").html("");
      value = $("#itemName").val();
      value = value.replace("+", " ");
      $("#qRes").fadeOut(400);
      $.ajax({
        type: "GET",
        url: "/1cengine/py_scripts/get_ncatalog_items.py",
        async: true,
        data: "term=" + encodeURIComponent(value) + "",
        success: function(html) {
          return get_item_table(html);
        }
      });
      return $.ajax({
        type: "GET",
        url: "/1cengine/py_scripts/get_count_items.py",
        async: true,
        data: "term=" + encodeURIComponent(value) + "",
        success: function(html) {
          return $(".count_all_result").html(html);
        }
      });
    });
    $(window).on("popstate", function(e) {
      $("#itemName").val(history.state['term']);
      return $("#itemName").change();
    });
    $("#showNds").change(function() {
      if (this.checked) {
        return $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").show();
      } else {
        return $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").hide();
      }
    });
    $("#show_groups").click(function() {
      return show_groups();
    });
    $(".next_result").click(function() {
      var data_string, n_page, params, value, what;
      value = $("#itemName").val();
      value = value.replace("+", " ");
      params = "";
      $(".active_group").find("input[type=checkbox]:checked:enabled").each((function(_this) {
        return function(index, element) {
          return params = params + "'" + $(element).attr("name") + "',";
        };
      })(this));
      params = params + ";";
      if (App.PAGE !== App.PAGE_COUNT) {
        n_page = (App.PAGE * 1) + 1;
        if (value === "") {
          what = "hash";
          data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&page=" + n_page + "&params=" + encodeURIComponent(params) + "";
        } else {
          what = "term";
          data_string = what + "=" + encodeURIComponent(value) + "&page=" + n_page + "";
        }
        return $.ajax({
          type: "GET",
          url: "/1cengine/py_scripts/get_ncatalog_items.py",
          async: true,
          data: data_string,
          success: function(html) {
            App.PAGE++;
            return get_item_table(html);
          }
        });
      }
    });
    $(".prev_result").click(function() {
      var data_string, n_page, params, value, what;
      value = $("#itemName").val();
      value = value.replace("+", " ");
      params = "";
      $(".active_group").find("input[type=checkbox]:checked:enabled").each((function(_this) {
        return function(index, element) {
          return params = params + "'" + $(element).attr("name") + "',";
        };
      })(this));
      params = params + ";";
      if (App.PAGE !== 1) {
        n_page = App.PAGE - 1;
        if (value === "") {
          what = "hash";
          data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&page=" + n_page + "&params=" + encodeURIComponent(params) + "";
        } else {
          what = "term";
          data_string = what + "=" + encodeURIComponent(value) + "&page=" + n_page + "";
        }
        return $.ajax({
          type: "GET",
          url: "/1cengine/py_scripts/get_ncatalog_items.py",
          async: true,
          data: data_string,
          success: function(html) {
            App.PAGE--;
            return get_item_table(html);
          }
        });
      }
    });
    $("#orderDiv").find(".next_step").click(function() {
      return switch_tabs("switchDeliveryDiv");
    });
    $("#deliveryDiv").find(".next_step").click(function() {
      return switch_tabs("switchNotificationDiv");
    });
    $("#groups_list").find("span.click_name").each((function(_this) {
      return function(index, element) {
        return group_click(element);
      };
    })(this));
    $("span.subgroup2_name").each((function(_this) {
      return function(index, sgroup) {
        return subgroup_click(sgroup);
      };
    })(this));
    c_url = window.location.pathname;
    is_empty = c_url.replace("/1cengine/site/", "");
    if (is_empty.length < 3) {
      things = $("li.main_group");
      $(things[Math.floor(Math.random() * things.length)]).click();
    }
    $("#i_want_delivery").change(function() {
      return show_dop_uslugi(this);
    });
    $("#i_want_rezka").change(function() {
      return show_rezka(this);
    });
    $(".is_city_choose").click(function() {
      $(".active_city").removeClass("active_city");
      $(this).addClass("active_city");
      return App.load_delivery_cost();
    });
    $(".city_select").change(function() {
      return $(".delivery_cost").html($(".city_select option:selected").val());
    });
    $(".howtomakeorder").click(function() {
      return show_how_to_make_order();
    });
    $(".return_to_catalog").click(function() {
      return $("#tabPrice").click();
    });
    $(".more").click(function() {
      name = $(this).attr("name");
      $("#" + name).hide();
      $("." + name).show();
    });
    $(".less").click(function() {
      name = $(this).attr("name");
      $("#" + name).show();
      $("." + name).hide();
    });
    $(".menu_back_button").click(function() {
      return group_menu_back();
    });
    $(".sungroup_show_button").click(function() {
      return get_parameters();
    });
    return $(".sidebar_checkbox").click(function() {
      return exclude_parameters();
    });
  });

}).call(this);
