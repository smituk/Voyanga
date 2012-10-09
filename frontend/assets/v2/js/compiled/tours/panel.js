// Generated by CoffeeScript 1.3.3
var TourPanel, TourPanelSet,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TourPanelSet = (function() {

  function TourPanelSet() {
    this.setDate = __bind(this.setDate, this);

    this.showPanelCalendar = __bind(this.showPanelCalendar, this);

    this.addPanel = __bind(this.addPanel, this);

    this.isFirst = __bind(this.isFirst, this);

    this.deletePanel = __bind(this.deletePanel, this);

    var _this = this;
    _.extend(this, Backbone.Events);
    window.voyanga_debug('Init of TourPanelSet');
    this.template = 'tour-panel-template';
    this.sp = new TourSearchParams();
    this.startCity = this.sp.startCity;
    this.startCityReadable = ko.observable('');
    this.startCityReadableGen = ko.observable('');
    this.startCityReadableAcc = ko.observable('');
    this.panels = ko.observableArray([]);
    this.i = 0;
    this.addPanel();
    this.activeCalendarPanel = this.panels()[0];
    this.checkIn = this.activeCalendarPanel.checkIn;
    this.checkOut = this.activeCalendarPanel.checkOut;
    this.height = ko.computed(function() {
      return 70 * _this.panels().length + 'px';
    });
    this.isMaxReached = ko.computed(function() {
      return _this.panels().length > 6;
    });
    this.calendarValue = ko.computed(function() {
      return {
        twoSelect: true,
        hotels: true,
        from: _this.checkIn(),
        to: _this.checkOut()
      };
    });
    this.formFilled = ko.computed(function() {
      var isFilled, result;
      isFilled = true;
      _.each(_this.panels(), function(panel) {
        return isFilled && (isFilled = panel.formFilled());
      });
      console.log('IS FILLED ', isFilled);
      result = _this.startCity && isFilled;
      return result;
    });
  }

  TourPanelSet.prototype.deletePanel = function(elem) {
    this.sp.destinations.remove(elem.city);
    this.panels.remove(elem);
    return _.last(this.panels()).isLast(true);
  };

  TourPanelSet.prototype.isFirst = function() {
    return this.i === 1;
  };

  TourPanelSet.prototype.addPanel = function() {
    var newPanel,
      _this = this;
    this.sp.destinations.push(new DestinationSearchParams());
    if (_.last(this.panels())) {
      _.last(this.panels()).isLast(false);
    }
    newPanel = new TourPanel(this.sp, this.i, this.i === 0);
    newPanel.on("tourPanel:showCalendar", function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _this.showPanelCalendar(args);
    });
    this.panels.push(newPanel);
    this.i = this.panels().length;
    return VoyangaCalendarStandart.clear();
  };

  TourPanelSet.prototype.showPanelCalendar = function(args) {
    this.activeCalendarPanel = args[0];
    return console.log('showPanelCalendar', args);
  };

  TourPanelSet.prototype.setDate = function(values) {
    console.log('Calendar selected:', values);
    if (values) {
      this.activeCalendarPanel.checkIn(values[0]);
      if (values[1]) {
        return this.activeCalendarPanel.checkOut(values[1]);
      }
    }
  };

  return TourPanelSet;

})();

