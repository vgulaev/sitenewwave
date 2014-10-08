// Generated by CoffeeScript 1.8.0
(function() {
  var get_item_list, get_item_table, get_parameters, get_subgroup, group_click, group_menu_back, showGroup2, show_dop_uslugi, show_how_to_make_order, show_rezka, subgroup_click, switch_tabs, tabs, tabs_dict;

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
    $("#itemName").val("");
    $.ajax({
      type: "GET",
      url: "/1cengine/py_scripts/get_ncatalog_items.py",
      async: true,
      data: "hash=" + encodeURIComponent(hash) + "",
      success: function(html) {
        App.C_HASH = hash;
        return get_item_table(html);
      }
    });
    return $.ajax({
      type: "GET",
      url: "/1cengine/py_scripts/get_count_items.py",
      async: true,
      data: "hash=" + encodeURIComponent(hash) + "",
      success: function(html) {
        return $(".count_all_result").html(html);
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
        $(element).append(html);
        get_item_list(g_name);
        $(".menu_back_button").click(function() {
          return group_menu_back();
        });
        return $(".sungroup_show_button").click(function() {
          return get_parameters();
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
        get_item_list(g_name);
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
    return $(".subgroup_c").hide();
  };

  get_parameters = function() {
    var hash, params;
    params = "";
    $(".active_group").find("input[type=checkbox]:checked:enabled").each((function(_this) {
      return function(index, element) {
        params = params + "'$(element).attr(\"name\")',";
        return alert($(element).attr("name"));
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
        return get_item_table(html);
      }
    });
  };

  subgroup_click = function(sgroup) {
    return $(sgroup).click(function() {
      var g_name, group, i_name, li_group;
      li_group = $(sgroup).parent();
      $(".subgroup").removeClass("active_subgroup");
      $(li_group).addClass("active_subgroup");
      group = $(li_group).closest(".active_group");
      g_name = $(group).attr("name");
      i_name = g_name.replace(/^\s+|\s+$/g, "" + " " + $(li_group).attr("name").replace(/^\s+|\s+$/g, ""));
      if ($(li_group).children().is(".subgroup_c2") === false) {
        $(li_group).append("<ul class=\"subgroup_c2\"></ul>");
        get_subgroup(li_group, $(li_group).attr("name"), $(li_group).attr("idin"));
      }
      return get_item_list($(li_group).attr("name"));
    });
  };

  get_item_table = function(html) {
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
      $("#show_next_prev").hide();
    }
    $(".bItem").click(function() {
      var elem_id, item;
      elem_id = $(this).closest("tr").attr("id");
      item = App.Item.elem_exist(elem_id);
      if (item === false) {
        return item = new App.Item($(this).closest("tr").attr("id"));
      } else {
        return item.show_modal();
      }
    });
    $(".oItem").click(function() {
      var elem_id, item;
      elem_id = $(this).closest("tr").attr("id");
      item = App.Item.elem_exist(elem_id);
      if (item === false) {
        return item = new App.Item($(this).closest("tr").attr("id"));
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
    return $(".eye").each((function(_this) {
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
  };

  $(document).ready(function() {
    var PAGE, c_url, is_empty, item, name, things;
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
    PAGE = 1;
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
    $("#showAll").click(function() {
      var data_string, value, what;
      value = $("#itemName").val();
      value = value.replace("+", " ");
      if (value === "") {
        what = "hash";
        data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&show_all=true";
      } else {
        what = "term";
        data_string = what + "=" + encodeURIComponent(value) + "&show_all=true";
      }
      return $.ajax({
        type: "GET",
        url: "/1cengine/py_scripts/get_ncatalog_items.py",
        async: true,
        data: data_string,
        success: function(html) {
          return get_item_table(html);
        }
      });
    });
    $(".next_result").click(function() {
      var data_string, n_page, value, what;
      value = $("#itemName").val();
      value = value.replace("+", " ");
      n_page = (PAGE * 1) + 1;
      if (value === "") {
        what = "hash";
        data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&page=" + n_page + "";
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
          PAGE = n_page;
          return get_item_table(html);
        }
      });
    });
    $(".prev_result").click(function() {
      var data_string, n_page, value, what;
      value = $("#itemName").val();
      value = value.replace("+", " ");
      if (PAGE !== 1) {
        n_page = PAGE - 1;
        if (value === "") {
          what = "hash";
          data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&page=" + n_page + "";
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
            PAGE = PAGE - 1;
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
    return $(".sungroup_show_button").click(function() {
      return get_parameters();
    });
  });

}).call(this);
