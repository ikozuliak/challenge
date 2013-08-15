(function (window) {
    'use strict';

    function Controller(view, model, options) {

        this.view = view;
        this.model = model;

        this.defaultsSwap = new this._defaults;

        this.options = extendObject(this.defaultsSwap, options);

        this.stepIndex = 1;

    }

    Controller.prototype = {

        _defaults:function () {
            return {
                value:{}
            }
        },

        _init:function () {

            var self = this;

            var data = this.model.getData();
            var canvas = this.view.canvasExtension._init(data, 0);

        }

    }
    window.app.Controller = Controller;

})(window);