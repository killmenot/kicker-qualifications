'use strict'

define('game', function () {
    function Game(home, visitor) {
      this.home = home;
      this.visitor = visitor;

      this.home.addGame(this);
      this.visitor.addGame(this);

      this.number = 0;
      this.tour = 0;
      this.slot = null;
    }

    Game.prototype.setNumber = function (value) {
      this.number = value;
    };

    Game.prototype.getNumber = function () {
      return this.number;
    };

    Game.prototype.setTour = function (value) {
      this.tour = value;
    };

    Game.prototype.getTour = function () {
      return this.tour;
    };

    Game.prototype.setSlot = function (value) {
      this.slot = value;
    };

    Game.prototype.getSlot = function () {
      return this.slot;
    };

    Game.prototype.isHomePlayer = function (player) {
      return this.home.name === player.name;
    };

    Game.prototype.isVisitorPlayer = function (player) {
      return this.visitor.name === player.name;
    };

    Game.prototype.format = function (player) {
      var info = '';
      if (this.slot) {
        info = ' ' + this.slot.format();
      }

      if (!player) {
        return this.home.name + ' vs. ' + this.visitor.name + info;
      }

      if (this.home.name === player.name) {
        return 'vs. ' + this.visitor.name + info;
      }

      if (this.visitor.name === player.name) {
        return 'vs. ' + this.home.name + info;
      }

      throw new Error('Player is not related with this game.');
    };

    return Game;
});
