'use strict'

define('game', function () {
    function Game(home, visitor) {
      this.home = home;
      this.visitor = visitor;

      this.home.addGame(this);
      this.visitor.addGame(this);
    }

    return Game;
});
