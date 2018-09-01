$(function() {
  populateExploreCategory();
  initializeHomepageBanner();
  $("body").on("click", "#signUpFormsubbtn", function() {
    submitUserSignUpFormData();
  });
  checkUserAlreadyLoggedIn();
  fetchRecommendation();
  //checkUserLoggedIn();
});

function submitUserSignUpFormData() {
  var validateDataValue = validateUserSignUpFormData();
  if (validateDataValue.valid) {
    var userName = $("#signUpemailId").val();
    var contactNo = $("#signUpMobNo").val();
    var password = $("#signUpPassword").val();
    var validatedData = {
      username: userName,
      password: password,
      contactno: contactNo
    };
    console.log(validatedData);
    ajaxCall(
      webAPIUrl + "/user/signup",
      "POST",
      validatedData,
      submitDataSuccessCallback,
      " ",
      " ",
      " "
    );
  }
}

function submitDataSuccessCallback(response) {
  if (response.success) {
    console.log(response.success);
    alert(response.message);
  }
}

function validateUserSignUpFormData() {
  var flagObj = {};
  flagObj["valid"] = true;

  var emailId = $("#signUpemailId").val();
  if (!checkEmail(emailId)) {
    alert("Enter valid email");
    flagObj["valid"] = false;
    return flagObj;
  }

  var mobileNo = $("#signUpMobNo").val();
  if (!isValidPhoneNumber(mobileNo)) {
    alert("Enter valid mobile no.");
    flagObj["valid"] = false;
    return flagObj;
  }

  var signUpPassword = $("#signUpPassword").val();
  if (!isValidPassword(signUpPassword)) {
    alert("Enter valid password");
    flagObj["valid"] = false;
    return flagObj;
  }

  flagObj["valid"] = true;
  return flagObj;
}

function checkUserLoginSuccessCallback(response) {
  if (response.success) {
    userLoggedAfterOperations();
  } else {
    alert(response.message);
  }
}

function fetchRecommendation() {
  var areaId = getAreaId();
  var cityId = getCityId();

  var recommendationRequestData = {
    areaid: areaId,
    cityid: cityId
  };

  ajaxCall(
    webAPIUrl + "/recommendation/fetch",
    "POST",
    recommendationRequestData,
    recommendationAPISuccessCallback,
    "",
    recommendationAPICompleteCallback,
    ""
  );
}

function recommendationAPISuccessCallback(response) {
  if (response.success) {
    if (
      isValidData(response.data) &&
      isValidData(response.data.productdata) &&
      isValidData(response.data.productdata.products) &&
      response.data.productdata.products.length > 0
    ) {
      var productList = response.data.productdata.products;
      $.each(productList, function(productListArrayIndex, productDetailObject) {
        var template =
          '<div class="pCard">' +
          "<h2>" +
          productDetailObject.name +
          "</h2>" +
          '<p class="info">' +
          "<em>" +
          productDetailObject.quantity +
          '</em> <i class="tag green">15% OFF</i>' +
          "</p>" +
          '<a href="#">' +
          '<img src="https://static.zappfresh.com/images/productimages/' +
          productDetailObject.productid +
          '.jpg" />' +
          "</a>" +
          '<p class="prc">';
        if (getBooleanValue(productDetailObject.comparepriceshow)) {
          template +=
            "<span>" +
            "<strong>&#8377;" +
            productDetailObject.compareprice +
            "</strong>" +
            "<label>&#8377;" +
            productDetailObject.price +
            "</label>" +
            "</span>";
        } else {
          template +=
            "<span>" +
            "<strong>&#8377;" +
            productDetailObject.price +
            "</strong>" +
            "</span>";
        }
        template +=
          '<button class="btnRed fR addToCardBtnCls" id="addToCardBtn' +
          productDetailObject.productid +
          '" data-productId="' +
          productDetailObject.productid +
          '" data-quantity="1">Add to Cart</button>' +
          "</p>" +
          '<div class="clear"></div>' +
          "</div>";
        $("#newArrivalProductList").append(template);
      });
    } else {
      alert("We have not found the product list for your location.");
    }
  } else {
    alert(response.message);
  }
}

function recommendationAPICompleteCallback() {
  $(".recommendationProducts").slick({
    dots: true,
    infinite: true,
    variableWidth: true
  });
}
