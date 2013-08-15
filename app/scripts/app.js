(function () {
    'use strict';

    function App(options) {



        this.model = new app.Model();
        this.view = new app.View();
        this.controller = new app.Controller(this.view, this.model);

        this.controller._init();

    }

    var brendApp = new App();


})();