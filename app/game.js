'use strict'

define('game', function () {
    function Game(home, visitor) {
      this.home = home;
      this.visitor = visitor;

      this.home.addGame(this);
      this.visitor.addGame(this);

      this.tour = 0;
    }

    Game.prototype.setTour = function (tour) {
      this.tour = tour;
    };

    Game.prototype.getTour = function () {
      return this.tour;
    };

    Game.prototype.isHomePlayer = function (player) {
      return this.home.name === player.name;
    };

    Game.prototype.isVisitorPlayer = function (player) {
      return this.visitor.name === player.name;
    };

    Game.prototype.format = function (player) {
      if (!player) {
        return this.home.name + ' vs. ' + this.visitor.name;
      }

      if (this.home.name === player.name) {
        return 'vs. ' + this.visitor.name + ' - ' + this.getTour();
      }

      if (this.visitor.name === player.name) {
        return 'vs. ' + this.home.name + ' - ' + this.getTour();
      }

      throw new Error('Player is not related with this game.');
    };

    return Game;
});
