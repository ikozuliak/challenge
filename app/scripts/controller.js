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

            var self = this;

            var data = {
                currentStep : 0,
                steps : [
                    {
                        text : 'cola zero',
                        shape : {
                            src: 'bottle.png',
                            radius: {
                                max: 10,
                                min: 2
                            }
                        },
                        density: 4,
                        fontSize: 100
                    },
                    {
                        text : 'Maze game',
                        shape : {
                            src: 'maze.png',
                            radius: {
                                max: 4,
                                min: 2
                            }
                        },
                        density: 7,
                        fontSize: 80
                    },
                    {
                        text : 'Like us!',
                        shape : {
                            src: 'like.png',
                            radius: {
                                max: 7,
                                min: 2
                            }
                        },
                        density: 4,
                        fontSize: 80
                    }

                ]
            }

            this.view.canvasExtension._init(data.steps[0]);

            document.body.addEventListener('click', function (event) {
                self.view.canvasExtension._goTo(data.steps[2]);
            }, false);
        }


    }
    window.app.Controller = Controller;

})(window);