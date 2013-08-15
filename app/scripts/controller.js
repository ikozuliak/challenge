(function (window) {
    'use strict';

    function Controller(view, options) {

        this.view = view;

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

            var data = {
                steps:[
                    {
                        text:'cola zero',
                        shape:{
                            src:'bottle.png',
                            radius:{
                                max:10,
                                min:2
                            }
                        },
                        density:4,
                        fontSize:100,
                        drawing:false
                    },
                    {
                        text:'light like a bubble',
                        shape:{
                            src:'bottle.png',
                            radius:{
                                max:5,
                                min:2
                            }
                        },
                        density:3,
                        fontSize:60,
                        drawing:false
                    },
                    {
                        text:'Draw a path',
                        textSmall:'win a price',
                        shape:{
                            src:'maze.png',
                            radius:{
                                max:4,
                                min:2
                            }
                        },
                        density:5,
                        fontSize:100,
                        drawing:true
                    },
                    {
                        text:'Like us!',
                        url:'http://google.com',
                        shape:{
                            src:'like.png',
                            radius:{
                                max:7,
                                min:2
                            }
                        },
                        density:4,
                        fontSize:80,
                        drawing:false
                    }

                ]
            }

            var canvas = this.view.canvasExtension._init(data, 0);


//            canvas.addEventListener('click', function () {
//
//                    self.view.canvasExtension._goTo(self.stepIndex++);
//                }
//            );
        }


    }
    window.app.Controller = Controller;

})(window);