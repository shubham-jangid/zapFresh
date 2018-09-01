$(function() {
  handleOpenModalPopupLayers();
  initializeModalPopupLayer();
  initializeSigninSignupModal();
  $("body").on("click", "#loginNowBtn", function() {
    submitLoginData();
  });

  $(document).on("click", ".addToCardBtnCls", function(e) {
    e.preventDefault();
    addToCart(this);
  });
});

$(window).load(function() {
  populateTopMenus();
});

function initializeModalPopupLayer() {
  $("body").on("click", ".modalPopupLayerParent", function(event) {
    event.preventDefault();
    var targetId = $(this).data("target");
    var showoverlay = $(this).data("showoverlay");
    if ($("#" + targetId).hasClass("noshow")) {
      $(".modalPopupLayerChildren").addClass("noshow");
      $("#" + targetId)
        .removeClass("noshow")
        .addClass("show");
      if (showoverlay || showoverlay == "true")
        $("#modal-overlay-id")
          .addClass("show")
          .removeClass("noshow");
    } else {
      $("#" + targetId)
        .removeClass("show")
        .addClass("noshow");
      $("#modal-overlay-id")
        .addClass("noshow")
        .removeClass("show");
    }
    event.stopPropagation();
  });
}

function handleOpenModalPopupLayers() {
  $(document).click(function(event) {
    if (!$(event.target).closest(".modalPopupLayerChildren").length) {
      $("body")
        .find(".modalPopupLayerChildren, #modal-overlay-id")
        .removeClass("show")
        .addClass("noshow");
    }
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      var domELementArrWithModalTarget = $(".modalPopupLayerParent");
      $.each(domELementArrWithModalTarget, function(index, modalDomElement) {
        var currentDomElementTarget = $(this).data("target");
        if ($("#" + currentDomElementTarget).hasClass("show")) {
          $("#" + currentDomElementTarget + ", #modal-overlay-id")
            .removeClass("show")
            .addClass("noshow");
        }
      });
    }
  });
}

function initializeSigninSignupModal() {
  $("body").on("click", "#showLogin", function(event) {
    event.preventDefault();
    $("#signUpModalContr")
      .removeClass("show")
      .addClass("noshow");
    $("#signInModalContr")
      .removeClass("noshow")
      .addClass("show");
  });

  $("body").on("click", "#showSignup", function(event) {
    event.preventDefault();
    $("#signInModalContr")
      .removeClass("show")
      .addClass("noshow");
    $("#signUpModalContr")
      .removeClass("noshow")
      .addClass("show");
  });
}

function populateTopMenus() {
  $.each(categoryArray, function(categoryArrayIndex, categoryArrayObject) {
    $("#categorytop").append(
      '<li><a href="' +
        categoryArrayObject.cathref +
        '" class="' +
        categoryArrayObject.cathref_class +
        '"><i></i><span>' +
        categoryArrayObject.catname +
        "</span></a></li>"
    );
  });
}

function populateExploreCategory() {
  var reverseCategoryArray = categoryArray.reverse();
  $.each(reverseCategoryArray, function(
    exploreCategoryIndex,
    exploreCategoryObject
  ) {
    $("#explorecat").prepend(
      '<a href="#" class="' +
        exploreCategoryObject.expcathref_class +
        '"><div class="bgOvrly"></div><p><strong>' +
        exploreCategoryObject.catname +
        "</strong><span>" +
        exploreCategoryObject.products +
        "</span></p></a>"
    );
  });
}

function initializeHomepageBanner() {
  $.each(homepageTopBannerArray, function(
    homepageTopBannerArrayIndex,
    homepageTopBannerArrayObject
  ) {
    $("#homepagebanner").append(
      '<div><a href="' +
        homepageTopBannerArrayObject.href +
        '"><img src="' +
        homepageTopBannerArrayObject.bannerimage +
        '"></a></div>'
    );
  });

  $(".lazy").slick({
    lazyLoad: "ondemand", // ondemand progressive anticipated
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000
  });
}

