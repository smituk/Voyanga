// Generated by CoffeeScript 1.3.3
var _this = this;

ko.bindingHandlers.autocomplete = {
  init: function(element, valueAccessor) {
    $(element).bind("focus", function() {
      return $(element).change();
    });
    $(element).autocomplete({
      serviceUrl: "http://api.voyanga.com/v1/helper/autocomplete/" + valueAccessor().source,
      minChars: 2,
      delimiter: /(,|;)\s*/,
      maxHeight: 400,
      zIndex: 9999,
      deferRequestBy: 0,
      delay: 0,
      onSelect: function(value, data) {
        valueAccessor().iata(data.code);
        valueAccessor().readable(data.name);
        valueAccessor().readableGen(data.nameGen);
        valueAccessor().readableAcc(data.nameAcc);
        $(element).val(data.name);
        return $(element).siblings('input.input-path').val(value);
      },
      onActivate: function(value, data) {
        valueAccessor().readable(data.name);
        valueAccessor().readableGen(data.nameGen);
        valueAccessor().readableAcc(data.nameAcc);
        $(element).val(data.name);
        return $(element).siblings('input.input-path').val(value);
      }
    });
    return $(element).on("keyup", function(e) {
      if ((e.keyCode === 8) || (e.keyCode === 46)) {
        valueAccessor().iata('');
        valueAccessor().readable('');
        valueAccessor().readableGen('');
        return valueAccessor().readableAcc('');
      }
    });
  },
  update: function(element, valueAccessor) {
    var handleResults, iataCode, url;
    iataCode = valueAccessor().iata();
    url = function(code) {
      var params, result;
      result = 'http://api.voyanga.com/v1/helper/autocomplete/citiesReadable?';
      params = [];
      params.push('codes[0]=' + code);
      result += params.join("&");
      window.voyanga_debug("Generated autocomplete city url", result);
      return result;
    };
    handleResults = function(data) {
      window.voyanga_debug("Ajax request done for ", data[iataCode]);
      valueAccessor().readable(data[iataCode].name);
      valueAccessor().readableGen(data[iataCode].nameGen);
      valueAccessor().readableAcc(data[iataCode].nameAcc);
      $(element).val(data[iataCode].name);
      return $(element).siblings('input.input-path').val(data[iataCode].label);
    };
    if (iataCode.length > 0) {
      window.voyanga_debug("Invoking ajax request to get city info ", iataCode);
      return $.ajax({
        url: url(iataCode),
        dataType: 'jsonp',
        success: handleResults
      });
    }
  }
};