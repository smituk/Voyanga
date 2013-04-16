// Generated by CoffeeScript 1.4.0
var AviaResult, AviaResultSet, FIRST_TWO_HOURS_PRICE, FlightPart, REST_HOURS_PRICE, Voyage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

FIRST_TWO_HOURS_PRICE = 600;

REST_HOURS_PRICE = 800;

FlightPart = (function() {

  function FlightPart(part) {
    this.markOrTransportAirline = __bind(this.markOrTransportAirline, this);
    this.part = part;
    this.departureDate = Date.fromISO(part.datetimeBegin + Utils.tzOffset);
    this.arrivalDate = Date.fromISO(part.datetimeEnd + Utils.tzOffset);
    this.departureCity = part.departureCity;
    this.departureCityPre = part.departureCityPre;
    this.departureAirport = part.departureAirport;
    this.aircraftName = part.aircraftName;
    this.arrivalCity = part.arrivalCity;
    this.arrivalCityPre = part.arrivalCityPre;
    this.arrivalAirport = part.arrivalAirport;
    this._duration = part.duration;
    this.transportAirline = part.transportAirline;
    this.transportAirlineName = part.transportAirlineNameEn;
    this.markAirline = part.markAirline;
    this.markAirlineName = part.markAirlineNameEn;
    this.flightCode = part.markAirline + ' ' + part.flightCode;
    this.stopoverLength = 0;
  }

  FlightPart.prototype.departureTime = function() {
    return dateUtils.formatTime(this.departureDate);
  };

  FlightPart.prototype.arrivalTime = function() {
    return dateUtils.formatTime(this.arrivalDate);
  };

  FlightPart.prototype.duration = function() {
    return dateUtils.formatDuration(this._duration);
  };

  FlightPart.prototype.departureCityStopoverText = function() {
    return "Пересадка в " + this.departureCityPre + ", " + this.stopoverText();
  };

  FlightPart.prototype.calculateStopoverLength = function(anotherPart) {
    return this.stopoverLength = Math.floor((anotherPart.departureDate.getTime() - this.arrivalDate.getTime()) / 1000);
  };

  FlightPart.prototype.stopoverText = function() {
    return dateUtils.formatDuration(this.stopoverLength);
  };

  FlightPart.prototype.markOrTransportAirline = function() {
    if (window.use_transport === '1') {
      return this.transportAirline;
    } else {
      return this.markAirline;
    }
  };

  return FlightPart;

})();

