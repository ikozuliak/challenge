(function (window) {
    'use strict';

    function View() {

        this.View
            = '<div class="row">'
            + '<a href="#" data-id="{{id}}">{{name}}</a>'
            + '</div>';

    }

    View.prototype = {

        self:this,

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

            _init:function (data) {

                this.data = data

                var canvasContainer = document.querySelector('#canvas-stage');

                this.canvas = document.createElement('canvas');

                this.canvas.width = innerWidth;
                this.canvas.height = 600;

                canvasContainer.appendChild(this.canvas);

                if (!!(this.canvas.getContext && this.canvas.getContext('2d'))) {

                    this.context = this.canvas.getContext('2d');

                    this._createParticles();
                }

                this._initEvents();
            },

            _goTo:function (data) {
                this.data = data;

                this._refresh();
            },

            _onMouseMove:function (event) {

                event.preventDefault();

                this.mouse.x = event.pageX - ( scrollX() + this.canvas.getBoundingClientRect().left );
                this.mouse.y = event.pageY - ( scrollY() + this.canvas.getBoundingClientRect().top );

                this._drawPath();
            },

            _onClick:function (event) {

                event.preventDefault();

            },

            _onWindowResize:function () {
                this.canvas.width = window.innerWidth;

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

//                this.canvas.addEventListener('click', function (event) {
//                    self._onClick.call(self, event)
//                }, false);
            },

            _createParticles:function () {

                var self = this;

                this._createShapeParticles();
                this._createTextParticles();
                this._renderLoop();

            },

            _refresh: function() {

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
                    alert('ui');
                }

                if ((this.mouse.x > this.imgX + 20 && this.mouse.x < this.imgX + 40) && (this.mouse.y > this.imgY && this.mouse.y < this.imgY + 20))
                    this.pathStarted = true;

                if ((this.mouse.x > this.imgX2 - 20 && this.mouse.x < this.imgX2) && (this.mouse.y > this.imgY2 - 40 && this.mouse.y < this.imgY2 - 20))
                    this.pathFinished = true;

                if (this.mouse.x > this.imgX && this.mouse.x < this.imgX2)

                    this.particles.path.push({

                        x:this.mouse.x,
                        y:this.mouse.y,

                        hasBorn:true,

                        ease:0.04 + Math.random() * 0.06,
                        bornSpeed:0.07 + Math.random() * 0.07,

                        alpha:0,
                        maxAlpha:0.7 + Math.random() * 0.4,

                        radius:12,
                        maxRadius:5,

                        color:'#fff',
                        interactive:false

                    });
            },

            _generateText:function () {
                this.context.font = 100 + 'px Arial, sans-serif';
                this.context.fillStyle = 'rgb(255, 255, 255)';
                this.context.textAlign = 'center';

                var sentence = this.data.text.toUpperCase().split('').join(String.fromCharCode(8202));

                this.context.fillText(sentence, this.canvas.width * 0.5, this.canvas.height - 50);
            },


            _grabParticlesFromCanvas:function () {

                var generated = [];

                var surface = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

                for (var width = 0; width < surface.width; width += this.data.density) {

                    for (var height = 0; height < surface.height; height += this.data.density) {

                        var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];

                        if (color === 255) {

                            var radius = randomBetween(this.data.shape.radius.min, 30);
                            var hasBorn = radius > 0 || radius < 12 ? false : true;

                            var color = this.colors[~~(Math.random() * this.colors.length)];

                            generated.push({

                                x:width,
                                y:height,

                                hasBorn:hasBorn,

                                ease:0.04 + Math.random() * 0.06,
                                bornSpeed:0.07 + Math.random() * 0.07,

                                alpha:0,
                                maxAlpha:0.7 + Math.random() * 0.4,

                                radius:radius,
                                maxRadius:this.data.shape.radius.max || 8,
                                orbit:8,

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


                [].forEach.call(this.particles.coords, function (particle, index) {

                    if (!particle.interactive) {

                        self.particles.all[index].x += ((particle.x + Math.cos(particle.angle + index) * particle.orbit) - self.particles[index].x) * 0.08;
                        self.particles.all[index].y += ((particle.y + Math.sin(particle.angle + index) * particle.orbit) - self.particles[index].y) * 0.08;

                    }


                    particle.angle += 0.08;

                });

                if (this.swapText.length < this.particles.length) {

                    var extra = [].slice.call(this.particles, this.swapText.length, this.particles.length);

                    for (var index = 0; index < extra.length; index++)

                        this.particles.splice(index, 1);

                }

            },


            _update:function () {

                var self = this;

//              this._updateTransition();

                this.particles.all = this.particles.shape.concat(this.particles.text, this.particles.path);

                [].forEach.call(this.particles.all, function (particle, index) {

                    particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;

                    if (particle.hasBorn) {

                        particle.radius += (0 - particle.radius) * particle.bornSpeed;

                        if (Math.round(particle.radius) === 0)

                            particle.hasBorn = false;

                    }

                    if (!particle.hasBorn) {

                        particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;

                        if (Math.round(particle.radius) === particle.maxRadius)

                            particle.hasBorn = true;

                    }


                });

                [].forEach.call(this.particles.shape, function (particle, index) {
                    if (distanceTo(self.mouse, particle) <= 5) {
                        self.particles.path = [];
                        self.pathStarted = self.pathFinished = false;
                    }
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


