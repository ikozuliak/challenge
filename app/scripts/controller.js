(function (window) {
    'use strict';

    function Controller(view, model, options) {

        this.view = view;
        this.model = model;

        this.defaultsSwap = new this._defaults;

        this.options = extendObject(this.defaultsSwap, options);

        this.mouse = { x:-99999, y:-99999 }

        this.particles = [];
        this.shape = {};
        this.text = [];
        this.nextText = [];

    }

    Controller.prototype = {

        _defaults:function () {
            return {
                particles:[],
                text:[],
                nextText:[],
                currentTransition:'circle',
                layout:0,
                type:['circle'],
                FPS:60,
                words:[ 'cola zero' ],
                colors:{
                    circle:[ '#ed172a', '#fafafa' ]
                }
            }
        },

        _init:function () {
            this._initEvents();
            this._initCanvas();

        },

        _initEvents:function () {

        },

        _initCanvas:function () {
            var slideshowContainer = document.querySelector('#canvas-stage');

            this.canvas = document.createElement('canvas');

            this.canvas.width = innerWidth;
            this.canvas.height = 500;

            slideshowContainer.appendChild(this.canvas);


            if (!!(this.canvas.getContext && this.canvas.getContext('2d'))) {

                this.context = this.canvas.getContext('2d');

                this._createParticles();

            }
            else {
            }
        },

        _createParticles:function () {

            var self = this;

            for (var quantity = 0, len = 100; quantity < len; quantity++) {

                var x, y, steps,

                    steps = Math.PI * 2 * quantity / len;

                x = this.canvas.width * 0.5 + 10 * Math.cos(steps);
                y = 180 + 10 * Math.sin(steps);

                var radius = randomBetween(0, 2);
                var hasBorn = radius > 0 || radius < 12 ? false : true;

                var color = this.options.colors.circle[~~(Math.random() * this.options.colors.circle.length)];

                this.particles.push({

                    x:x,
                    y:y,

                    hasBorn:hasBorn,

                    ease:0.04 + Math.random() * 0.06,
                    bornSpeed:0.07 + Math.random() * 0.07,

                    alpha:0,
                    maxAlpha:0.7 + Math.random() * 0.4,

                    radius:radius,
                    maxRadius:12,

                    color:color,
                    interactive:false,

                    angle:0,

                    steps:steps

                });

            }


            this._createTextParticles();
            this._renderLoop();

        },

        _generateText : function(){
            this.context.font = 100 + 'px Arial, sans-serif';
            this.context.fillStyle = 'rgb(255, 255, 255)';
            this.context.textAlign = 'center';

            var sentence = this.options.words[0].toUpperCase().split('').join(String.fromCharCode(8202));

            this.context.fillText(sentence, this.canvas.width * 0.5, this.canvas.height - 50);
        },

        _grabParticlesFromCanvas:function () {

            var surface = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

            for (var width = 0; width < surface.width; width += 4) {

                for (var height = 0; height < surface.height; height += 4) {

                    var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];

                    if (color === 255) {
                        this.nextText.push({
                            x:width,
                            y:height,
                            orbit:randomBetween(1, 3),
                            angle:0
                        });

                    }
                }

            }

            return this.nextText.length;

        },

        _createTextParticles:function (seed) {

            this._generateText();
            var seed = this._grabParticlesFromCanvas();

            for (var quantity = 0, len = seed; quantity < len; quantity++) {

                var radius = randomBetween(0, 12);
                var hasBorn = radius > 0 || radius < 12 ? false : true;

                var color = this.options.colors.circle[~~(Math.random() * this.options.colors.circle.length)];

                this.text.push({

                    x:this.canvas.width * 0.5,
                    y:this.canvas.height - 70,

                    hasBorn:hasBorn,

                    ease:0.04 + Math.random() * 0.06,
                    bornSpeed:0.07 + Math.random() * 0.07,

                    alpha:0,
                    maxAlpha:0.7 + Math.random() * 0.4,

                    radius:radius,
                    maxRadius:4,

                    color:color,
                    interactive:false

                });

            }


        },


        _clear:function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        _updateTransition:function () {

            var self = this;

            [].forEach.call(this.particles, function (particle, index) {

                switch (self.options.currentTransition) {

                    case 'circle':

                        self.shape.x = self.canvas.width * 0.5 + 140 * Math.sin(particle.steps);
                        self.shape.y = 180 + 140 * Math.cos(particle.steps);

                        break;

                    default:
                        break;

                }

                if (!particle.interactive) {

                    particle.x += ((self.shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.08;
                    particle.y += ((self.shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.08;

                }

                else {

                    particle.x += ((mouse.x + Math.sin(particle.angle) * 30) - particle.x) * 0.08;
                    particle.y += ((mouse.y + Math.cos(particle.angle) * 30) - particle.y) * 0.08;

                }

                particle.angle += 0.08;

            });

            [].forEach.call(this.nextText, function (particle, index) {

                if (!self.text[index].interactive) {

                    self.text[index].x += ((particle.x + Math.cos(particle.angle + index) * particle.orbit) - self.text[index].x) * 0.08;
                    self.text[index].y += ((particle.y + Math.sin(particle.angle + index) * particle.orbit) - self.text[index].y) * 0.08;

                }

                else {

                    self.text[index].x += ((mouse.x + Math.sin(particle.angle) * 30) - self.text[index].x) * 0.08;
                    self.text[index].y += ((mouse.y + Math.cos(particle.angle) * 30) - self.text[index].y) * 0.08;

                }

                particle.angle += 0.08;

            });

        },


        _update:function () {

            var self = this;

            this._updateTransition();


            [].forEach.call(this.particles, function (particle, index) {

                particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;

                if (particle.hasBorn) {

                    particle.radius += (0 - particle.radius) * particle.bornSpeed;

                    if (Math.round(particle.radius) === 0) {

                        switch (self.options.currentTransition) {

                            case 'circle':

                                particle.color = self.options.colors.circle[~~(Math.random() * self.options.colors.circle.length)];

                                break;

                            default:
                                break;

                        }

                        particle.hasBorn = false;

                    }

                }

                if (!particle.hasBorn) {

                    particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;

                    if (Math.round(particle.radius) === particle.maxRadius)

                        particle.hasBorn = true;

                }

            });

            [].forEach.call(this.text, function(particle, index) {

                particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;

                if(particle.hasBorn) {

                    particle.radius += (0 - particle.radius) * particle.bornSpeed;

                    if(Math.round(particle.radius) === 0)

                        particle.hasBorn = false;

                }

                if(!particle.hasBorn) {

                    particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;

                    if(Math.round(particle.radius) === particle.maxRadius)

                        particle.hasBorn = true;

                }


            });

        },

        _render:function () {

            var context = this.context;

            [].forEach.call(this.particles, function (particle, index) {

                context.save();
                context.globalAlpha = particle.alpha;
                context.fillStyle = particle.color;
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
                context.restore();

            });

            [].forEach.call(this.text, function(particle, index) {

                context.save();
                context.globalAlpha = particle.alpha;
                context.fillStyle = 'rgb(255, 255, 255)';
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
                context.restore();

            });

        },

        _renderLoop:function () {

            this._clear();
            this._update();
            this._render();
            requestAnimFrame(this._renderLoop.bind(this));

        },


    }
    window.app.Controller = Controller;

})(window);