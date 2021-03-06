"use strict";

var bookingCounter = function bookingCounter(selector, options) {
  this.selector = selector;
  this.countMin = options.countMin || 5;
  this.countMax = options.countMax || 12;
  this.incrementMin = options.incrementMin || 1;
  this.incrementMax = options.incrementMax || 3;
  this.lastOrderMin = options.lastOrderMin || 5;
  this.lastOrderMax = options.lastOrderMax || 60;
  this.updateInterval = options.updateInterval || 40;
  this.init();
};

bookingCounter.prototype.storageKey = 'countersData';

bookingCounter.prototype.init = function () {
  var containers = Array.from(document.querySelectorAll(this.selector));
  var data = this.getCounterData();
  var murkup = this.getTemplate(data);
  containers.forEach(function (item, key) {
    item.innerHTML = murkup;
  });
  this.updateCounter();
};

bookingCounter.prototype.getTemplate = function (data) {
  var cnt = data.count + " " + this.declOfNum(data.count, ['раз', 'раза', 'раз']);
  return '<div class="buy-trigger">' + '<div class="buy-trigger__counter">Сегодня забронировано <b>' + cnt + ' </b></div>' + '<div class="buy-trigger__last">Последний раз: ' + data.lastOrder + ' мин назад</div>' + '</div>';
};

bookingCounter.prototype.addPage = function () {
  var data = this.loadData();
  var newData = this.createNewData();
  this.lastUpdate = newData.lastUpdate;
  data.push(newData);
  localStorage.setItem(this.storageKey, JSON.stringify(data));
  return newData;
};

bookingCounter.prototype.getCounterData = function () {
  var currentUrl = this.getCurrentUrl();
  var data = this.loadData();
  var out = data.filter(function (item) {
    return item.url == currentUrl;
  });

  if (out.length > 0) {
    this.lastUpdate = out[0].lastUpdate;
    return out[0];
  } else {
    return this.addPage();
  }
};

bookingCounter.prototype.loadData = function () {
  var tmp = [];
  var data = localStorage.getItem(this.storageKey);

  if (!data) {
    tmp.push(this.createNewData());
    data = JSON.stringify(tmp);
    localStorage.setItem(this.storageKey, data);
    return tmp;
  } else {
    return JSON.parse(data);
  }
};

bookingCounter.prototype.createNewData = function () {
  return {
    url: this.getCurrentUrl(),
    lastUpdate: new Date().getTime(),
    count: this.generateCount(),
    lastOrder: this.generateLastOrder(),
    counterDate: new Date().getTime()
  };
};

bookingCounter.prototype.getCurrentUrl = function () {
  return window.location.host + window.location.pathname;
};

bookingCounter.prototype.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

bookingCounter.prototype.declOfNum = function (number, titles) {
  cases = [2, 0, 1, 1, 1, 2];
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
};

bookingCounter.prototype.generateCount = function () {
  var num = this.getRandomInt(this.countMin, this.countMax);
  return num;
};

bookingCounter.prototype.generateLastOrder = function () {
  var num = this.getRandomInt(this.lastOrderMin, this.lastOrderMax);
  return num;
};

bookingCounter.prototype.getTimeDiff = function () {
  var tmp = this.getCounterData();
  var a = tmp.lastUpdate;
  var b = new Date().getTime();
  var dateA = new Date(a);
  var dateB = new Date(b);
  var Difference = dateB.getHours() * 60 + dateB.getMinutes() - dateA.getHours() * 60 - dateA.getMinutes();
  return Difference;
};

bookingCounter.prototype.setData = function (index) {
  var tmp = this.loadData();
  var incVal = this.getRandomInt(this.incrementMin, this.incrementMax);
  var newCount = tmp[index].count + incVal;
  var newLastOrder = this.generateLastOrder();

  if (newCount > this.countMax) {
    newCount = this.countMax;
    newLastOrder = tmp[index].lastOrder + this.updateInterval;
  }

  var newData = {
    count: newCount,
    lastOrder: newLastOrder,
    lastUpdate: new Date().getTime()
  };
  var out = Object.assign(tmp[index], newData);
  tmp[index] = out;
  localStorage.setItem(this.storageKey, JSON.stringify(tmp));
};

bookingCounter.prototype.updateCounter = function () {
  var diff = this.getTimeDiff();

  if (diff >= this.updateInterval) {
    var index = this.getIndex();
    this.setData(index);
  }

  this.checkDate();
};

bookingCounter.prototype.getIndex = function () {
  var url = this.getCurrentUrl();
  var data = this.loadData();
  var index = data.findIndex(function (obj) {
    return obj.url == url;
  });
  return index;
};

bookingCounter.prototype.checkDate = function () {
  var data = this.getCounterData();
  var counterDate = new Date(data.counterDate).getDate();
  var nowDate = new Date().getDate();

  if (counterDate != nowDate) {
    localStorage.removeItem(this.storageKey);
  }
};