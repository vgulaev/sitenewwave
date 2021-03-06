// Generated by CoffeeScript 1.9.2

/* DEPRECATED START!!!! */

(function() {
  var block_order, check_user, createOrder, getOrderFomat, isValidEmail, loginUser, mail_to_client, openLink, save_to_db, sendOrder, show_login_user, submit_form;

  isValidEmail = function(str) {
    return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
  };

  sendOrder = function(orderString, is_async) {
    var carry, comment_text, counterparty, delivery_cost, delivery_info, destination, email, last_name, main_phone, name_surname, other_phone, ret, rezka_text;
    if (typeof is_async === "undefined") {
      is_async = true;
    }
    if ($("#i_want_delivery").prop("checked")) {
      destination = $(".city_select option:selected").html() + " - " + $(".street_select").val();
      carry = $(".delivery_car").html();
      delivery_info = $(".active_city").attr("name");
      delivery_cost = $(".delivery_cost").html().replace("&nbsp;", "");
    } else {
      carry = $(".delivery_car").html();
      destination = "None";
      delivery_cost = "0";
    }
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
    counterparty = $("#counterpartySelect").val();
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
      data: "orderString=" + orderString + "&carry=" + carry + "&destination=" + destination + "&email=" + email + "&delivery_cost=" + delivery_cost + "&main_phone=" + main_phone + "&other_phone=" + other_phone + "&name_surname=" + name_surname + "&last_name=" + last_name + "&rezka=" + rezka_text + " комментарий :: " + comment_text + "&delivery_info=" + delivery_info + "&counterparty=" + counterparty,
      success: function(html) {
        var oA, order;
        ret = html;
        $("#popUpOrderClose").show();
        $(".oInProcess").hide();
        $(".oProcessed").show();
        $("#basketCaption").empty();
        order = ret;
        oA = order.split(",");
        $("#basketCaption").append("Заказ номер " + oA[0]);
        $("#switchOrderDiv").click();
        mail_to_client(oA[1], oA[2], email, main_phone + ", " + other_phone, name_surname + " " + last_name, oA[3], oA[4], oA[0]);
        save_to_db(oA[0], email, main_phone + ", " + other_phone, name_surname + " " + last_name);
        block_order();
        return ret;
      }
    });
    return ret;
  };

  mail_to_client = function(uid, accepted, mail, phones, fname, regresult, pwd, onumber) {
    return $.ajax({
      type: "POST",
      url: "/1cengine/py_scripts/mail_order.py",
      async: true,
      data: "uid=" + uid + "&accepted=" + accepted + "&mail=" + mail + "&phones=" + phones + "&fname=" + fname + "&regresult=" + regresult + "&pwd=" + pwd + "&onumber=" + onumber,
      success: function(html) {
        return true;
      }
    });
  };

  save_to_db = function(onumber, mail, phones, fname) {
    var sum;
    sum = $("#SumGoods").html();
    return $.ajax({
      type: "POST",
      url: "/1cengine/py_scripts/save_order_db.py",
      async: true,
      data: "sum=" + sum + "&mail=" + mail + "&phones=" + phones + "&fname=" + fname + "&onumber=" + onumber,
      success: function(html) {
        return true;
      }
    });
  };

  $("#sendOrderButton").click(function() {
    createOrder();
  });

  createOrder = function() {
    var accept_flag, order, sendRow;
    yaCounter23067595.reachGoal('FinishOrder');
    accept_flag = true;
    if ($("#mainPhoneInput").val() === "") {
      $("#switchNotificationDiv").click();
      $("#mainPhoneInput").focus();
      $("#mainPhoneInput").addClass("invalid_input");
      $("#mainPhoneInput").parent().parent().children().addClass("require_field");
      accept_flag = false;
    }
    if ($("#emailInput").val() === "") {
      $("#switchNotificationDiv").click();
      $("#emailInput").focus();
      $("#emailInput").addClass("invalid_input");
      $("#emailInput").parent().parent().children().addClass("require_field");
      accept_flag = false;
    }
    if (accept_flag) {
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
        message: "<span class='oInProcess' style='margin-top:50px;font-size:16px'>\n    Ваш заказ сейчас регистрируется в нашей системе<br />\n</span>\n<span class='oProcessed' style='display:none;margin-top:50px;font-size:16px'>\n    Ваш заказ успешно зарегистрирован<br />\n    и будет обработан менеджером.<br />\n    На указанный вами электронный адрес отправлена предварительная форма заказа.\n</span><div style='disply:block;margin-top:70px'><a href='' onClick='$.unblockUI(); return false' id='popUpOrderClose' style='display:none;cursor:pointer;'>Закрыть</a></div>"
      });
      sendRow = "";
      $("tr.itemTr").each(function() {
        if ($(this).attr("name").split(":")[0] === "0") {
          return sendRow += "" + $(this).find(".itemCharTd").html() + ":" + $(this).attr("name").split(":")[1] + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";";
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

  block_order = function() {
    $(".next_step").hide();
    $(".return_to_catalog").hide();
    $("#switchDiv").hide();
    $("#tabPrice").attr("href", "/1cengine/site/");
    $("#tabPrice").html("Новый заказ");
    return $("#tabPrice").attr("onClick", "");
  };


  /* LOGIN USER START */

  submit_form = function(passwd) {
    $.ajax({
      type: 'POST',
      url: '/1cengine/py_scripts/user.py',
      async: true,
      data: 'passwd=' + passwd + '&email=' + $('.emailInput').val() + '&funkt=authorize_me',
      success: function(html) {
        var authorization;
        authorization = html;
        authorization = authorization.replace('window.location = "/kabinet/orders/"', "");
        eval(authorization);
        return check_user();
      }
    });
  };

  loginUser = function() {
    var email, passwd;
    passwd = $('.passwdInput').val();
    email = $('.emailInput').val();
    if (passwd !== '' && email !== '') {
      passwd = hex_sha256(passwd);
      submit_form(passwd);
    }
  };

  show_login_user = function() {
    var msg, my_css;
    my_css = {
      borderRadius: '10px',
      fadeIn: 100,
      fadeOut: 100,
      backgroundColor: 'white',
      cursor: 'defaults',
      boxShadow: '0px 0px 5px 5px rgb(207, 207, 207)',
      fontSize: '14px',
      width: '500px',
      height: 'auto',
      paddingTop: '10px',
      textAlign: 'left',
      paddingBottom: '30px'
    };
    msg = "<div class='wrapper'>\n    <span class=\"close_button\">x</span>\n    <h3>Войти как контрагент</h3>\n    <table class=\"loginTable\">\n        <tr>\n            <td>Email:</td>\n        </tr>\n        <tr>\n            <td><input class=\"emailInput\" name=\"email\" /></td>\n        </tr>\n        <tr>\n            <td>Пароль:</td>\n        </tr>\n        <tr>\n            <td><input type=\"password\" class=\"passwdInput\" /></td>\n        </tr>\n    </table>\n    <div class='enterButton'>Войти</div>\n</div>";
    $.blockUI({
      message: msg,
      css: my_css
    });
    $(document).on('keyup', function(e) {
      e.preventDefault();
      if (e.which === 27) {
        return $.unblockUI();
      }
    });
    $(".close_button").click(function() {
      return $.unblockUI();
    });
    return $(".enterButton").click(function() {
      $("body").css("cursor", "wait");
      $(".emailInput").addClass("preloading");
      $(".passwdInput").addClass("preloading");
      return loginUser();
    });
  };

  check_user = function() {
    return $.ajax({
      type: "POST",
      dataType: "json",
      url: "/1cengine/py_scripts/check_user.py",
      async: true,
      data: "",
      success: function(html) {
        var c_select, user;
        user = html;
        $("#emailInput").val(user["Email"]);
        c_select = "<select id=\"counterpartySelect\">";
        $(user["Counterparty"]).each((function(_this) {
          return function(index, element) {
            return c_select += "<option value='" + element + "'>" + element + "</option>";
          };
        })(this));
        c_select += "    <option value=\"Розничный покупатель\">Без контрагента</option>\n</select>";
        $(".counterpartySelectContainer").empty();
        $(".counterpartySelectContainer").append(c_select);
        $(".counterpartyRow").show();
      },
      error: function(html) {
        var c_select;
        c_select = '<noindex><div id="counterpartyLoginButton"><span>Я зарегистрированный контрагент</span></div></noindex>';
        $(".counterpartySelectContainer").empty();
        $(".counterpartySelectContainer").append(c_select);
        $(".counterpartyRow").show();
        $("#counterpartyLoginButton").click(function() {
          return show_login_user();
        });
      }
    });
  };


  /* LOGIN USER END */


  /* Print DA OЯDER */

  this.printOrder = function() {
    var carry, delivery_cost, delivery_info, destination, line_json, order_json, s1, s2, total;
    yaCounter23067595.reachGoal('PrintOrder');
    order_json = {
      "order": [],
      "total": "0"
    };
    $("#basketTab").find("tr.itemTr").each((function(_this) {
      return function(i, el) {
        var line_json;
        line_json = [];
        line_json.push($(el).find(".itemNameTd")[0].innerHTML);
        line_json.push($(el).find(".itemCharTd")[0].innerHTML);
        line_json.push($(el).find(".itemCountTd")[0].innerHTML);
        line_json.push($(el).find(".itemEdIzmTd")[0].innerHTML);
        line_json.push($(el).find(".itemPriceTd")[0].innerHTML);
        line_json.push($(el).find(".itemSumTd")[0].innerHTML);
        return order_json["order"].push(line_json);
      };
    })(this));
    total = $("#SumGoods")[0].innerHTML;
    order_json["total"] = total;
    if ($("#i_want_delivery").prop("checked")) {
      line_json = [];
      destination = "Доставка: " + $(".city_select option:selected").html() + " - " + $(".street_select").val();
      carry = $(".delivery_car").html();
      delivery_info = $(".active_city").attr("name");
      delivery_cost = $(".delivery_cost").html().replace("&nbsp;", "");
      line_json.push(destination);
      line_json.push("");
      line_json.push("1");
      line_json.push('услуга');
      line_json.push(delivery_cost.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(".", ","));
      line_json.push(delivery_cost.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(".", ","));
      order_json["order"].push(line_json);
      s1 = parseFloat(App.MyBasket._sum);
      s2 = parseFloat(delivery_cost);
      console.log(s1 + " + " + s2);
      order_json["total"] = String((s1 + s2).toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(".", ",");
    }
    console.log(JSON.stringify(order_json));
    $.ajax({
      type: "POST",
      url: "/1cengine/py_scripts/return_print_form.py",
      async: false,
      data: "order_json=" + JSON.stringify(order_json) + "",
      success: function(html) {
        var params, x;
        params = "toolbar=no";
        x = window.open("", "Печать заказа Тримет", params);
        x.document.open();
        x.document.write(html);
        x.document.close();
      }
    });
  };


  /* Print DA OЯDER END */

  $(document).ready(function() {
    var GET, curr, i, parts, squery;
    check_user();
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
    $("#tabBasket").tooltipster({
      content: "Товар добавлен в корзину",
      animation: 'fade',
      delay: 200,
      position: 'right',
      timer: 3000,
      trigger: "custom",
      theme: "tooltipster-my"
    });
    return $('#mainPhoneInput').bind('keypress', function(event) {
      var key, regex;
      regex = new RegExp('^[A-Za-zА-Яа-я=\\\\\\[\\]{}`@#%&*|/,\\.\\!\\$\\~_<>\\?]+$');
      key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      if (regex.test(key)) {
        event.preventDefault();
        return false;
      }
    });
  });

}).call(this);