TourPanel = (function(_super) {

  __extends(TourPanel, _super);

  function TourPanel(sp, ind, isFirst) {
    this.checkOutHtml = __bind(this.checkOutHtml, this);

    this.checkInHtml = __bind(this.checkInHtml, this);

    this.showCalendar = __bind(this.showCalendar, this);

    this.handlePanelSubmit = __bind(this.handlePanelSubmit, this);

    var _this = this;
    window.voyanga_debug("TourPanel created");
    TourPanel.__super__.constructor.call(this, isFirst);
    _.extend(this, Backbone.Events);
    this.sp = sp;
    this.isLast = ko.observable(true);
    this.peopleSelectorVM = new HotelPeopleSelector(sp);
    this.destinationSp = _.last(sp.destinations());
    this.city = this.destinationSp.city;
    this.checkIn = this.destinationSp.dateFrom;
    this.checkOut = this.destinationSp.dateTo;
    this.cityReadable = ko.observable('');
    this.cityReadableGen = ko.observable('');
    this.cityReadableAcc = ko.observable('');
    this.oldCalendarState = this.minimizedCalendar();
    this.formFilled = ko.computed(function() {
      var result;
      result = _this.city() && _this.checkIn() && _this.checkOut();
      return result;
    });
    this.maximizedCalendar = ko.computed(function() {
      return _this.city().length > 0;
    });
    this.calendarText = ko.computed(function() {
      var result;
      result = "Выберите дату поездки ";
      return result;
    });
    this.city.subscribe(function(newValue) {
      return _this.showCalendar();
    });
  }

  TourPanel.prototype.handlePanelSubmit = function() {
    return app.navigate(this.sp.getHash(), {
      trigger: true
    });
  };

  TourPanel.prototype.navigateToNewSearch = function() {
    this.handlePanelSubmit();
    return this.minimizedCalendar(true);
  };

  TourPanel.prototype.close = function() {
    $(document.body).unbind('mousedown');
    $('.how-many-man .btn').removeClass('active');
    $('.how-many-man .content').removeClass('active');
    return $('.how-many-man').find('.popup').removeClass('active');
  };

  TourPanel.prototype.showFromCityInput = function(panel, event) {
    var el, elem;
    elem = $('.cityStart .second-path');
    elem.data('old', elem.val());
    el = elem.closest('.tdCity');
    el.find(".from").addClass("overflow").animate({
      width: "125px"
    }, 300);
    el.find(".startInputTo").show();
    return el.find('.cityStart').animate({
      width: "261px"
    }, 300, function() {
      return el.find(".startInputTo").find("input").focus().select();
    });
  };

  TourPanel.prototype.hideFromCityInput = function(panel, event) {
    var elem;
    elem = $('.from.active .second-path');
    if (elem.parent().hasClass("overflow")) {
      elem.parent().animate({
        width: "271px"
      }, 300, function() {
        return $(this).removeClass("overflow");
      });
      $(".cityStart").animate({
        width: "115px"
      }, 300);
      return $(".cityStart").find(".startInputTo").animate({
        opacity: "1"
      }, 300, function() {
        return $(this).hide();
      });
    }
  };

  TourPanel.prototype.showCalendar = function() {
    $('.calenderWindow').show();
    this.trigger("tourPanel:showCalendar", this);
    if (this.minimizedCalendar()) {
      ResizeAvia();
      return this.minimizedCalendar(false);
    }
  };

  TourPanel.prototype.checkInHtml = function() {
    if (this.checkIn()) {
      return dateUtils.formatHtmlDayShortMonth(this.checkIn());
    }
    return '';
  };

  TourPanel.prototype.checkOutHtml = function() {
    if (this.checkOut()) {
      return dateUtils.formatHtmlDayShortMonth(this.checkOut());
    }
    return '';
  };

  return TourPanel;

})(SearchPanel);

$(document).on("keyup change", "input.second-path", function(e) {
  var firstValue, secondEl;
  firstValue = $(this).val();
  secondEl = $(this).siblings('input.input-path');
  if ((e.keyCode === 8) || (firstValue.length < 3)) {
    return secondEl.val('');
  }
});

$(document).on("keyup change", '.cityStart input.second-path', function(e) {
  var elem;
  elem = $('.from.active .second-path');
  if (e.keyCode === 13) {
    if (elem.parent().hasClass("overflow")) {
      elem.parent().animate({
        width: "271px"
      }, 300, function() {
        $(this).removeClass("overflow");
        return $('.from.active .second-path').focus();
      });
      $(".cityStart").animate({
        width: "115px"
      }, 300);
      return $(".cityStart").find(".startInputTo").animate({
        opacity: "1"
      }, 300, function() {
        return $(this).hide();
      });
    }
  }
});
