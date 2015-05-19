// Generated by CoffeeScript 1.4.0
(function() {

  App.MyBasket = (function() {

    MyBasket._item_list = [];

    MyBasket._rezka_list = [];

    MyBasket._sum = 0;

    MyBasket._count = 0;

    MyBasket._total_weight = 0;

    MyBasket._total_running_meter = 0;

    MyBasket._active_price_measured = 0;

    MyBasket._active_rm_price_measured = 0;

    MyBasket.is_in_basket = function(item) {
      var index;
      index = this._item_list.indexOf(item);
      if (index === -1) {
        return false;
      } else {
        return true;
      }
    };

    MyBasket.find_by_id = function(id) {
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

    MyBasket.add_item = function(item) {
      var i_id, index;
      index = this._item_list.indexOf(item);
      if (index === -1) {
        this._item_list.push(item);
        this._sum = ((+item.final_price) + (+this._sum)).toFixed(2);
        if (item.ed_izm === "т") {
          this._total_weight = (parseFloat(item.buy_weight) + parseFloat(this._total_weight)).toFixed(3);
        }
        if (item.ed_izm === "пог. м") {
          this._total_running_meter = (parseFloat(item.buy_weight) + parseFloat(this._total_running_meter)).toFixed(3);
        }
        this._count++;
        this.on_weight_change_handler(this._total_weight);
        this.on_running_meter_change_handler(this._total_running_meter);
        this.on_active_price_measured_change_handler();
        i_id = ("#" + item.id).replace(":", "\\:");
        $("" + i_id).addClass("in_basket");
        $("#tabBasket").tooltipster("show");
        return yaCounter23067595.reachGoal('AddItem');
      }
    };

    MyBasket.change_item_from_modal = function(item) {
      this.change_item(item);
      this.on_weight_change_handler(this._total_weight);
      this.on_running_meter_change_handler(this._total_running_meter);
      return this.on_active_price_measured_change_handler();
    };

    MyBasket.change_item = function(item) {
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
          _results.push(this._total_weight = ((+elem.buy_weight) + (+this._total_weight)).toFixed(3));
        }
        return _results;
      }
    };

    MyBasket.delete_item = function(id) {
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
        this._total_running_meter = 0;
        _ref = this._item_list;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          this._sum = ((+elem.final_price) + (+this._sum)).toFixed(2);
        }
        if (item.ed_izm === "т") {
          this._total_weight = (parseFloat(item.buy_weight) + parseFloat(this._total_weight)).toFixed(3);
        }
        if (item.ed_izm === "пог. м") {
          this._total_running_meter = (parseFloat(item.buy_weight) + parseFloat(this._total_running_meter)).toFixed(3);
          this.on_weight_change_handler(this._total_weight);
          this.on_running_meter_change_handler(this._total_running_meter);
          this.on_active_price_measured_change_handler();
        }
      }
      return this.change_basket();
    };

    MyBasket.get_count = function() {
      return this._count;
    };

    MyBasket.change_basket = function() {
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
          return App.MyBasket.delete_item(target.closest("tr").attr("name"));
        });
        $("tr[name='" + item.id + "']").find(".edit_from_basket").bind("click", function(event) {
          var element, target;
          target = $(event.currentTarget);
          element = _this.find_by_id(target.closest("tr").attr("name"));
          return element.show_modal();
        });
      }
      nds = ((this._sum / 100) * 18).toFixed(2);
      $("#SumGoods").html(this._sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".", ","));
      $("#CountAll").html(this._total_weight.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".", ","));
      $("#NDSAll").html(nds);
      return App.load_delivery_cost();
    };

    MyBasket.rebuild_basket = function() {};

    MyBasket.create_row = function(item) {
      var count_td, count_unit_td, nds, price_td, row, sum_td;
      nds = ((item.final_price / 100) * 18).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".", ",");
      price_td = item.price_weight.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".", ",");
      sum_td = item.final_price.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".", ",");
      count_td = item.buy_weight.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".", ",");
      if (item.buy_count === void 0) {
        count_unit_td = "&#151;";
      } else {
        count_unit_td = item.buy_count;
      }
      return row = "<tr class=\"itemTr\" name=\"" + item.id + "\">\n<td>" + (this._item_list.indexOf(item) + 1) + "</td>\n<td class='itemNameTd'>" + item.name + "</td>\n\n<td class='itemCharTd'>" + item.char + "</td>\n\n\n<td class='itemCountTd'>" + count_td + "</td>\n<td class='itemEdIzmTd'>" + item.ed_izm + "</td>\n<td class='itemCountUnitTd'>" + count_unit_td + "</td>\n<td class='itemPriceTd'>" + price_td + "</td>\n<td class='itemNdsKfTd'>18%</td>\n<td class='itemNdsSumTd'>" + nds + "</td>\n<td class='itemSumTd'>" + sum_td + "</td>\n<td class='itemEdit'>\n    <span class=\"delEdSpan\">\n    <a class=\"edit_from_basket\" href=\"Редактировать\" onClick=\"return false\"><img src=\"/1cengine/site/images/cart_edit.png\" /></a></span>\n    <a class=\"delete_from_basket\" href=\"Убрать из корзины\" onClick=\"return false\"><img src=\"/1cengine/site/images/cart_delete.png\" /></a>\n</td>\n</tr>";
    };

    MyBasket.on_weight_change_handler = function(weight) {
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

    MyBasket.on_running_meter_change_handler = function(running_meter) {
      if (running_meter < 100) {
        this._active_rm_price_measured = 0;
      }
      if (running_meter >= 100 && running_meter < 200) {
        this._active_rm_price_measured = 1;
      }
      if (running_meter >= 200) {
        this._active_rm_price_measured = 2;
      }
      return running_meter;
    };

    MyBasket.on_active_price_measured_change_handler = function() {
      this.update_price();
      return this._active_price_measured;
    };

    MyBasket.update_price = function() {
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

    function MyBasket() {}

    return MyBasket;

  })();

}).call(this);
