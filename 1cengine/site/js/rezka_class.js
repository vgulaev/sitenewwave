// Generated by CoffeeScript 1.6.3
(function() {
  var add_rezka_item, apply_rezka, create_rezka, delete_rezka_item, delete_rezka_part, fill_rezka, length_input_change,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  App.show_rezka_ch_modal = function() {
    var checked, d_name, item, table, table_rows, _i, _len, _ref, _ref1;
    table_rows = "";
    _ref = App.MyBasket._item_list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.is_measureable()) {
        if (_ref1 = item.id, __indexOf.call(App.MyBasket._rezka_list, _ref1) >= 0) {
          checked = "checked";
        } else {
          checked = "";
        }
        d_name = item.name + " " + item.char;
        table_rows = table_rows + ("<tr><td>" + d_name + "</td><td><input name='" + item.id + "' type='checkbox' " + checked + " /></td></tr>");
      }
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
    App.MyBasket._rezka_list.length = 0;
    $(".rezka_choose_table").find("input").each(function() {
      if ($(this).is(":checked")) {
        return App.MyBasket._rezka_list.push($(this).attr("name"));
      }
    });
    create_rezka();
    return $.unblockUI();
  };

  create_rezka = function() {
    var item, _i, _len, _ref, _ref1, _results;
    _ref = App.MyBasket._item_list;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (_ref1 = item.id, __indexOf.call(App.MyBasket._rezka_list, _ref1) >= 0) {
        if (!$("div.rezka_item").is("[rid='" + item.id + "']")) {
          _results.push(add_rezka_item(item));
        } else {
          _results.push(void 0);
        }
      } else {
        if ($("div.rezka_item").is("[rid='" + item.id + "']")) {
          _results.push(delete_rezka_item(item.id));
        } else {
          _results.push(void 0);
        }
      }
    }
    return _results;
  };

  length_input_change = function() {
    return $(".rezka_length_input").change(function() {
      var max_len, r_length;
      max_len = $(this).closest(".rezka_table_container").attr("max");
      r_length = $(this).val().replace(/,+/g, ".");
      if (r_length < 0.2) {
        r_length = 0.2;
      } else if (parseFloat(r_length) > parseFloat(max_len)) {
        r_length = max_len;
      }
      return $(this).val(r_length);
    });
  };

  delete_rezka_part = function() {
    return $(".rezka_part_delete").click(function() {
      return $(this).closest(".rezka_table_tt").remove();
    });
  };

  add_rezka_item = function(item) {
    var new_tr, slice_table,
      _this = this;
    slice_table = "<table class=\"rezka_table_tt\">\n    <thead>\n        <tr>\n            <th>Длина м.</th>\n            <th>Кол-во шт.</th>\n            <th></th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr>\n            <td>\n                <input type=\"textarea\" class=\"rezka_length_input\" value=\"0.2\" />\n            </td>\n            <td>\n                <input type=\"textarea\" class=\"rezka_count_input\" value=\"0\" />\n            </td>\n            <td class=\"rezka_part_delete\">\n                <div></div>\n            </td>\n        </tr>\n    </tbody>\n</table>";
    new_tr = "<div class=\"rezka_item\" rid=\"" + item.id + "\" name=\"" + item.name + " " + item.char + "\">\n    <div class=\"rezka_item_header\">" + item.name + " " + item.char + "\n        <span class=\"rezka_delete_item\" idname=\"" + item.id + "\">⤬</span>\n    </div>\n    <span class=\"red_info\">\n        *Максимальная длина отрезка: " + item.char + " м\n    </span>\n    <div class=\"rezka_table_container\" max=\"" + item.length + "\">\n        " + slice_table + "\n        <div class=\"rezka_part_add\"><font>Добавить рез</font></div>\n    </div>\n    <div class=\"rezka_info_container\">\n        <div class=\"rezka_count_info\">\n            <div>Количестуво резов: <span class=\"rezka_count\">X</span></div>\n            <div>Остатки: <span class=\"rezka_leftovers\">Y</span></div>\n        </div>\n        <div class=\"rezka_count_button\">Рассчитать</div>\n        <div class=\"rezka_price_container\" style=\"display:none\">Цена: <span class=\"rezka_price\">Z</span></div>\n    </div>\n</div>";
    $(".rezka_table").append(new_tr);
    $(".rezka_delete_item").each(function(index, element) {
      return $(element).click(function() {
        return delete_rezka_item($(element).attr("idname"));
      });
    });
    $(".rezka_part_add").click(function() {
      $(this).before(slice_table);
      delete_rezka_part();
      return length_input_change();
    });
    $(".rezka_count_button").click(function() {
      var itid;
      itid = $(this).closest(".rezka_item").attr("rid");
      return fill_rezka(itid);
    });
    delete_rezka_part();
    return length_input_change();
  };

  delete_rezka_item = function(id) {
    App.MyBasket._rezka_list.splice(App.MyBasket._rezka_list.indexOf(id), 1);
    return $("div.rezka_item[rid='" + id + "']").remove();
  };

  fill_rezka = function(itid) {
    var M_count, M_len, item, rezka_array, _i, _item, _len, _ref, _results,
      _this = this;
    _ref = App.MyBasket._item_list;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _item = _ref[_i];
      if (_item.id === itid) {
        item = _item;
        M_len = item.length.replace(/,+/g, ".");
        M_count = item.buy_count;
        rezka_array = [];
        $("div[rid='" + item.id + "']").find(".rezka_table_tt").each(function(index, element) {
          var r_count, r_len;
          r_len = $(element).find(".rezka_length_input").val();
          r_count = $(element).find(".rezka_count_input").val();
          return rezka_array.push([r_len, r_count]);
        });
        _results.push($.ajax({
          type: "GET",
          url: "/1cengine/py_scripts/rezka_count.py",
          async: false,
          data: "rezka_array=" + JSON.stringify(rezka_array) + "&M=" + M_len + "",
          success: function(html) {
            var leftovers, rez_count, rez_price_max, rez_price_min;
            $("div[rid='" + item.id + "']").find(".rezka_show_wrapper").remove();
            $("div[rid='" + item.id + "']").append(html);
            rez_count = $("div[rid='" + item.id + "']").find(".rezka_show_wrapper").attr("rez_count");
            $("div[rid='" + item.id + "']").find(".rezka_count").empty().append(rez_count);
            rez_price_min = rez_count * 15;
            rez_price_max = rez_count * 800;
            $("div[rid='" + item.id + "']").find(".rezka_price").empty().append(rez_price_min + " - " + rez_price_max);
            leftovers = $("div[rid='" + item.id + "']").find(".rezka_show_wrapper").attr("leftovers");
            return $("div[rid='" + item.id + "']").find(".rezka_leftovers").empty().append(leftovers);
          }
        }));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

}).call(this);