Voyage = (function() {

  function Voyage(flight, airline) {
    var index, part, stopoverInHours, _i, _j, _len, _len1, _ref, _ref1;
    this.airline = airline;
    this.parts = [];
    _ref = flight.flightParts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      this.parts.push(new FlightPart(part));
    }
    this.flightKey = flight.flightKey;
    this.hasStopover = this.stopoverCount > 1 ? true : false;
    this.stopoverLength = 0;
    this.maxStopoverLength = 0;
    this.stopoverPrice = 0;
    this.direct = this.parts.length === 1;
    if (!this.direct) {
      _ref1 = this.parts;
      for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
        part = _ref1[index];
        if (index < (this.parts.length - 1)) {
          part.calculateStopoverLength(this.parts[index + 1]);
        }
        this.stopoverLength += part.stopoverLength;
        if (part.stopoverLength > this.maxStopoverLength) {
          this.maxStopoverLength = part.stopoverLength;
        }
        stopoverInHours = part.stopoverLength / (60 * 60);
        if (stopoverInHours < 2) {
          this.stopoverPrice += stopoverInHours * FIRST_TWO_HOURS_PRICE;
        } else {
          this.stopoverPrice += 2 * FIRST_TWO_HOURS_PRICE + (stopoverInHours - 2) * REST_HOURS_PRICE;
        }
      }
    }
    this.departureDate = Date.fromISO(flight.departureDate + Utils.tzOffset);
    this.arrivalDate = new Date(this.parts[this.parts.length - 1].arrivalDate);
    this._duration = flight.fullDuration;
    this.departureAirport = this.parts[0].departureAirport;
    this.arrivalAirport = this.parts[this.parts.length - 1].arrivalAirport;
    this.departureCity = flight.departureCity;
    this.arrivalCity = flight.arrivalCity;
    this.departureCityPre = flight.departureCityPre;
    this.arrivalCityPre = flight.arrivalCityPre;
    this._backVoyages = [];
    this.activeBackVoyage = ko.observable();
    this.visible = ko.observable(true);
  }

  Voyage.prototype.departureInt = function() {
    return this.departureDate.getTime();
  };

  Voyage.prototype.hash = function() {
    return this.departureTime() + this.arrivalTime();
  };

  Voyage.prototype.similarityHash = function() {
    return this.hash() + this.airline;
  };

  Voyage.prototype.push = function(voyage) {
    if (!this.activeBackVoyage()) {
      this.activeBackVoyage(voyage);
    }
    return this._backVoyages.push(voyage);
  };

  Voyage.prototype.stacked = function() {
    var count, result, voyage, _i, _len, _ref;
    result = false;
    count = 0;
    _ref = this._backVoyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      if (voyage.visible()) {
        count++;
      }
      if (count > 1) {
        result = true;
        break;
      }
    }
    return result;
  };

  Voyage.prototype.departureDayMo = function() {
    return dateUtils.formatDayMonth(this.departureDate);
  };

  Voyage.prototype.departurePopup = function() {
    return dateUtils.formatDayMonthWeekday(this.departureDate);
  };

  Voyage.prototype.departureTime = function() {
    return dateUtils.formatTime(this.departureDate);
  };

  Voyage.prototype.departureTimeNumeric = function() {
    return dateUtils.formatTimeInMinutes(this.departureDate);
  };

  Voyage.prototype.arrivalDayMo = function() {
    return dateUtils.formatDayMonth(this.arrivalDate);
  };

  Voyage.prototype.arrivalTime = function() {
    return dateUtils.formatTime(this.arrivalDate);
  };

  Voyage.prototype.arrivalTimeNumeric = function() {
    return dateUtils.formatTimeInMinutes(this.arrivalDate);
  };

  Voyage.prototype.duration = function() {
    return dateUtils.formatDuration(this._duration);
  };

  Voyage.prototype.stopoverText = function() {
    var part, result, _i, _len, _ref;
    if (this.direct) {
      return "Без пересадок";
    }
    result = [];
    if (this.parts.length === 2) {
      part = this.parts[0];
      return "Пересадка в " + part.arrivalCityPre + ", " + this.parts[0].stopoverText();
    }
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push(part.arrivalCityPre);
    }
    return "Пересадка в " + result.join(', ');
  };

  Voyage.prototype.stopoverRelText = function() {
    var part, result, _i, _len, _ref;
    if (this.direct) {
      return "Без пересадок";
    }
    result = [];
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push('Пересадка в ' + part.arrivalCityPre + ', ' + part.stopoverText());
    }
    return result.join('<br />');
  };

  Voyage.prototype.stopsRatio = function() {
    var data, duration, htmlResult, index, part, result, _i, _j, _k, _len, _len1, _len2, _ref;
    result = [];
    if (this.direct) {
      return '<span class="down"></span>';
    }
    duration = _.reduce(this.parts, function(memo, part) {
      return memo + part._duration;
    }, 0);
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      result.push({
        left: Math.ceil(part._duration / duration * 80),
        part: part
      });
    }
    for (index = _j = 0, _len1 = result.length; _j < _len1; index = ++_j) {
      data = result[index];
      if (data.left < 18) {
        data.left = 18;
      }
      if (index > 0) {
        result[index].left = result[index - 1].left + data.left;
      } else {
        result[index].left = data.left;
      }
    }
    htmlResult = "";
    for (_k = 0, _len2 = result.length; _k < _len2; _k++) {
      data = result[_k];
      htmlResult += this.getCupHtmlForPart(data.part, "left: " + data.left + '%');
    }
    htmlResult += '<span class="down"></span>';
    return htmlResult;
  };

  Voyage.prototype.stopoverHtml = function() {
    var htmlResult, part, _i, _len, _ref;
    if (this.direct) {
      return '<span class="path"></span>';
    }
    htmlResult = '';
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      if (part.stopoverLength > 0) {
        htmlResult += this.getCupHtmlForPart(part);
      }
    }
    return htmlResult;
  };

  Voyage.prototype._formatStopOver = function(part) {
    return 'Пересадка в ' + part.arrivalCityPre + ', ' + part.stopoverText();
  };

  Voyage.prototype.getCupHtmlForPart = function(part, style) {
    var cupClass;
    if (style == null) {
      style = "";
    }
    cupClass = part.stopoverLength < 2.5 * 60 * 60 ? "cup" : "cup long";
    return '<span class="' + cupClass + ' tooltip" rel="' + this._formatStopOver(part) + '" style="' + style + '"></span>';
  };

  Voyage.prototype.recommendStopoverIco = function() {
    var part, tooltip, _i, _len, _ref;
    if (this.direct) {
      return;
    }
    tooltip = [];
    _ref = this.parts.slice(0, -1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      part = _ref[_i];
      tooltip.push(this._formatStopOver(part));
    }
    return '<span class="cup tooltip" rel="' + tooltip.join("<br>") + '"></span>';
  };

  Voyage.prototype.sort = function() {
    this._backVoyages.sort(function(a, b) {
      return a.departureInt() - b.departureInt();
    });
    return this.activeBackVoyage(this._backVoyages[0]);
  };

  Voyage.prototype.removeSimilar = function() {
    var best, item, key, voyage, _helper, _i, _len, _ref;
    if (this._backVoyages.length < 2) {
      return;
    }
    _helper = {};
    _ref = this._backVoyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      key = voyage.airline + voyage.departureInt();
      item = _helper[key];
      if (item) {
        _helper[key] = item.stopoverLength < voyage.stopoverLength ? item : voyage;
      } else {
        _helper[key] = voyage;
      }
    }
    this._backVoyages = [];
    for (key in _helper) {
      item = _helper[key];
      this._backVoyages.push(item);
    }
    best = _.sortBy(this._backVoyages, "stopoverPrice");
    return this.activeBackVoyage(best[0]);
  };

  Voyage.prototype.chooseActive = function() {
    var active;
    if (this._backVoyages.length === 0) {
      return;
    }
    if (this.activeBackVoyage().visible()) {
      return;
    }
    active = _.find(this._backVoyages, function(voyage) {
      return voyage.visible();
    });
    if (!active) {
      this.visible(false);
      return;
    }
    return this.activeBackVoyage(active);
  };

  return Voyage;

})();

