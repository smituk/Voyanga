// Generated by CoffeeScript 1.4.0
var API, AviaAPI, HotelsAPI, ToursAPI, VisualLoader,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

API = (function() {

  function API() {
    this.call = __bind(this.call, this);
    this.endpoint = window.apiEndPoint;
    this.loader = new VisualLoader;
  }

  API.prototype.call = function(url, cb, showLoad, description) {
    var _this = this;
    if (showLoad == null) {
      showLoad = true;
    }
    if (description == null) {
      description = 'voyanga';
    }
    if (showLoad) {
      if (description === 'voyanga') {
        description = 'Идет поиск лучших авиабилетов и отелей<br>Это может занять от 5 до 30 секунд';
      }
      this.loader.start(description);
    }
    return $.ajax({
      url: "" + this.endpoint + url,
      dataType: 'json',
      timeout: 200000,
      success: function(data) {
        if (showLoad) {
          _this.loader.renew(100);
        }
        return window.setTimeout(function() {
          cb(data);
          if (showLoad) {
            return _this.loader.hide();
          }
        }, 50);
      },
      error: function() {
        var jqXHR, rest;
        jqXHR = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (showLoad) {
          this.loader.hide();
        }
        throw new Error(("Api call failed: Url: " + url) + " | Status: " + jqXHR.status + " | Status text '" + jqXHR.statusText + "' | " + jqXHR.getAllResponseHeaders().replace("\n", ";") + " | " + rest.join(" | "));
      }
    });
  };

  return API;

})();

ToursAPI = (function(_super) {

  __extends(ToursAPI, _super);

  function ToursAPI() {
    this.search = __bind(this.search, this);
    return ToursAPI.__super__.constructor.apply(this, arguments);
  }

  ToursAPI.prototype.search = function(url, cb, showLoad, description) {
    if (showLoad == null) {
      showLoad = true;
    }
    if (description == null) {
      description = '';
    }
    if (showLoad && !description) {
      description = 'Идет поиск лучших авиабилетов и отелей<br>Это может занять от 5 до 30 секунд';
    }
    return this.call(url, function(data) {
      return cb(data);
    }, showLoad, description);
  };

  return ToursAPI;

})(API);

AviaAPI = (function(_super) {

  __extends(AviaAPI, _super);

  function AviaAPI() {
    this.search = __bind(this.search, this);
    return AviaAPI.__super__.constructor.apply(this, arguments);
  }

  AviaAPI.prototype.search = function(url, cb, showLoad, description) {
    if (showLoad == null) {
      showLoad = true;
    }
    if (description == null) {
      description = '';
    }
    if (showLoad && !description) {
      description = 'Идет поиск лучших авиабилетов<br>Это может занять от 5 до 30 секунд';
    }
    return this.call(url, function(data) {
      return cb(data);
    }, showLoad, description);
  };

  return AviaAPI;

})(API);

HotelsAPI = (function(_super) {

  __extends(HotelsAPI, _super);

  function HotelsAPI() {
    this.search = __bind(this.search, this);
    return HotelsAPI.__super__.constructor.apply(this, arguments);
  }

  HotelsAPI.prototype.search = function(url, cb, showLoad) {
    var description;
    if (showLoad == null) {
      showLoad = true;
    }
    if (showLoad && !description) {
      description = 'Идет поиск лучших отелей<br>Это может занять от 5 до 30 секунд';
    }
    return this.call(url, function(data) {
      return cb(data);
    }, showLoad, description);
  };

  return HotelsAPI;

})(API);

VisualLoader = (function() {

  function VisualLoader() {
    this.start = __bind(this.start, this);

    this.renew = __bind(this.renew, this);

    this.setPerc = __bind(this.setPerc, this);

    this.hide = __bind(this.hide, this);

    this.show = __bind(this.show, this);

    var _this = this;
    this.percents = ko.observable(0);
    this.separator = 90;
    this.separatedTime = 30;
    this.timeoutHandler = null;
    this.description = ko.observable('');
    this.description.subscribe(function(newVal) {
      return $('#loadWrapBg').find('.text').html(newVal);
    });
    this.timeFromStart = 0;
    this.percents.subscribe(function(newVal) {
      return console.log('loder changed... NOW: ' + newVal + '% time from start: ' + _this.timeFromStart + 'sec');
    });
  }

  VisualLoader.prototype.show = function() {
    return $('#loadWrapBg').show();
  };

  VisualLoader.prototype.hide = function() {
    return $('#loadWrapBg').hide();
  };

  VisualLoader.prototype.setPerc = function(perc) {
    var h;
    h = Math.ceil(156 - (perc / 100) * 156);
    $('#loadWrapBg').find('.procent').html(perc + '<span class="simbol"></span>');
    return $('#loadWrapBg').find('.layer03').height(h);
  };

  VisualLoader.prototype.renew = function(percent) {
    var newPerc, rand, rtime,
      _this = this;
    this.percents(percent);
    this.setPerc(percent);
    if ((98 > percent && percent >= 0)) {
      rand = Math.random();
      if (percent < this.separator) {
        rtime = Math.ceil(rand * (this.separatedTime / 8));
        newPerc = Math.ceil(rand * (this.separator / 8));
        if ((percent + newPerc) > this.separator) {
          newPerc = this.separator - percent;
        }
        if (newPerc > 3) {
          newPerc = newPerc + Math.ceil((newPerc / 18) * (Math.random() - 0.5));
        }
      } else {
        rtime = Math.ceil(rand * (this.separatedTime / 3));
        newPerc = Math.ceil(Math.random() * 2);
      }
      console.log('time: ' + rtime + 'sec');
      this.timeFromStart += rtime;
      return this.timeoutHandler = window.setTimeout(function() {
        if ((percent + newPerc) > 100) {
          newPerc = 98 - percent;
        }
        return _this.renew(percent + newPerc);
      }, 1000 * rtime);
    } else if ((100 > percent && percent >= 98)) {
      return console.log('loadrer more 98');
    } else {
      if (this.timeoutHandler) {
        window.clearTimeout(this.timeoutHandler);
      }
      return this.timeoutHandler = null;
    }
  };

  VisualLoader.prototype.start = function(description) {
    this.description(description);
    this.timeFromStart = 0;
    this.show();
    return this.renew(0);
  };

  return VisualLoader;

})();
