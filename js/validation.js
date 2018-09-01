function isValidData(value) {
  if ($.isArray(value) || typeof value == "object")
    return typeof value != "undefined" && value != null && value != ""
      ? true
      : false;
  else if (typeof value == "number")
    return typeof value != "undefined" && value != null ? true : false;
  else if (typeof value == "boolean") return true;
  else
    return typeof value != "undefined" &&
      value != null &&
      value != "" &&
      value.trim() != ""
      ? true
      : false;
}

function isNumericValue(value) {
  var returnValue = false;
  try {
    return !isNaN(value);
  } catch (e) {
    console.log(e);
  }
  return returnValue;
}

function checkEmail(value) {
  var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  return emailFilter.test(value);
}

function isValidPhoneNumber(value) {
  var numberFilter = /^\d{10}$/;
  return numberFilter.test(value);
}

function isValidPassword(value) {
  if (value != "") {
    return true;
  } else {
    return false;
  }
}
