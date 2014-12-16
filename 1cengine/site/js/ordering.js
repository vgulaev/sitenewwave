// Generated by CoffeeScript 1.8.0

/* DEPRECATED START!!!! */

(function() {
  var createOrder, getOrderFomat, isValidEmail, openLink, sendOrder;

  isValidEmail = function(str) {
    return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
  };

  sendOrder = function(orderString, is_async) {
    var carry, comment_text, delivery_cost, destination, email, last_name, main_phone, name_surname, other_phone, ret, rezka_text;
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
    rezka_text = "";
    $(".rezka_item").each((function(_this) {
      return function(index, element) {
        rezka_text = rezka_text + $(element).attr("name") + " :: ";
        $(element).find(".rezka_table_tt").each(function(rindex, relement) {
          var rezka_slices;
          rezka_slices = $(relement).find(".rezka_count_input").val() + " x " + $(relement).find(".rezka_length_input").val() + " , ";
          return rezka_text = rezka_text + rezka_slices;
        });
        return rezka_text = rezka_text + " ;; ";
      };
    })(this));
    if (rezka_text === "") {
      rezka_text = "NOREZKA ;;";
    }
    comment_text = $("#commentInput").val();
    $.ajax({
      type: "POST",
      url: "/1cengine/php_scripts/createOrder.php",
      async: is_async,
      data: "orderString=" + orderString + "&carry=" + carry + "&destination=" + destination + "&email=" + email + "&delivery_cost=" + delivery_cost + "&main_phone=" + main_phone + "&other_phone=" + other_phone + "&name_surname=" + name_surname + "&last_name=" + last_name + "&rezka=" + rezka_text + " комментарий :: " + comment_text,
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
    yaCounter23067595.reachGoal('FinishOrder');
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
        if ($(this).attr("name").split(":")[0] === "0") {
          return sendRow += "" + $(this).find("itemCharTd").html() + ":" + $(this).attr("name") + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";";
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


  /* DEPRECATED END!!!! */

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
      createOrder();
      return yaCounter23067595.reachGoal('FinishOrder');
    });

    /* DEPRECATED */
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

    /* /DEPRECATED */
    $(".rezka_item_add").click(function() {
      return App.show_rezka_ch_modal();
    });
    return $("#tabBasket").tooltipster({
      content: "Товар добавлен в корзину",
      animation: 'fade',
      delay: 200,
      position: 'right',
      timer: 3000,
      trigger: "custom",
      theme: "tooltipster-my"
    });
  });

}).call(this);