AviaResult = (function() {

  function AviaResult(data, parent) {
    var fields, flights, name, rtName, v, _i, _len,
      _this = this;
    this.parent = parent;
    this.GAAdults = __bind(this.GAAdults, this);

    this.GAData = __bind(this.GAData, this);

    this.GAKey = __bind(this.GAKey, this);

    this.getPostData = __bind(this.getPostData, this);

    this.getParams = __bind(this.getParams, this);

    this.directRating = __bind(this.directRating, this);

    this.chooseActive = __bind(this.chooseActive, this);

    this.showDetailsOverview = __bind(this.showDetailsOverview, this);

    this.showDetails = __bind(this.showDetails, this);

    this.showDetailsPopup = __bind(this.showDetailsPopup, this);

    this.minimizeRtStacked = __bind(this.minimizeRtStacked, this);

    this.minimizeStacked = __bind(this.minimizeStacked, this);

    this.chooseNextRtStacked = __bind(this.chooseNextRtStacked, this);

    this.choosePrevRtStacked = __bind(this.choosePrevRtStacked, this);

    this.chooseRtStacked = __bind(this.chooseRtStacked, this);

    this.chooseNextStacked = __bind(this.chooseNextStacked, this);

    this.choosePrevStacked = __bind(this.choosePrevStacked, this);

    this.chooseStacked = __bind(this.chooseStacked, this);

    this.rtFlightCodes = __bind(this.rtFlightCodes, this);

    this.flightCodes = __bind(this.flightCodes, this);

    this.flightKey = __bind(this.flightKey, this);

    this.rtAirlineName = __bind(this.rtAirlineName, this);

    this.rtServiceClass = __bind(this.rtServiceClass, this);

    this.rtFirstAirlineName = __bind(this.rtFirstAirlineName, this);

    this.rtFirstAirline = __bind(this.rtFirstAirline, this);

    this.firstAirlineName = __bind(this.firstAirlineName, this);

    this.firstAirline = __bind(this.firstAirline, this);

    this.rtFlightCodesText = __bind(this.rtFlightCodesText, this);

    this.isFlight = true;
    this.isHotel = false;
    _.extend(this, Backbone.Events);
    this._data = data;
    this._stacked_data = [];
    flights = data.flights;
    this.searchId = data.searchId;
    this.cacheId = data.cacheId;
    this.key = data.key;
    this.pdfLink = '/buy/pdf/id/' + this.key;
    this.price = Math.ceil(data.price);
    this._stacked = false;
    if (!flights) {
      console.log('data', data);
    }
    this.roundTrip = flights.length === 2;
    this.visible = ko.observable(true);
    this.airline = data.valCompany;
    this.searchService = data.service;
    this.airlineName = data.valCompanyNameEn;
    this.serviceClass = data.serviceClass;
    this.serviceClassReadable = data.serviceClass === 'E' ? 'Эконом' : data.serviceClass === 'F' ? 'Первый' : 'Бизнес';
    this.refundable = data.refundable;
    this.refundableText = this.refundable ? "Билет возвратный" : "Билет не возвратный";
    this.showRefundable = window.enterCredentials && !this.refundable ? false : true;
    this.freeWeight = data.freeWeight;
    if (this.freeWeight === '0') {
      this.freeWeight = '$';
    }
    this.freeWeightText = data.freeWeightDescription;
    flights[0].flightKey = data.flightKey;
    this.activeVoyage = new Voyage(flights[0], this.airline);
    if (this.roundTrip) {
      flights[1].flightKey = data.flightKey;
      v = new Voyage(flights[1], this.airline);
      this.activeVoyage.push(v);
    }
    this.voyages = [];
    this.voyages.push(this.activeVoyage);
    this.activeVoyage = ko.observable(this.activeVoyage);
    this.ratingAugment = ko.observable(0);
    this.rating = ko.computed(function() {
      var result;
      result = _this.price + _this.activeVoyage().stopoverPrice;
      if (_this.roundTrip) {
        result += _this.activeVoyage().activeBackVoyage().stopoverPrice;
      }
      return Math.floor(result + _this.ratingAugment());
    });
    this.stackedMinimized = ko.observable(true);
    this.rtStackedMinimized = ko.observable(true);
    this.flightCodesText = _.size(this.activeVoyage().parts) > 1 ? "Рейсы" : "Рейс";
    this.totalPeople = 0;
    fields = ['departureCity', 'departureAirport', 'departureDayMo', 'departureDate', 'departurePopup', 'departureTime', 'arrivalCity', 'arrivalAirport', 'arrivalDayMo', 'arrivalDate', 'arrivalTime', 'duration', '_duration', 'direct', 'stopoverText', 'stopoverRelText', 'departureTimeNumeric', 'arrivalTimeNumeric', 'hash', 'similarityHash', 'stopsRatio', 'recommendStopoverIco'];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      name = fields[_i];
      this[name] = (function(name) {
        return function() {
          var field;
          field = this.activeVoyage()[name];
          if ((typeof field) === 'function') {
            return field.apply(this.activeVoyage());
          }
          return field;
        };
      })(name);
      rtName = 'rt' + name.charAt(0).toUpperCase() + name.slice(1);
      this[rtName] = (function(name) {
        return function() {
          var field;
          field = this.activeVoyage().activeBackVoyage()[name];
          if ((typeof field) === 'function') {
            return field.apply(this.activeVoyage().activeBackVoyage());
          }
          return field;
        };
      })(name);
    }
  }

  AviaResult.prototype.rtFlightCodesText = function() {
    if (_.size(this.activeVoyage().activeBackVoyage().parts) > 1) {
      return "Рейсы";
    } else {
      return "Рейс";
    }
  };

  AviaResult.prototype.firstAirline = function() {
    if (window.use_transport === '1') {
      return this.activeVoyage().parts[0].transportAirline;
    } else {
      return this.activeVoyage().parts[0].markAirline;
    }
  };

  AviaResult.prototype.firstAirlineName = function() {
    if (window.use_transport === '1') {
      return this.activeVoyage().parts[0].transportAirlineName;
    } else {
      return this.activeVoyage().parts[0].markAirlineName;
    }
  };

  AviaResult.prototype.rtFirstAirline = function() {
    if (window.use_transport === '1') {
      return this.activeVoyage().activeBackVoyage().parts[0].transportAirline;
    } else {
      return this.activeVoyage().activeBackVoyage().parts[0].markAirline;
    }
  };

  AviaResult.prototype.rtFirstAirlineName = function() {
    if (window.use_transport === '1') {
      return this.activeVoyage().activeBackVoyage().parts[0].transportAirlineName;
    } else {
      return this.activeVoyage().activeBackVoyage().parts[0].markAirlineName;
    }
  };

  AviaResult.prototype.rtServiceClass = function() {
    return this.activeVoyage().serviceClass;
  };

  AviaResult.prototype.rtAirlineName = function() {
    return console.log(this.activeVoyage().activeBackVoyage());
  };

  AviaResult.prototype.flightKey = function() {
    if (this.roundTrip) {
      return this.activeVoyage().activeBackVoyage().flightKey;
    }
    return this.activeVoyage().flightKey;
  };

  AviaResult.prototype.flightCodes = function() {
    var codes;
    codes = _.map(this.activeVoyage().parts, function(flight) {
      return '<span class="tooltip" rel="' + flight.departureCity + ' - ' + flight.arrivalCity + '"><nobr>' + flight.flightCode + "</nobr></span>";
    });
    return Utils.implode(', ', codes);
  };

  AviaResult.prototype.rtFlightCodes = function() {
    var codes;
    codes = _.map(this.activeVoyage().activeBackVoyage().parts, function(flight) {
      return '<span class="tooltip" rel="' + flight.departureCity + ' - ' + flight.arrivalCity + '"><nobr>' + flight.flightCode + "</nobr></span>";
    });
    return Utils.implode(', ', codes);
  };

  AviaResult.prototype.isActive = function() {
    if (this.parent.selected_best()) {
      return this.parent.selected_key() === this.key;
    }
    return this.parent.selected_key() === this.key;
  };

  AviaResult.prototype.stacked = function() {
    var count, voyage, _i, _len, _ref;
    count = 0;
    _ref = this.voyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      if (voyage.visible()) {
        count++;
      }
      if (count > 1) {
        return true;
      }
    }
    return false;
  };

  AviaResult.prototype.rtStacked = function() {
    var count, voyage, _i, _len, _ref;
    count = 0;
    _ref = this.activeVoyage()._backVoyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      if (voyage.visible()) {
        count++;
      }
      if (count > 1) {
        return true;
      }
    }
    return false;
  };

  AviaResult.prototype.push = function(data) {
    var backVoyage, newVoyage, result;
    this._stacked = true;
    data.flights[0].flightKey = data.flightKey;
    newVoyage = new Voyage(data.flights[0], this.airline);
    this._stacked_data.push(data);
    if (this.roundTrip) {
      data.flights[1].flightKey = data.flightKey;
      backVoyage = new Voyage(data.flights[1], this.airline);
      newVoyage.push(backVoyage);
      result = _.find(this.voyages, function(voyage) {
        return voyage.hash() === newVoyage.hash();
      });
      if (result) {
        result.push(backVoyage);
        return;
      }
    }
    return this.voyages.push(newVoyage);
  };

  AviaResult.prototype.chooseStacked = function(voyage) {
    var backVoyage, hash;
    if (this.roundTrip) {
      hash = this.activeVoyage().activeBackVoyage().hash();
    }
    this.activeVoyage(voyage);
    backVoyage = _.find(voyage._backVoyages, function(el) {
      return el.visible() && (el.hash() === hash);
    });
    if (backVoyage) {
      return this.activeVoyage().activeBackVoyage(backVoyage);
    }
  };

  AviaResult.prototype.choosePrevStacked = function() {
    var active_index, index, voyage, _i, _len, _ref;
    active_index = 0;
    _ref = this.voyages;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      voyage = _ref[index];
      if (voyage.hash() === this.hash()) {
        active_index = index;
      }
    }
    if (active_index === 0) {
      return;
    }
    return this.activeVoyage(this.voyages[active_index - 1]);
  };

  AviaResult.prototype.chooseNextStacked = function() {
    var active_index, index, voyage, _i, _len, _ref;
    active_index = 0;
    _ref = this.voyages;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      voyage = _ref[index];
      if (voyage.hash() === this.hash()) {
        active_index = index;
      }
    }
    if (active_index === this.voyages.length - 1) {
      return;
    }
    return this.activeVoyage(this.voyages[active_index + 1]);
  };

  AviaResult.prototype.chooseRtStacked = function(voyage) {
    return this.activeVoyage().activeBackVoyage(voyage);
  };

  AviaResult.prototype.choosePrevRtStacked = function() {
    var active_index, index, rtVoyages, voyage, _i, _len;
    active_index = 0;
    rtVoyages = this.rtVoyages();
    for (index = _i = 0, _len = rtVoyages.length; _i < _len; index = ++_i) {
      voyage = rtVoyages[index];
      if (voyage.hash() === this.rtHash()) {
        active_index = index;
      }
    }
    if (active_index === 0) {
      return;
    }
    return this.activeVoyage().activeBackVoyage(rtVoyages[active_index - 1]);
  };

  AviaResult.prototype.chooseNextRtStacked = function() {
    var active_index, index, rtVoyages, voyage, _i, _len;
    active_index = 0;
    rtVoyages = this.rtVoyages();
    for (index = _i = 0, _len = rtVoyages.length; _i < _len; index = ++_i) {
      voyage = rtVoyages[index];
      if (voyage.hash() === this.rtHash()) {
        active_index = index;
      }
    }
    if (active_index === rtVoyages.length - 1) {
      return;
    }
    return this.activeVoyage().activeBackVoyage(rtVoyages[active_index + 1]);
  };

  AviaResult.prototype.minimizeStacked = function() {
    return this.stackedMinimized(!this.stackedMinimized());
  };

  AviaResult.prototype.minimizeRtStacked = function() {
    return this.rtStackedMinimized(!this.rtStackedMinimized());
  };

  AviaResult.prototype.rtVoyages = function() {
    return this.activeVoyage()._backVoyages;
  };

  AviaResult.prototype.sort = function() {
    this.voyages.sort(function(a, b) {
      return a.departureInt() - b.departureInt();
    });
    if (this.roundTrip) {
      _.each(this.voyages, function(x) {
        x.sort();
        return x.removeSimilar();
      });
    }
    return this.activeVoyage(this.voyages[0]);
  };

  AviaResult.prototype.removeSimilar = function() {
    var arrivalComfort, best, departureComfort, diff, item, key, voyage, _helper, _i, _len, _ref;
    if (this.voyages.length < 2) {
      return;
    }
    _helper = {};
    _ref = this.voyages;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      voyage = _ref[_i];
      key = voyage.airline + voyage.departureInt();
      item = _helper[key];
      if (item) {
        _helper[key] = item.stopoverLength < voyage.stopoverLength ? item : voyage;
      } else {
        _helper[key] = voyage;
      }
    }
    this.voyages = [];
    for (key in _helper) {
      item = _helper[key];
      this.voyages.push(item);
    }
    best = _.sortBy(this.voyages, "stopoverPrice");
    best = best[0];
    this.activeVoyage(best);
    if (!this.roundTrip) {
      return;
    }
    arrivalComfort = false;
    departureComfort = false;
    diff = Math.abs(moment(this.departureDate()).diff(moment(this.rtDepartureDate()), 'days'));
    if (diff > 3) {
      return;
    }
    if (this.arrivalTimeNumeric() >= 6 * 60 && this.arrivalTimeNumeric() <= 12.5 * 60) {
      arrivalComfort = true;
    }
    if (this.rtDepartureTimeNumeric() >= 18.5 * 60 && this.arrivalTimeNumeric() <= 24 * 60) {
      departureComfort = true;
    }
    if (arrivalComfort && departureComfort) {
      return this.ratingAugment(-2000);
    }
  };

  AviaResult.prototype.showDetailsPopup = function() {
    this.parent._popup = new GenericPopup('#avia-body-popup', this);
    ko.processAllDeferredBindingUpdates();
    SizeBox('avia-body-popup');
    return ResizeBox('avia-body-popup');
  };

  AviaResult.prototype.showDetails = function(res, evnt) {
    this.overviewMode = false;
    this.parent._popupElem = evnt;
    return this.showDetailsPopup();
  };

  AviaResult.prototype.showDetailsOverview = function() {
    this.overviewMode = true;
    return this.showDetailsPopup();
  };

  AviaResult.prototype.chooseActive = function() {
    var active;
    if (this.visible() === false) {
      return;
    }
    if (this.activeVoyage().visible()) {
      return;
    }
    active = _.find(this.voyages, function(voyage) {
      return voyage.visible();
    });
    if (!active) {
      this.visible(false);
      return;
    }
    return this.activeVoyage(active);
  };

  AviaResult.prototype.directRating = function() {
    var base, d;
    base = 1;
    if (this.direct()) {
      base += 1;
    }
    if (this.roundTrip) {
      if (this.rtDirect()) {
        base += 1;
      }
    }
    d = this._duration();
    if (this.roundTrip) {
      d += this.rt_duration();
    }
    return d / base;
  };

  AviaResult.prototype.getParams = function() {
    var result;
    result = {};
    if (this.activeVoyage()) {
      result.airlineCode = this.airline;
      result.rt = this.roundTrip ? 'true' : 'false';
      result.departureDateTime = this.departureDate();
      result.arrivalDateTime = this.arrivalDate();
      if (this.roundTrip) {
        result.rtDepartureDateTime = this.rtDepartureDate();
        result.rtArrivalDateTime = this.rtArrivalDate();
      }
    }
    return JSON.stringify(result);
  };

  AviaResult.prototype.getPostData = function() {
    var result;
    result = {};
    result.data = this._data;
    result.type = 'avia';
    return result;
  };

  AviaResult.prototype.GAKey = function() {
    var sp;
    if (this.rawSP) {
      sp = this.rawSP;
    } else {
      sp = this.parent.rawSP;
    }
    return sp.destinations[0].departure_iata + "/" + sp.destinations[0].arrival_iata;
  };

  AviaResult.prototype.GAData = function() {
    var passangers, rawSP, result;
    result = '';
    if (this.roundTrip) {
      result += '2';
    } else {
      result += '1';
    }
    if (this.parent.rawSP) {
      rawSP = this.parent.rawSP;
    } else {
      rawSP = this.rawSP;
    }
    passangers = [rawSP.adt, rawSP.chd, rawSP.inf];
    result += ', ' + passangers.join(" - ");
    result += ', ' + moment(this.departureDate()).format('D.M.YYYY');
    if (this.roundTrip) {
      result += ' - ' + moment(this.rtDepartureDate()).format('D.M.YYYY');
    }
    result += ', ' + moment(this.departureDate()).diff(moment(), 'days');
    if (this.roundTrip) {
      result += ' - ' + moment(this.rtDepartureDate()).diff(moment(this.departureDate()), 'days');
    }
    return result;
  };

  AviaResult.prototype.GAAdults = function() {
    var rawSP;
    if (this.parent.rawSP) {
      rawSP = this.parent.rawSP;
    } else {
      rawSP = this.rawSP;
    }
    return rawSP.adt;
  };

  return AviaResult;

})();