function ajaxCall(
  url,
  type,
  data,
  successCallback,
  errorCallback,
  completeCallback,
  additionalParams
) {
  $.ajax({
    url: url,
    method: type,
    data: JSON.stringify(data),
    cache: false,
    success: function(response) {
      if (
        !response.success &&
        (response.errorcode == "UB01" ||
          response.errorcode == "UNL01" ||
          response.errorcode == "UP01")
      ) {
        signout();
      } else {
        if (typeof successCallback === "function") {
          callBackparam = isValidData(additionalParams.successCallback)
            ? additionalParams.successCallback
            : null;
          successCallback(response, callBackparam);
        }
      }
    },
    error: function(error) {
      if (typeof errorCallback === "function") {
        callBackparam = isValidData(additionalParams.errorCallback)
          ? additionalParams.errorCallback
          : null;
        errorCallback(error, callBackparam);
      }
    },
    complete: function() {
      if (typeof completeCallback === "function") {
        callBackparam = isValidData(additionalParams.completeCallback)
          ? additionalParams.completeCallback
          : null;
        completeCallback(callBackparam);
      }
    }
  });
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function getUserToken() {
  return getCookie("usertoken");
}

function checkUserLoggedIn() {
  var userToken = getUserToken();
  if (!isValidData(userToken)) {
    signout();
  }
}

function signout() {
  deleteCookie("userToken");
  deleteCookie("memberBalance");
  deleteCookie("profilePic");
  deleteCookie("userId");
  deleteCookie("userData");
  window.location.href = "//" + window.location.hostname;
}

function submitLoginData() {
  var validateDataValue = validateLoginData();
  if (validateDataValue) {
    var loginUser = $("#loginEmailId").val();
    var loginPass = $("#loginPassword").val();
    var validatedData = {
      username: loginUser,
      password: loginPass
    };
    ajaxCall(
      webAPIUrl + "/user/signin",
      "POST",
      validatedData,
      loginSuccessCallback,
      loginErrorCallback,
      "",
      ""
    );
  }
}

function validateLoginData() {
  var emailPhone = $("#loginEmailId").val();
  if (!checkEmail(emailPhone) && !isValidPhoneNumber(emailPhone)) {
    $("#signInEmailError")
      .html("Please enter valid email id.")
      .addClass("show")
      .removeClass("noshow");
    return false;
  } else {
    $("#signInEmailError")
      .html("")
      .addClass("noshow")
      .removeClass("show");
  }

  var loginPassword = $("#loginPassword").val();
  if (!isValidPassword(loginPassword)) {
    $("#signInPasswordError")
      .html("Please enter valid password.")
      .addClass("show")
      .removeClass("noshow");
    return false;
  } else {
    $("#signInPasswordError")
      .html("")
      .addClass("noshow")
      .removeClass("show");
  }

  return true;
}

function loginSuccessCallback(response) {
  if (response.success) {
    setCookieAfterLogin(response.data);
    userLoggedAfterOperations();
  } else {
    alert(response.message);
  }
}

function setCookieAfterLogin(responseData) {
  if (isValidData(responseData)) {
    var userToken = responseData.webtoken.token;
    var memberBalance = responseData.memberbalance;
    var profilePic = responseData.profilepic;
    var userId = responseData.data.userid;

    setCookie("userToken", userToken, 5);
    setCookie("memberBalance", memberBalance, 5);
    setCookie("profilePic", profilePic, 5);
    setCookie("userId", userId, 5);
    setCookie("userData", responseData, 5);
  }
}

function userLoggedAfterOperations() {
  $("#loginUserActionText")
    .addClass("noshow")
    .removeClass("show");
  $("#myAccountActionText")
    .addClass("show")
    .removeClass("noshow");
  $("#loginUserActionText").trigger("click");

  //window.location.href = "//" + window.location.hostname+"/dashboard.html";
}

function loginErrorCallback(error) {
  console.log(error);
}

function checkUserAlreadyLoggedIn() {
  var userToken = getCookie("userToken");
  if (isValidData(userToken)) {
    checkUserToken(checkUserLoginSuccessCallback);
    //please verify the user token.
  } else {
    deleteCookie("userToken");
    deleteCookie("memberBalance");
    deleteCookie("profilePic");
    deleteCookie("userId");
    deleteCookie("userData");
    $("#myAccountActionText")
      .addClass("noshow")
      .removeClass("show");
    //Clear all the set cookies.
    //Then remove the effect of userLoggedAfterOperations
  }
}

function checkUserToken(sucessCallbackMethod) {
  /*
* API:- /user/check
* Data:- {"token":usertoken}
* Method:- POST
*/
  var userToken = getUserToken();
  var checkUserRequestParam = {
    token: userToken
  };

  ajaxCall(
    webAPIUrl + "/user/check",
    "POST",
    checkUserRequestParam,
    sucessCallbackMethod,
    "",
    "",
    ""
  );
}

function addToCart(that) {
  var productId = $(that).data("productid");
  var quantity = $(that).data("quantity");
  var cartId = isValidData(getCookie("cartId")) ? getCookie("cartId") : "";
  var userToken = isValidData(getCookie("userToken"))
    ? getCookie("userToken")
    : "";

  var addToCartRequestParam = {
    areaid: getAreaId(),
    cityid: getCityId(),
    productid: productId + "",
    quantity: quantity + "",
    cartid: cartId,
    token: userToken
  };

  ajaxCall(
    webAPIUrl + "/cart/add",
    "POST",
    addToCartRequestParam,
    populateHeaderCart,
    "",
    "",
    ""
  );
}

function populateHeaderCart(response) {
  if (response.success) {
    if (
      isValidData(response.data) &&
      isValidData(response.data.cartid) &&
      isValidData(response.data.cartitems)
    ) {
      var cartItemsList = response.data.cartitems;
      var itemCount = 0;
      var cartId = response.data.cartid;
      $("#addedCartItemsList")
        .children()
        .remove();
      $.each(cartItemsList, function(productId, cartProductDetailsObj) {
        var template =
          '<div class="dspTable wFull crtLst mar30 mbottom">' +
          '<div class="dspTblCell vaT">' +
          '<img src="https://static.zappfresh.com/images/cartlist/' +
          cartProductDetailsObj.productid +
          '.jpg" />' +
          "</div>" +
          '<div class="dspTblCell vaT pad20 pright pleft">' +
          '<strong class="dspBlock">' +
          cartProductDetailsObj.name +
          "</strong>" +
          '<small class="dspBlock tgrey f11 mar5 mtop">' +
          cartProductDetailsObj.quantity +
          " (4 variants)</small>" +
          '<p class="mar20 mtop">' +
          '<strong class="dsplNBlock vam mar20 mright">Quantity</strong>' +
          '<a href="#" class="dsplNBlock vam hasbrdr tblack f13 addToCardBtnCls" style="padding: 6px 13px;" data-productId="' +
          cartProductDetailsObj.productid +
          '" data-quantity="-1">-</a>' +
          '<span class="dsplNBlock vam mar20 mright mleft">' +
          cartProductDetailsObj.purchasequantity +
          "</span>" +
          '<a href="#" class="dsplNBlock vam hasbrdr tblack f13 addToCardBtnCls" style="padding: 6px 13px;" data-productId="' +
          cartProductDetailsObj.productid +
          '" data-quantity="1">+</a>' +
          "</p>" +
          "</div>" +
          '<div class="dspTblCell vaT pad30 pleft">' +
          "<p>" +
          '<strong class="dsplNBlock mar10 mright vam">&#8377; ' +
          cartProductDetailsObj.netpricewithtax +
          "</strong>" +
          '<a href="#" class="ico_delete addToCardBtnCls" data-productId="' +
          cartProductDetailsObj.productid +
          '" data-quantity="' +
          cartProductDetailsObj.purchasequantity +
          '"></a>' +
          "</p>" +
          "</div>" +
          "</div>";
        $("#addedCartItemsList").append(template);
        itemCount++;
      });

      $("#totalPayableAmount").html(response.data.discountedpricetodisplay);
      $("#cartItemCount").html(itemCount);
      setCookie("cartId", cartId, 30);
    } else {
      alert("Error in creating cart.");
    }
  } else {
    alert(response.message);
  }
}

function getBooleanValue(value) {
  var num = +value;
  return !isNaN(num)
    ? !!num
    : !!String(value)
        .toLowerCase()
        .replace(!!0, "");
}

function getAreaId() {
  return isValidData(getCookie("areaId")) ? getCookie("areaId") : "1085";
}

function getCityId() {
  return isValidData(getCookie("cityId")) ? getCookie("cityId") : "4";
}
