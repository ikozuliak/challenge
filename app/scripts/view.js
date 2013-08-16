(function (window) {
    'use strict';

    function View() {

        this.View
            = '<div class="row">'
            + '<a href="#" data-id="{{id}}">{{name}}</a>'
            + '</div>';

        this.navItem
            = '<li>'
            + '<a href="#">{{index}} - {{title}}</a>'
            + '</li>';

    }

    View.prototype = {

        self:this,

        _buildNavigation:function (data, container) {

        },

        canvasExtension:{

            mouse:{ x:-99999, y:-99999 },
            particles:{
                shape:[],
                text:[],
                path:[],
                all:[]
            },

            shape:{},
            swapText:[],
            colors:['#fff', '#e13123'],

            _init:function (data, step) {

                this.storage = data;
                this.data = this.storage.steps[step];
                this.step = step;

                this.canvasContainer = document.querySelector('#canvas-stage');

                this.canvas = document.createElement('canvas');
                this.canvas.width = this.canvasContainer.offsetWidth;
                this.canvas.height = this.canvasContainer.offsetHeight;

                this.canvasContainer.appendChild(this.canvas);

                if (!!(this.canvas.getContext && this.canvas.getContext('2d'))) {

                    this.context = this.canvas.getContext('2d');

                    this._createParticles();

                    document.body.style.cursor = "pointer";

                    this._initEvents();

                    return this.canvas;
                }

            },

            _goTo:function (step) {
                this.step = step;
                this.data = this.storage.steps[step];

                this._refresh();
            },

            _onMouseMove:function (event) {

                event.preventDefault();

                this.mouse.x = event.pageX - ( scrollX() + this.canvas.getBoundingClientRect().left );
                this.mouse.y = event.pageY - ( scrollY() + this.canvas.getBoundingClientRect().top );

                if (this.data.drawing)
                    this._drawPath();
            },


            _onWindowResize:function () {
                this.canvas.width = this.canvasContainer.offsetWidth;

                this.particles.all = [];
                this._createShapeParticles();
                this._createTextParticles();
            },

            _initEvents:function () {

                var self = this;

                window.onresize = this._onWindowResize.bind(this);

                this.canvas.addEventListener('mousemove', function (event) {
                    self._onMouseMove.call(self, event)
                }, false);

            },

            _createParticles:function () {

                var self = this;

                this._createShapeParticles();
                this._createTextParticles();
                this._renderLoop();

            },

            _refresh:function () {

                this.particles = {
                    shape:[],
                    text:[],
                    path:[],
                    all:[]
                };

                this._clear();

                this._createShapeParticles();
                this._createTextParticles();

            },

            _drawPath:function () {

                if (this.pathStarted && this.pathFinished) {
                    this.pathStarted = this.pathFinished = false;
                    this._goTo(4);
                }

                if ((this.mouse.x > this.imgX + 110 && this.mouse.x < this.imgX + 130) && (this.mouse.y > this.imgY && this.mouse.y < this.imgY + 20))
                    this.pathStarted = true;

                if ((this.mouse.x > this.imgX2 - 110 && this.mouse.x < this.imgX2 - 90) && (this.mouse.y > this.imgY2 - 40 && this.mouse.y < this.imgY2 - 20))
                    this.pathFinished = true;

                if ((this.mouse.x > this.imgX && this.mouse.x < this.imgX2) && (this.mouse.y > this.imgY && this.mouse.y < this.imgY2) && (this.pathStarted))

                    this.particles.path.push({
                        x:this.mouse.x,
                        y:this.mouse.y,
                        x1:this.mouse.x,
                        y1:this.mouse.y,
                        hasBorn:true,
                        ease:1,
                        bornSpeed:0,
                        alpha:1,
                        maxAlpha:1,
                        radius:2,
                        maxRadius:2,
                        color:'#fff',
                        interactive:false
                    });
            },

            _generateText:function () {
                this.context.font = this.data.fontSize + 'px Arial, sans-serif';
                this.context.fillStyle = 'rgb(255, 255, 255)';
                this.context.textAlign = 'center';

                var text = this.data.text.toUpperCase();

                this.context.fillText(
                    text,
                    this.canvas.width * 0.5,
                    this.canvas.height - 70
                );

                if (this.data.textSmall) {

                    this.context.font = this.data.fontSize - 25 + 'px Arial, sans-serif';

                    this.context.fillText(
                        this.data.textSmall.toUpperCase(),
                        this.canvas.width * 0.5, this.canvas.height - 10
                    );
                }
            },


            _grabParticlesFromCanvas:function () {

                var generated = [];

                var surface = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

                for (var width = 0; width < surface.width; width += this.data.density) {

                    for (var height = 0; height < surface.height; height += this.data.density) {

                        var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];

                        if (color === 255) {

                            var radius = getRandom(this.data.shape.radius.min, 30);
                            var hasBorn = radius > 0 || radius < 12 ? false : true;

                            var color = this.colors[~~(Math.random() * this.colors.length)];

                            generated.push({

                                x:getRandom(-this.canvas.width, this.canvas.width * 2),
                                y:getRandom(0, 500),
                                x1:width,
                                y1:height,
                                hasBorn:hasBorn,
                                ease:0.04 + Math.random() * 0.06,
                                bornSpeed:0.07 + Math.random() * 0.07,
                                alpha:0,
                                maxAlpha:0.4 + Math.random() * 0.4,
                                radius:radius,
                                maxRadius:this.data.shape.radius.max || 8,
                                orbit:8,
                                angle:0.1,
                                color:color,
                                interactive:false
                            });

                        }
                    }
                }

                return generated;

            },

            _createShapeParticles:function () {

                var self = this;
                var surface;

                self.img = new Image();

                self.img.onload = function () {

                    self.imgX = self.canvas.width / 2 - self.img.width / 2;
                    self.imgX2 = self.imgX + self.img.width;
                    self.imgY = 30;
                    self.imgY2 = self.imgY + self.img.height;

                    self.context.drawImage(self.img, self.imgX, 30);
                    self.particles.shape = self._grabParticlesFromCanvas();

                    self._clear();
                }

                self.img.src = this.data.shape.src;
            },

            _createTextParticles:function () {

                this._generateText();
                this.particles.text = this._grabParticlesFromCanvas();

            },

            _clear:function () {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            },

            _updateTransition:function () {

                var self = this;

                if (!self.data.drawing)
                    [].forEach.call(this.particles.all, function (particle, index) {

                        if (particle.interactive) {

                            particle.x += ((self.mouse.x + Math.sin(particle.angle) * 60) - particle.x) * 0.08;
                            particle.y += ((self.mouse.y + Math.sin(particle.angle) * 60) - particle.y) * 0.08;

                        }

                        else {
                            particle.x += ((particle.x1 + Math.sin(particle.angle) * 2) - particle.x) * 0.08;
                            particle.y += ((particle.y1 + Math.sin(particle.angle) * 2) - particle.y) * 0.08;
                        }

                        particle.angle += getRandom(1, 8) / 100;
                    })
                else
                    [].forEach.call(this.particles.all, function (particle, index) {

                        particle.x = particle.x1;
                        particle.y = particle.y1;


                        particle.angle += getRandom(1, 8) / 100;
                    })

            },

            _update:function () {

                var self = this;

                this._updateTransition();

                this.particles.all =
                    this.particles.shape.concat(
                    this.particles.text,
                    this.particles.path
                );

                [].forEach.call(this.particles.all, function (particle, index) {

                    particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;

                    if (particle.hasBorn) {

                        particle.radius += (0 - particle.radius) * particle.bornSpeed;

                        if (Math.round(particle.radius) === 0)

                            particle.hasBorn = false;

                    }
                    else {

                        particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;

                        if (Math.round(particle.radius) === particle.maxRadius)

                            particle.hasBorn = true;

                    }

                });

                [].forEach.call(this.particles.shape, function (particle, index) {

                    if (distanceTo(self.mouse, particle) <= 5 && (self.data.drawing == true)) {
                        if (self.pathStarted) {
                            self.particles.path = [];
                            self._createShapeParticles();
                        }

                        self.pathStarted = self.pathFinished = false;
                    }
                    else
                        distanceTo(self.mouse, particle) <= particle.radius + 60 ? particle.interactive = true : particle.interactive = false;

                });

            },

            _render:function () {

                var context = this.context;

                [].forEach.call(this.particles.all, function (particle, index) {

                    context.save();
                    context.globalAlpha = particle.alpha;
                    context.fillStyle = particle.color;
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
            }
        }
    }


    window.app.View = View;
})(window);


