(function (window) {
    'use strict';

    function Controller(view, options) {

        this.view = view;

        this.defaultsSwap = new this._defaults;

        this.options = extendObject(this.defaultsSwap, options);

        this.stepIndex = 0;

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
                        fontSize: 100,
                        drawing: false
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
                        fontSize: 80,
                        drawing: true
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
                        fontSize: 80,
                        drawing: false
                    }

                ]
            }

            this.view.canvasExtension._init(data.steps[this.stepIndex]);


                [].forEach.call(
                document.body.querySelectorAll('[data-toggle="step"]'),
                function (ev) {
                    ev.addEventListener('click', function () {
                            self.stepIndex += parseInt(ev.getAttribute('data-index'))  ;

                            self.view.canvasExtension._goTo(data.steps[self.stepIndex]);
                        }
                    );
                })
        }


    }
    window.app.Controller = Controller;

})(window);