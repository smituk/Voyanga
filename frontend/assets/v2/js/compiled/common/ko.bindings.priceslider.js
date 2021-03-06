// Generated by CoffeeScript 1.4.0

ko.bindingHandlers.priceSlider = {
  init: function(element, valueAccessor) {
    var limits, value;
    value = ko.utils.unwrapObservable(valueAccessor().selection);
    limits = ko.utils.unwrapObservable(valueAccessor().limits);
    if (limits.from < 0) {
      limits.from = 0;
    }
    console.log(limits.to);
    if (!Utils.inRange(value.from, limits)) {
      value.from = limits.from;
    }
    if (!Utils.inRange(value.to, limits)) {
      value.to = limits.to;
    }
    $(element).val(value.from + ';' + value.to);
    $(element).jslider({
      from: limits.from,
      to: limits.to,
      dimension: '&nbsp;Р',
      skin: 'round_voyanga',
      scale: false,
      limits: false,
      minInterval: 60,
      calculate: function(value) {
        var strVal;
        strVal = value.toString();
        if (strVal.length > 3) {
          strVal = strVal.substr(0, strVal.length - 3) + '&nbsp;' + strVal.substr(-3);
        }
        return strVal;
      },
      callback: function(newValue) {
        return valueAccessor().selection(newValue);
      }
    });
    return valueAccessor().element = $(element);
  },
  update: function(element, valueAccessor) {
    var s;
    s = $(element).data("jslider");
    return setTimeout(function() {
      return s.onresize();
    }, 5);
  }
};
