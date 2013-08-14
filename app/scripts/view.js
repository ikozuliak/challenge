(function (window) {
    'use strict';

    function View(model) {

        this.View
            = '<div class="row">'
            +   '<a href="#" data-id="{{id}}">{{name}}</a>'
            + '</div>';

    }

    View.prototype.render = function (data, columnsCount, itemClass) {



        return template;
    }

    window.app.View = View;
})(window);


