(function (window) {
    'use strict';

    function Controller(view, options) {

        this.view = view;

        this.defaultsSwap = new this._defaults;

        this.options = extendObject(this.defaultsSwap, options);

    }

    Controller.prototype = {

        _defaults:function () {
            return {
                value: {}
            }
        },

        _init:function () {

            var data = {
                currentStep : 0,
                steps : [
                    {
                        text : 'cola zero',
                        shape : 'bottle.png'
                    },
                    {
                        text : 'cola zero2',
                        shape : 'maze.png'
                    }

                ]
            }

            this.view.canvasExtension._init(data.steps[1]);
        }


    }
    window.app.Controller = Controller;

})(window);