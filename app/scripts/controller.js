(function (window) {
    'use strict';

    function Controller(view, model, options) {

        this.view = view;
        this.model = model;

        this.defaultsSwap = new this._defaults;

        this.options = extendObject(this.defaultsSwap, options);

    }

    Controller.prototype = {

        _defaults:function () {
            return {
                value:''
            }
        },

        _init:function () {
            var data = this.model.getData();




            this._initEvents();


        },

        _initEvents:function () {

        }
    }
    window.app.Controller = Controller;

})(window);