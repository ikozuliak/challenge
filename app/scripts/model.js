(function (window) {

    'use strict';

    function Model() {
        this.data = {
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
                    text:'no sugar',
                    shape:{
                        src:'sugar.png',
                        radius:{
                            max:5,
                            min:2
                        }
                    },
                    density:3,
                    fontSize:90,
                    drawing:false
                },
                {
                    text:'just a bubbles',
                    shape:{
                        src:'hearts.png',
                        radius:{
                            max:5,
                            min:2
                        }
                    },
                    density:3,
                    fontSize:90,
                    drawing:false
                },
                {
                    text:'Draw a path',
                    textSmall:'win a price',
                    shape:{
                        src:'maze.png',
                        radius:{
                            max:4,
                            min:3
                        }
                    },
                    density:6,
                    fontSize:100,
                    blocked:true,
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
        ;
    }

    Model.prototype.getData = function () {
        return this.data;
    };

    window.app.Model = Model;
})(window);
