// Generated by CoffeeScript 1.8.0
(function() {
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
      var char_array, i_class, i_hash, obj, price_ul;
      chars = this.get_chars().replace(/\s+$/g, "");
      char_array = chars.split("|");
      this.length = char_array[0];
      this.weight = char_array[1];
      this.kf = char_array[2];
      this.ed_izm = char_array[3];
      this.stock = char_array[4];
      i_hash = this.id.slice(0, this.id.indexOf(":"));
      i_class = this.id.slice(this.id.indexOf(":") + 1);
      if (i_hash === "0") {
        this.is_kis = true;
        this.weight = 2;
        this.length = 1000;
        this.char = this.weight;
      } else {
        this.is_kis = false;
      }
      this.prices = [];
      obj = $("tr[lolid='" + i_class + "']");
      this.name = $(obj).find("span.billet_item_name").text();
      if (this.is_kis === false) {
        this.char = $(obj).find($(".item_billet_select_char option:selected")).val();
      }
      price_ul = $(obj).find(".selected_price");
      return $(price_ul).find("li").each((function(_this) {
        return function(index, element) {
          return _this.prices.push(($(element).children("strong").text()).replace(/\u00a0/g, "").replace(" ", "").replace(",00", "").replace(",", "."));
        };
      })(this));
    };

    Item.prototype.change_buy_count = function(count) {
      this.buy_count = Math.ceil(count);
      this.buy_length = (this.buy_count * this.length).toFixed(2);
      this.buy_weight = ((this.buy_length * this.weight) / 1000).toFixed(3);
      $(".buy_weight").removeClass("preloading");
      $(".buy_count").removeClass("preloading");
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
        price_index = App.MyBasket._active_price_measured;
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
      var my_css, time_out_handle;
      time_out_handle = 0;
      my_css = {
        width: '450px',
        height: 'auto',
        paddingTop: '10px',
        paddingBottom: '10px'
      };
      $.blockUI({
        message: this.get_modal(),
        css: my_css
      });
      $(".blockMsg").draggable();
      $(document).on("keyup", function(e) {
        e.preventDefault();
        if (e.which === 27) {
          return $.unblockUI();
        }
      });
      $(".close_button").click(function() {
        return $.unblockUI();
      });
      if (this.is_measureable()) {
        $(".buy_count").bind('change', (function(_this) {
          return function(event) {
            return _this.change_buy_count($(".buy_count").val());
          };
        })(this));
        $(".buy_count").bind('keyup', (function(_this) {
          return function(event) {
            $(".buy_weight").addClass("preloading");
            window.clearTimeout(time_out_handle);
            return time_out_handle = window.setTimeout((function() {
              return _this.change_buy_count($(".buy_count").val());
            }), 1000);
          };
        })(this));
        $(".buy_length").bind('change keyup', (function(_this) {
          return function(event) {
            window.clearTimeout(time_out_handle);
            return time_out_handle = window.setTimeout((function() {
              return _this.change_buy_length($(".buy_length").val());
            }), 1000);
          };
        })(this));
      }
      $(".buy_weight").bind('change', (function(_this) {
        return function(event) {
          return _this.change_buy_weight($(".buy_weight").val());
        };
      })(this));
      $(".buy_weight").bind('keyup', (function(_this) {
        return function(event) {
          $(".buy_count").addClass("preloading");
          window.clearTimeout(time_out_handle);
          return time_out_handle = window.setTimeout((function() {
            return _this.change_buy_weight($(".buy_weight").val());
          }), 1000);
        };
      })(this));
      if (this.is_kis) {
        $(".char_length").bind('change keyup', (function(_this) {
          return function(event) {
            $(".buy_weight").addClass("preloading");
            window.clearTimeout(time_out_handle);
            return time_out_handle = window.setTimeout((function() {
              return _this.change_char_length($(".char_length").val());
            }), 1000);
          };
        })(this));
      }
      this.change_modal_price();
      $(".add_to_basket").bind('click', (function(_this) {
        return function(event) {
          App.MyBasket.add_item(_this);
          return $.unblockUI();
        };
      })(this));
      $(".change_in_basket").bind('click', (function(_this) {
        return function(event) {
          App.MyBasket.change_item(_this);
          return $.unblockUI();
        };
      })(this));
      return yaCounter23067595.reachGoal('OpenItem');
    };

    Item.prototype.get_modal = function() {
      var c_input, c_izm, cl_input, edizm_dict, l_input, message, modal_link, set_length, w_input;
      if (App.MyBasket.is_in_basket(this)) {
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
        set_length = "<p class=\"list_length\">Укажите требуемую длину листа: " + cl_input + "</p>";
      } else {
        set_length = "";
      }
      edizm_dict = {
        "т": "Тонны",
        "шт": "Метры пог.",
        "м2": "Метры кв.",
        "кв.м.": "Метры кв.",
        "кв. м.": "Метры кв.",
        "пог.м": "Метры пог.",
        "пог. м": "Метры пог."
      };
      c_izm = edizm_dict["" + this.ed_izm];
      message = "<div class=\"buy_item_div\">\n<span class=\"close_button\">x</span>\n<span class=\"buy_item_name\">" + this.name + "</span> <br />\n<span class=\"buy_item_name\">Длина: " + this.char + "</span>\n" + set_length + "\n<table class=\"buy_item_table\">\n<tr class=\"buy_item_head\">\n<th></th>\n\n<th>Штуки</th>\n<th>" + c_izm + "</th>\n</tr>\n<tr class=\"buy_item_count\">\n<td>Количество</td>\n<td style=\"display:none\">\n    " + l_input + "\n</td>\n<td>\n    " + c_input + "\n</td>\n<td>\n    " + w_input + "\n</td>\n</tr>\n<tr class=\"buy_item_price\">\n<td>Стоимость за ед.</td>\n<td class=\"price_count\">0</td>\n<td class=\"price_weight\">0</td>\n</tr>\n\n</table>\n<div class=\"buy_item_overall\">Итого: <span class=\"final_price\"></span></div>\n<div class=\"basket_item_overall\">*В корзине товар на: <span class=\"basket_price\">" + App.MyBasket._sum + "</span></div>\n<span class=\"popUpContinue\">" + modal_link + "</span>\n</div>";
      return message;
    };

    return Item;

  })();

}).call(this);
