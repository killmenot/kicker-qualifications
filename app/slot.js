'use strict'

define('slot', function (require) {
  var _ = require('underscore');

  function Slot() {
    this.tableNumber = null;
    this.time = null;
  }

  Slot.prototype.setTime = function (value) {
    this.time = value;
  };

  Slot.prototype.getTime = function () {
    return this.time;
  };

  Slot.prototype.setTableNumber = function (value) {
    this.tableNumber = value;
  };

  Slot.prototype.getTableNumber = function () {
    return this.tableNumber;
  };

  Slot.prototype.format = function () {
    return 'at ' + this.getTime() + ' on ' + this.getTableNumber();
  };

  return Slot;
});