AviaResultSet = (function() {

  function AviaResultSet(rawVoyages, siblings) {
    var filteredVoyages, flight, flightVoyage, item, key, part, result, _i, _interlines, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2,
      _this = this;
    this.siblings = siblings != null ? siblings : false;
    this.getFilterLessBest = __bind(this.getFilterLessBest, this);

    this.setBest = __bind(this.setBest, this);

    this.updateBest = __bind(this.updateBest, this);

    this.updateCheapest = __bind(this.updateCheapest, this);

    this.postFilters = __bind(this.postFilters, this);

    this.processSiblings = __bind(this.processSiblings, this);

    this.postInit = __bind(this.postInit, this);

    this.findAndSelectHash = __bind(this.findAndSelectHash, this);

    this.findAndSelect = __bind(this.findAndSelect, this);

    this.onAfterSelect = __bind(this.onAfterSelect, this);

    this.select = __bind(this.select, this);

    this.injectSearchParams = __bind(this.injectSearchParams, this);

    this.recommendTemplate = 'avia-cheapest-result';
    this.tours = false;
    this.selected_key = ko.observable('');
    this.selected_best = ko.observable(false);
    this.creationMoment = moment();
    this._results = {};
    this.noresults = rawVoyages.length === 0;
    _interlines = {};
    for (_i = 0, _len = rawVoyages.length; _i < _len; _i++) {
      flightVoyage = rawVoyages[_i];
      key = '';
      if (flightVoyage.serviceClass === 'E') {
        key = 'E';
      }
      _ref = flightVoyage.flights;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        flight = _ref[_j];
        _ref1 = flight.flightParts;
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          part = _ref1[_k];
          key += part.datetimeBegin;
          key += part.datetimeEnd;
        }
      }
      if (_interlines[key]) {
        if (_interlines[key].price > flightVoyage.price) {
          _interlines[key] = flightVoyage;
        }
      } else {
        _interlines[key] = flightVoyage;
      }
    }
    filteredVoyages = [];
    for (key in _interlines) {
      item = _interlines[key];
      filteredVoyages.push(item);
    }
    for (_l = 0, _len3 = filteredVoyages.length; _l < _len3; _l++) {
      flightVoyage = filteredVoyages[_l];
      key = flightVoyage.price + "_" + flightVoyage.valCompany;
      if (this._results[key]) {
        this._results[key].push(flightVoyage);
      } else {
        result = new AviaResult(flightVoyage, this);
        this._results[key] = result;
        result.key = key;
      }
    }
    this.cheapest = ko.observable();
    this.best = ko.observable();
    this.data = [];
    this.numResults = ko.observable(0);
    this.filtersConfig = false;
    _ref2 = this._results;
    for (key in _ref2) {
      result = _ref2[key];
      result.sort();
      result.removeSimilar();
      this.data.push(result);
    }
    this.data.sort(function(left, right) {
      return left.price - right.price;
    });
    this.postFilters();
  }

  AviaResultSet.prototype.injectSearchParams = function(sp) {
    this.rawSP = sp;
    this.arrivalCity = sp.destinations[0].arrival;
    this.departureCity = sp.destinations[0].departure;
    this.rawDate = moment(Date.fromISO(sp.destinations[0].date + Utils.tzOffset));
    this.date = dateUtils.formatDayShortMonth(Date.fromISO(sp.destinations[0].date + Utils.tzOffset));
    this.dateHeadingText = this.date;
    this.roundTrip = sp.isRoundTrip;
    if (this.roundTrip) {
      this.rtDate = dateUtils.formatDayShortMonth(Date.fromISO(sp.destinations[1].date + Utils.tzOffset));
      this.rawRtDate = moment(Date.fromISO(sp.destinations[1].date + Utils.tzOffset));
      return this.dateHeadingText += ', ' + this.rtDate;
    }
  };

  AviaResultSet.prototype.select = function(ctx) {
    var selection, ticketValidCheck,
      _this = this;
    if (ctx.ribbon) {
      selection = ctx.data;
    } else {
      selection = ctx;
    }
    ticketValidCheck = $.Deferred();
    ticketValidCheck.done(function(selection) {
      var result;
      result = {};
      result.module = 'Avia';
      result.type = 'avia';
      result.searchId = selection.cacheId;
      result.searchKey = selection.flightKey();
      GAPush(['_trackEvent', 'Avia_press_button_buy', selection.GAKey(), selection.GAData()]);
      return Utils.toBuySubmit([result]);
    });
    return this.checkTicket(selection, ticketValidCheck);
  };

  AviaResultSet.prototype.onAfterSelect = function() {
    if (this._popup) {
      return this._popup.close();
    }
  };

  AviaResultSet.prototype.findAndSelect = function(result) {
    var backHash, backVoyage, hash, voyage, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    hash = result.similarityHash();
    _ref = this.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      _ref1 = result.voyages;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        voyage = _ref1[_j];
        if (voyage.similarityHash() === hash) {
          result.activeVoyage(voyage);
          if (!this.roundTrip) {
            return result;
          }
          backHash = voyage.activeBackVoyage().similarityHash();
          _ref2 = voyage._backVoyages;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            backVoyage = _ref2[_k];
            if (backVoyage.similarityHash() === backHash) {
              voyage.activeBackVoyage(backVoyage);
              return result;
            }
          }
        }
      }
    }
    return false;
  };

  AviaResultSet.prototype.findAndSelectHash = function(hash) {
    var arr, backHash, backVoyage, result, voyage, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    if (this.roundTrip) {
      arr = hash.split('.');
      hash = arr[0];
      backHash = arr[1];
    }
    _ref = this.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      result = _ref[_i];
      _ref1 = result.voyages;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        voyage = _ref1[_j];
        if (voyage.similarityHash() === hash) {
          result.activeVoyage(voyage);
          if (!this.roundTrip) {
            return result;
          }
          _ref2 = voyage._backVoyages;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            backVoyage = _ref2[_k];
            if (backVoyage.similarityHash() === backHash) {
              voyage.activeBackVoyage(backVoyage);
              return result;
            }
          }
        }
      }
    }
    return false;
  };

  AviaResultSet.prototype.postInit = function() {
    var bCheapest, data, eCheapest;
    this.filters = new AviaFiltersT(this);
    if (this.siblings) {
      eCheapest = _.reduce(this.data, function(el1, el2) {
        if (el1.price < el2.price) {
          return el1;
        } else {
          return el2;
        }
      }, this.data[0]);
      data = _.filter(this.data, function(item) {
        return item.serviceClass === 'B';
      });
      bCheapest = _.reduce(data, function(el1, el2) {
        if (el1.price < el2.price) {
          return el1;
        } else {
          return el2;
        }
      }, data[0]);
      if (!eCheapest) {
        eCheapest = {
          price: 0
        };
      }
      if (!bCheapest) {
        bCheapest = {
          price: 0
        };
      }
      this.ESiblings = this.processSiblings(this.siblings.E, eCheapest);
      return this.siblings = ko.observable(this.ESiblings);
    }
  };

  AviaResultSet.prototype.processSiblings = function(rawSiblings, cheapest) {
    var helper, index, min, siblings, sibs, todayPrices, _i, _j, _len, _len1,
      _this = this;
    helper = function(root, sibs, today) {
      var index, price, _i, _len, _results;
      if (today == null) {
        today = false;
      }
      _results = [];
      for (index = _i = 0, _len = sibs.length; _i < _len; index = ++_i) {
        price = sibs[index];
        _results.push(root[index] = {
          price: price,
          siblings: []
        });
      }
      return _results;
    };
    if (this.roundTrip) {
      rawSiblings[3][3] = Math.ceil(cheapest.price / 2);
    } else {
      rawSiblings[3] = cheapest.price;
    }
    if (rawSiblings[3].length) {
      siblings = [];
      todayPrices = [];
      for (index = _i = 0, _len = rawSiblings.length; _i < _len; index = ++_i) {
        sibs = rawSiblings[index];
        sibs = _.filter(sibs, function(item) {
          return item !== false;
        });
        if (sibs.length) {
          min = _.min(sibs);
        } else {
          min = false;
        }
        todayPrices[index] = min;
      }
      helper(siblings, todayPrices, true);
      for (index = _j = 0, _len1 = rawSiblings.length; _j < _len1; index = ++_j) {
        sibs = rawSiblings[index];
        helper(siblings[index].siblings, sibs);
      }
    } else {
      siblings = [];
      helper(siblings, rawSiblings, true);
    }
    return new Siblings(siblings, this.roundTrip, this.rawDate, this.rawRtDate);
  };

  AviaResultSet.prototype.hideRecommend = function(context, event) {
    return hideRecomendedBlockTicket.apply(event.currentTarget);
  };

  AviaResultSet.prototype.postFilters = function() {
    var data;
    data = _.filter(this.data, function(el) {
      return el.visible();
    });
    this.numResults(data.length);
    this.updateCheapest(data);
    this.updateBest(data);
    ko.processAllDeferredBindingUpdates();
    jsPaneScrollHeight();
    return ResizeAvia();
  };

  AviaResultSet.prototype.updateCheapest = function(data) {
    var new_cheapest;
    if (data.length === 0) {
      return;
    }
    new_cheapest = _.reduce(data, function(el1, el2) {
      if (el1.price < el2.price) {
        return el1;
      } else {
        return el2;
      }
    }, data[0]);
    if (this.cheapest() === void 0) {
      this.cheapest(new_cheapest);
      return;
    }
    if (this.cheapest().key !== new_cheapest.key) {
      return this.cheapest(new_cheapest);
    }
  };

  AviaResultSet.prototype.updateBest = function(data) {
    if (data.length === 0) {
      return;
    }
    data = _.sortBy(data, function(el) {
      return el.rating();
    });
    return this.setBest(data[0]);
  };

  AviaResultSet.prototype.setBest = function(oldresult) {
    var item, key, result, _i, _len, _ref;
    key = oldresult.key;
    result = new AviaResult(oldresult._data, this);
    _ref = oldresult._stacked_data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      result.push(item);
    }
    result.sort();
    result.removeSimilar();
    result.best = true;
    result.key = key + '_optima';
    if (this.best() === void 0) {
      this.best(result);
      return;
    }
    if (this.best().key !== result.key) {
      return this.best(result);
    }
  };

  AviaResultSet.prototype.getFilterLessBest = function() {
    var data;
    data = _.sortBy(this.data, function(el) {
      return el.rating();
    });
    return data[0];
  };

  AviaResultSet.prototype.filtersRendered = function() {
    return ko.processAllDeferredBindingUpdates();
  };

  return AviaResultSet;

})();
