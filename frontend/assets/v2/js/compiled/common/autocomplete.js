// Generated by CoffeeScript 1.4.0
var _this = this;

ko.bindingHandlers.autocomplete = {
  init: function(element, valueAccessor) {
    $(document).bind("click", $(element), function(e) {
      return $(e.target).select();
    });
    $(element).typeahead({
      name: 'cities' + valueAccessor().name,
      limit: 5,
      prefetch: '/js/cities.json',
      remote: window.apiEndPoint + "helper/autocomplete/" + valueAccessor().source + '/query/%QUERY',
      template: '<div title="{{value}}"><span class="city">{{name}}, </span><span class="country">{{country}}</span><span class="code">{{code}}</span></div>',
      engine: Hogan
    });
    $(element).on('typeahead:selected typeahead:autocompleted', function(e, data) {
      valueAccessor().iata(data.code);
      valueAccessor().readable(data.name);
      valueAccessor().readableGen(data.nameGen);
      valueAccessor().readableAcc(data.nameAcc);
      valueAccessor().readablePre(data.namePre);
      $(element).val(data.name);
      $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country);
      if ((!$(element).is('.arrivalCity')) && ($('input.arrivalCity').length > 0)) {
        return $('input.arrivalCity.second-path').focus();
      }
    });
    $(element).on('typeahead:over', function(e, data) {
      return $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country);
    });
    $(element).on('typeahead:reset', function(e) {
      return $(element).parent().siblings('input.input-path').val('');
    });
    return $(element).on("keyup", function(e) {
      if ((e.keyCode === 8) || (e.keyCode === 46)) {
        valueAccessor().iata('');
        valueAccessor().readable('');
        valueAccessor().readableGen('');
        valueAccessor().readableAcc('');
        return valueAccessor().readablePre('');
      }
    });
  },
  update: function(element, valueAccessor) {
    var content, iataCode;
    iataCode = valueAccessor().iata();
    content = valueAccessor().readable();
    if (content === void 0) {
      content = iataCode;
    }
    return _.each($(element).typeahead("setQueryInternal", content).data('ttView').datasets, function(dataset) {
      return dataset.getSuggestions(iataCode, function(s) {
        if (s.length > 0) {
          return _.each(s, function(s) {
            var data;
            if (s.datum.code === iataCode) {
              data = s.datum;
              valueAccessor().readable(data.name);
              valueAccessor().readableGen(data.nameGen);
              valueAccessor().readableAcc(data.nameAcc);
              valueAccessor().readablePre(data.namePre);
              if (($(element).val().length === 0) || ($(element).val() !== data.name)) {
                $(element).val(data.name);
                return $(element).parent().siblings('input.input-path').val(data.value + ', ' + data.country);
              }
            }
          });
        }
      });
    });
  }
};
