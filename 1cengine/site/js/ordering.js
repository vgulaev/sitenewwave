// Generated by CoffeeScript 1.6.3
(function() {
  var apply_rezka, createOrder, create_rezka, delete_rezka_item, getOrderFomat, isValidEmail, openLink, sendOrder, show_rezka_ch_modal,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  App.Item = (function() {
    Item._existing = [];

    Item.elem_exist = function(id) {
      var flag, item, _i, _len, _ref;
      flag = false;
      _ref = this._existing;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.id === id) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return item;
      } else {
        return false;
      }
    };

    function Item(id) {
      this.id = id;
      this.set_chars();
      if (this.is_measureable()) {
        this.count = 1;
        this.change_buy_count(this.count);
      } else {
        this.buy_weight = "1";
        this.change_buy_weight(this.buy_weight);
      }
      this.show_modal();
      App.Item._existing.push(this);
    }

    Item.prototype.is_measureable = function() {
      if (this.length === "0") {
        return false;
      } else {
        return true;
      }
    };

    Item.prototype.get_chars = function() {
      var response;
      response = null;
      $.ajax({
        type: "POST",
        url: "/1cengine/py_scripts/get_item_lwkes.py",
        async: false,
        data: "item_hash=" + this.id,
        success: function(html) {
          response = html;
          return response;
        }
      });
      return response;
    };

    Item.prototype.set_chars = function(chars) {
      var char_array, i_hash, obj,
        _this = this;
      chars = this.get_chars().replace(/\s+$/g, "");
      char_array = chars.split("|");
      this.length = char_array[0];
      this.weight = char_array[1];
      this.kf = char_array[2];
      this.ed_izm = char_array[3];
      this.stock = char_array[4];
      i_hash = this.id.slice(0, this.id.indexOf(":"));
      if (i_hash === "0") {
        this.is_kis = true;
        this.weight = 2;
        this.length = 1000;
        this.char = this.weight;
      } else {
        this.is_kis = false;
      }
      this.prices = [];
      obj = $("tr[id='" + this.id + "']");
      return $(obj).children().each(function(index, element) {
        if ($(element).attr("class") === "itemName") {
          _this.name = $(element).children("[itemprop='name']").text();
        }
        if ($(element).attr("class") === "itemChar") {
          _this.char = $(element).text();
        }
        if (($(element).attr("class").indexOf("price", 0)) === 0) {
          return _this.prices.push($(element).children("span").text());
        }
      });
    };

    Item.prototype.change_buy_count = function(count) {
      this.buy_count = Math.ceil(count);
      this.buy_length = (this.buy_count * this.length).toFixed(2);
      this.buy_weight = ((this.buy_length * this.weight) / 1000).toFixed(3);
      return this.change_modal();
    };

    Item.prototype.change_buy_length = function(length) {
      this.buy_length = length.replace(/,+/g, ".");
      this.buy_count = this.buy_length / this.length;
      this.change_modal();
      return $(".buy_count").change();
    };

    Item.prototype.change_buy_weight = function(weight) {
      this.buy_weight = weight.replace(/,+/g, ".");
      if (this.is_measureable()) {
        this.buy_length = (this.buy_weight * 1000) / this.weight;
        this.change_modal();
        $(".buy_length").change();
      }
      return this.change_modal();
    };

    Item.prototype.change_modal = function() {
      if (this.is_measureable()) {
        $(".buy_count").val(this.buy_count);
        $(".buy_length").val(this.buy_length);
      }
      if (this.is_kis) {
        $(".char_length").val(this.weight);
      }
      $(".buy_weight").val(this.buy_weight);
      return this.change_modal_price();
    };

    Item.prototype.change_modal_price = function() {
      this.set_price_weight();
      if (this.is_measureable()) {
        this.price_length = ((this.price_weight / 1000) * this.weight).toFixed(2);
        this.price_count = ((this.price_weight * this.buy_weight) / this.buy_count).toFixed(2);
        $(".price_count").html(this.price_count);
      }
      $(".price_weight").html(this.price_weight);
      return this.set_final_price();
    };

    Item.prototype.set_price_weight = function() {
      var price_index;
      if (this.ed_izm === "т") {
        price_index = App.Basket._active_price_measured;
      } else {
        price_index = 0;
      }
      return this.price_weight = (+this.prices[price_index]).toFixed(2);
    };

    Item.prototype.set_final_price = function() {
      this.set_price_weight();
      this.final_price = (this.buy_weight * this.price_weight).toFixed(2);
      return $(".final_price").html(this.final_price);
    };

    Item.prototype.change_char_length = function(n_length) {
      if (n_length < 0.2) {
        n_length = 0.2;
      } else if (n_length > 6) {
        n_length = 6;
      }
      this.weight = n_length;
      this.char = this.weight;
      return this.change_buy_count($(".buy_count").val());
    };

    Item.prototype.show_modal = function() {
      var _this = this;
      $.blockUI.defaults.css.borderRadius = '10px';
      $.blockUI.defaults.fadeIn = 100;
      $.blockUI.defaults.fadeOut = 100;
      $.blockUI.defaults.css.backgroundColor = 'white';
      $.blockUI.defaults.css.cursor = 'defaults';
      $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)';
      $.blockUI.defaults.css.fontSize = '14px';
      $.blockUI.defaults.css.width = '450px';
      $.blockUI.defaults.css.paddingTop = '10px';
      $.blockUI({
        message: this.get_modal()
      });
      $(".blockMsg").draggable();
      $(document).on("keyup", function(e) {
        e.preventDefault();
        if (e.which === 27) {
          return $.unblockUI();
        }
      });
      if (this.is_measureable()) {
        $(".buy_count").bind('change keyup', function(event) {
          return _this.change_buy_count($(".buy_count").val());
        });
        $(".buy_length").bind('change keyup', function(event) {
          return _this.change_buy_length($(".buy_length").val());
        });
      }
      $(".buy_weight").bind('change keyup', function(event) {
        return _this.change_buy_weight($(".buy_weight").val());
      });
      if (this.is_kis) {
        $(".char_length").bind('change keyup', function(event) {
          return _this.change_char_length($(".char_length").val());
        });
      }
      this.change_modal_price();
      $(".add_to_basket").bind('click', function(event) {
        App.Basket.add_item(_this);
        return $.unblockUI();
      });
      return $(".change_in_basket").bind('click', function(event) {
        App.Basket.change_item(_this);
        return $.unblockUI();
      });
    };

    Item.prototype.get_modal = function() {
      var c_input, c_izm, cl_input, edizm_dict, l_input, message, modal_link, set_length, w_input;
      if (App.Basket.is_in_basket(this)) {
        modal_link = '<a class="change_in_basket" href="Изменить" onClick="return false">Изменить</a>';
      } else {
        modal_link = '<a class="add_to_basket" href="Добавить в корзину" onClick="return false">В корзину</a>';
      }
      if (this.is_measureable()) {
        l_input = '<input class="buy_length" pattern="[0-9,\\.]+" value="' + this.buy_length + '" />';
        c_input = '<input class="buy_count" pattern="[0-9]+" value="' + this.buy_count + '" />';
      } else {
        l_input = '<input class="buy_length" value="---" disabled />';
        c_input = '<input class="buy_count" value="---" disabled />';
      }
      w_input = '<input class="buy_weight" pattern="[0-9,\\.]+" value="' + this.buy_weight + '" />';
      if (this.is_kis) {
        cl_input = '<input class="char_length" pattern="[0-9,\\.]+" value="' + this.weight + '" />';
        set_length = "<span>Укажите требуемую длину листа: " + cl_input + "</span>";
      } else {
        set_length = "";
      }
      edizm_dict = {
        "т": "Тонны",
        "шт": "Штуки",
        "м2": "Метры кв.",
        "кв.м.": "Метры кв.",
        "кв. м.": "Метры кв.",
        "пог.м": "Метры пог.",
        "пог. м": "Метры пог."
      };
      c_izm = edizm_dict["" + this.ed_izm];
      message = "<div class=\"buy_item_div\">\n<span class=\"buy_item_name\">" + this.name + " " + this.char + "</span>\n" + set_length + "\n<table class=\"buy_item_table\">\n<tr class=\"buy_item_head\">\n<th></th>\n\n<th>Штуки</th>\n<th>" + c_izm + "</th>\n</tr>\n<tr class=\"buy_item_count\">\n<td>Количество</td>\n<td style=\"display:none\">\n    " + l_input + "\n</td>\n<td>\n    " + c_input + "\n</td>\n<td>\n    " + w_input + "\n</td>\n</tr>\n<tr class=\"buy_item_price\">\n<td>Стоимость за ед.</td>\n<td class=\"price_count\">0</td>\n<td class=\"price_weight\">0</td>\n</tr>\n\n</table>\n<div class=\"buy_item_overall\">Итого: <span class=\"final_price\"></span></div>\n<div class=\"basket_item_overall\">*В корзине товар на: <span class=\"basket_price\">" + App.Basket._sum + "</span></div>\n<span class=\"popUpContinue\">" + modal_link + "</span>\n</div>";
      return message;
    };

    return Item;

  })();

  App.Basket = (function() {
    Basket._item_list = [];

    Basket._rezka_list = [];

    Basket._sum = 0;

    Basket._count = 0;

    Basket._total_weight = 0;

    Basket._active_price_measured = 0;

    Basket.is_in_basket = function(item) {
      var index;
      index = this._item_list.indexOf(item);
      if (index === -1) {
        return false;
      } else {
        return true;
      }
    };

    Basket.find_by_id = function(id) {
      var flag, item, _i, _len, _ref;
      flag = false;
      _ref = this._item_list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.id === id) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return item;
      } else {
        return false;
      }
    };

    Basket.add_item = function(item) {
      var i_id, index;
      index = this._item_list.indexOf(item);
      if (index === -1) {
        this._item_list.push(item);
        this._sum = ((+item.final_price) + (+this._sum)).toFixed(2);
        if (item.ed_izm === "т") {
          this._total_weight = ((+item.buy_weight) + (+this._total_weight)).toFixed(3);
        }
        this._count++;
        this.change_basket();
        i_id = ("#" + item.id).replace(":", "\\:");
        return $("" + i_id).addClass("in_basket");
      }
    };

    Basket.change_item = function(item) {
      var elem, index, _i, _len, _ref, _results;
      index = this._item_list.indexOf(item);
      if (index > -1) {
        this._sum = 0;
        this._total_weight = 0;
        _ref = this._item_list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          this._sum = ((+elem.final_price) + (+this._sum)).toFixed(2);
          this._total_weight = ((+elem.buy_weight) + (+this._total_weight)).toFixed(3);
          _results.push(this.change_basket());
        }
        return _results;
      }
    };

    Basket.delete_item = function(id) {
      var elem, i_id, index, item, _i, _len, _ref;
      item = this.find_by_id(id);
      index = this._item_list.indexOf(item);
      if (index > -1) {
        i_id = ("#" + item.id).replace(":", "\\:");
        $("" + i_id).removeClass("in_basket");
        this._count--;
        this._item_list.splice(index, 1);
        this._sum = 0;
        this._total_weight = 0;
        _ref = this._item_list;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          this._sum = ((+elem.final_price) + (+this._sum)).toFixed(2);
          this._total_weight = ((+elem.buy_weight) + (+this._total_weight)).toFixed(3);
        }
      }
      return this.change_basket();
    };

    Basket.get_count = function() {
      return this._count;
    };

    Basket.change_basket = function() {
      var item, nds, _i, _len, _ref,
        _this = this;
      $(".basketCount").html(this._count);
      $(".lItemTab").empty();
      _ref = this._item_list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        $("." + (item.ed_izm.replace('.', '\\.').replace(' ', ''))).append(this.create_row(item));
        $("tr[name='" + item.id + "']").find(".delete_from_basket").bind("click", function(event) {
          var target;
          target = $(event.currentTarget);
          return App.Basket.delete_item(target.closest("tr").attr("name"));
        });
        $("tr[name='" + item.id + "']").find(".edit_from_basket").bind("click", function(event) {
          var element, target;
          target = $(event.currentTarget);
          element = _this.find_by_id(target.closest("tr").attr("name"));
          return element.show_modal();
        });
      }
      nds = ((this._sum / 100) * 18).toFixed(2);
      $("#SumGoods").html(this._sum);
      $("#CountAll").html(this._total_weight);
      $("#NDSAll").html(nds);
      return App.load_delivery_cost();
    };

    Basket.rebuild_basket = function() {};

    Basket.create_row = function(item) {
      var nds, row;
      nds = ((item.final_price / 100) * 18).toFixed(2);
      return row = "<tr class=\"itemTr\" name=\"" + item.id + "\">\n<td>" + (this._item_list.indexOf(item) + 1) + "</td>\n<td class='itemNameTd'>" + item.name + "</td>\n\n<td class='itemCharTd'>" + item.char + "</td>\n\n<td class='itemCountTd'>" + item.buy_weight + "</td>\n<td class='itemEdIzmTd'>" + item.ed_izm + "</td>\n<td class='itemPriceTd'>" + item.price_weight + "</td>\n<td class='itemNdsKfTd'>18%</td>\n<td class='itemNdsSumTd'>" + nds + "</td>\n<td class='itemSumTd'>" + item.final_price + "</td>\n<td class='itemEdit'>\n    <span class=\"delEdSpan\">\n    <a class=\"edit_from_basket\" href=\"Редактировать\" onClick=\"return false\"><img src=\"/1cengine/site/images/cart_edit.png\" /></a></span>\n    <a class=\"delete_from_basket\" href=\"Убрать из корзины\" onClick=\"return false\"><img src=\"/1cengine/site/images/cart_delete.png\" /></a>\n</td>\n</tr>";
    };

    Basket.on_weight_change_handler = function(weight) {
      if (weight < 2) {
        this._active_price_measured = 0;
      }
      if (weight >= 2 && weight < 8) {
        this._active_price_measured = 1;
      }
      if (weight >= 8 && weight < 15) {
        this._active_price_measured = 2;
      }
      if (weight >= 15) {
        this._active_price_measured = 3;
      }
      return weight;
    };

    Basket.watch("_total_weight", function(id, oldval, newval) {
      this.on_weight_change_handler(newval);
      return this._total_weight = newval;
    });

    Basket.on_active_price_measured_change_handler = function() {
      this.update_price();
      return this._active_price_measured;
    };

    Basket.watch("_active_price_measured", function(id, oldval, newval) {
      this.on_active_price_measured_change_handler();
      return this._active_price_measured = newval;
    });

    Basket.update_price = function() {
      var item, _i, _len, _ref, _results;
      _ref = this._item_list;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.set_price_weight();
        item.set_final_price();
        this.change_item(item);
        _results.push(this.change_basket());
      }
      return _results;
    };

    function Basket(name) {
      this.name = name;
    }

    return Basket;

  })();

  /* DEPRECATED START!!!!*/


  isValidEmail = function(str) {
    return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
  };

  sendOrder = function(orderString, is_async) {
    var carry, delivery_cost, destination, email, last_name, main_phone, name_surname, other_phone, ret;
    if (typeof is_async === "undefined") {
      is_async = true;
    }
    destination = $(".city_select option:selected").html() + " - " + $(".street_select").val();
    carry = $(".delivery_car").html();
    delivery_cost = $(".delivery_cost").html().replace("&nbsp;", "");
    email = $("input#emailInput").val();
    if (email !== "") {
      if (isValidEmail(email) === false) {
        alert("Проверьте правильность адреса электронной почты");
        return null;
      }
    }
    main_phone = $("#mainPhoneInput").val();
    last_name = $("#lastNameInput").val();
    name_surname = $("#nameSurnameInput").val();
    other_phone = $("#otherPhoneInput").val();
    ret = "";
    $.ajax({
      type: "POST",
      url: "/1cengine/php_scripts/createOrder.php",
      async: is_async,
      data: "orderString=" + orderString + "&carry=" + carry + "&destination=" + destination + "&email=" + email + "&delivery_cost=" + delivery_cost + "&main_phone=" + main_phone + "&other_phone=" + other_phone + "&name_surname=" + name_surname + "&last_name=" + last_name,
      success: function(html) {
        var oA, order;
        ret = "номер " + html;
        $("#popUpOrderClose").show();
        $(".oInProcess").hide();
        $(".oProcessed").show();
        $("#basketCaption").empty();
        order = ret;
        oA = order.split(",");
        $("#basketCaption").append("Заказ " + oA[0]);
        $("#switchOrderDiv").click();
        return ret;
      }
    });
    return ret;
  };

  $("#sendOrderButton").click(function() {
    createOrder();
  });

  createOrder = function() {
    var order, sendRow;
    if ($("#emailInput").val() === "") {
      $("#switchNotificationDiv").click();
      return $("#emailInput").focus();
    } else if ($("#mainPhoneInput").val() === "") {
      $("#switchNotificationDiv").click();
      return $("#phoneMainInput").focus();
    } else {
      $.blockUI.defaults.css.borderRadius = "10px";
      $.blockUI.defaults.fadeIn = 100;
      $.blockUI.defaults.fadeOut = 100;
      $.blockUI.defaults.css.backgroundColor = "white";
      $.blockUI.defaults.css.cursor = "defaults";
      $.blockUI.defaults.css.boxShadow = "0px 0px 5px 5px rgb(207, 207, 207)";
      $.blockUI.defaults.css.fontSize = "14px";
      $.blockUI.defaults.css.width = "450px";
      $.blockUI.defaults.css.height = "220px";
      $.blockUI.defaults.css.paddingTop = "10px";
      $.blockUI({
        message: "<span class='oInProcess' style='margin-top:50px;font-size:16px'>\n    Ваш заказ сейчас регистрируется в нашей системе<br />\n</span>\n<span class='oProcessed' style='display:none;margin-top:50px;font-size:16px'>\n    Ваш заказ успешно зарегистрирован<br />\n    и позднее будет обработан менеджером.<br />\n    На указанный вами электронный адрес так же отправлена предварительная форма заказа.\n</span><div style='disply:block;margin-top:70px'><a href='' onClick='$.unblockUI(); return false' id='popUpOrderClose' style='display:none;cursor:pointer;'>Закрыть</a></div>"
      });
      sendRow = "";
      $("tr.itemTr").each(function() {
        if ($(this).find("input.itemCharInput").length !== 0) {
          return sendRow += "" + $(this).find("input.itemCharInput").val() + ":" + $(this).attr("name") + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";";
        } else {
          return sendRow += "" + $(this).attr("name") + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";";
        }
      });
      return order = sendOrder(sendRow);
    }
  };

  openLink = function(linkUID, type) {
    $.ajax({
      type: "POST",
      url: "/1cengine/php_scripts/getfilelink.php",
      async: false,
      data: "linkUID=" + linkUID + "&type=" + type + "",
      success: function(html) {
        window.location.href = html;
      }
    });
  };

  getOrderFomat = function(format) {
    var sendRow;
    $.blockUI.defaults.css.borderRadius = "10px";
    $.blockUI.defaults.fadeIn = 100;
    $.blockUI.defaults.fadeOut = 100;
    $.blockUI.defaults.css.backgroundColor = "white";
    $.blockUI.defaults.css.cursor = "defaults";
    $.blockUI.defaults.css.boxShadow = "0px 0px 5px 5px rgb(207, 207, 207)";
    $.blockUI.defaults.css.fontSize = "14px";
    $.blockUI.defaults.css.width = "450px";
    $.blockUI.defaults.css.height = "220px";
    $.blockUI.defaults.css.paddingTop = "10px";
    $.blockUI({
      message: "<span class='oInProcess' style='margin-top:50px;font-size:16px'>Ваш запрос обрабатывается</span>"
    });
    sendRow = "";
    $("tr.itemTr").each(function() {
      if ($(this).find("input.itemCharInput").length !== 0) {
        sendRow += "" + $(this).find("input.itemCharInput").val() + ":" + $(this).attr("name") + ":-:" + $(this).find("input.itemCountInput").val() + ":" + $(this).find(".itemPriceTd").html() + ";";
      } else {
        sendRow += "" + $(this).attr("name") + ":-:" + $(this).find("input.itemCountInput").val() + ":" + $(this).find(".itemPriceTd").html() + ";";
      }
    });
    window.setTimeout((function() {
      var order, q;
      order = sendOrder(sendRow, false);
      q = order.split(",");
      openLink(q[1], format);
    }), 1000);
  };

  /* DEPRECATED END!!!!*/


  show_rezka_ch_modal = function() {
    var checked, d_name, item, table, table_rows, _i, _len, _ref, _ref1;
    table_rows = "";
    _ref = App.Basket._item_list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (_ref1 = item.id, __indexOf.call(App.Basket._rezka_list, _ref1) >= 0) {
        checked = "checked";
      } else {
        checked = "";
      }
      d_name = item.name + " " + item.char;
      table_rows = table_rows + ("<tr><td>" + d_name + "</td><td><input name='" + item.id + "' type='checkbox' " + checked + " /></td></tr>");
    }
    table = "<div>\n<p>Отметьте позиции, которые вы хотите порезать</p>\n<table class='rezka_choose_table'>\n<thead><tr><th>Наименование</th><th>Резать?</th></tr></thead>\n<tbody>" + table_rows + "</tbody></table>\n<div class=\"rezka_confirm_button\">Применить</div>\n</div>";
    $.blockUI.defaults.css.borderRadius = '10px';
    $.blockUI.defaults.fadeIn = 100;
    $.blockUI.defaults.fadeOut = 100;
    $.blockUI.defaults.css.backgroundColor = 'white';
    $.blockUI.defaults.css.cursor = 'defaults';
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)';
    $.blockUI.defaults.css.fontSize = '14px';
    $.blockUI.defaults.css.width = '450px';
    $.blockUI.defaults.css.paddingTop = '10px';
    $.blockUI({
      message: table
    });
    $(".blockMsg").draggable();
    $(".rezka_confirm_button").click(function() {
      return apply_rezka();
    });
    return $(document).on("keyup", function(e) {
      e.preventDefault();
      if (e.which === 27) {
        return $.unblockUI();
      }
    });
  };

  apply_rezka = function() {
    App.Basket._rezka_list.length = 0;
    return $(".rezka_choose_table").find("input").each(function() {
      if ($(this).is(":checked")) {
        App.Basket._rezka_list.push($(this).attr("name"));
        create_rezka();
        return $.unblockUI();
      }
    });
  };

  create_rezka = function() {
    var item, new_tbody_string, new_tr, _i, _len, _ref, _ref1;
    new_tbody_string = "";
    _ref = App.Basket._item_list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (_ref1 = item.id, __indexOf.call(App.Basket._rezka_list, _ref1) >= 0) {
        new_tr = "<tr>\n    <td class=\"rezka_item_name\">" + item.name + " " + item.char + "</td>\n    <td class=\"rezka_item_description\">\n        <textarea></textarea>\n    </td>\n    <td class=\"rezka_item_delete\"><div idname=\"" + item.id + "\"></div>\n</tr>";
        new_tbody_string = new_tbody_string + new_tr;
      }
    }
    $(".rezka_table").find("tbody").html(new_tbody_string);
    return $(".rezka_item_delete").find("div").each(function(index, element) {
      return $(element).click(function() {
        return delete_rezka_item($(element).attr("idname"));
      });
    });
  };

  delete_rezka_item = function(id) {
    App.Basket._rezka_list.splice(App.Basket._rezka_list.indexOf(id), 1);
    return create_rezka();
  };

  $(document).ready(function() {
    var GET, curr, i, parts, squery;
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
    $("#sendOrderButton").click(function() {
      return createOrder();
    });
    /* DEPRECATED*/

    squery = String(document.location).replace(/\%2F/g, "\\");
    squery = String(document.location).replace(/\s\s/g, "s");
    if (squery.split("?", 2)[1]) {
      parts = squery.split("?", 2)[1].split("&");
      GET = {};
      i = 0;
      while (i < parts.length) {
        curr = parts[i].split("=");
        GET[curr[0]] = curr[1];
        i++;
      }
      if (GET["linkUID"] !== undefined) {
        openLink(GET["linkUID"], GET["type"]);
      }
    }
    /* /DEPRECATED*/

    return $(".rezka_item_add").click(function() {
      return show_rezka_ch_modal();
    });
  });

}).call(this);
