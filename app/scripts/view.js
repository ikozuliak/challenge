(function (window) {
    'use strict';

    function View() {

        this.View
            = '<div class="row">'
            +   '<a href="#" data-id="{{id}}">{{name}}</a>'
            + '</div>';

    }

    View.prototype  = {

        self : this,

        canvasExtension : {

            mouse : { x:-99999, y:-99999 },
            particles : [],
            shape: {},
            swapText : [],
            colors: ['#fff', '#e13123'],

            _init : function(data){

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

            _onMouseMove : function(event) {

                event.preventDefault();

                this.mouse.x = event.pageX - ( scrollX() + this.canvas.getBoundingClientRect().left );
                this.mouse.y = event.pageY - ( scrollY() + this.canvas.getBoundingClientRect().top );

                this.particles.push({

                    x:this.mouse.x,
                    y:this.mouse.y,

                    hasBorn:true,

                    ease:0.04 + Math.random() * 0.06,
                    bornSpeed:0.07 + Math.random() * 0.07,

                    alpha:0,
                    maxAlpha:0.7 + Math.random() * 0.4,

                    radius:20,
                    maxRadius:5,

                    color:'#fff',
                    interactive:false

                });
            },

            _onClick : function(event) {

                event.preventDefault();


            },

            _draw: function(){

            },


            _onWindowResize : function(){
                this.canvas.width = window.innerWidth;

                this.swapText = [];
                this._createShapeParticles();
            },

            _initEvents:function () {

                var self = this;

                window.onresize = this._onWindowResize.bind(this);
                this.canvas.addEventListener('mousemove', function(event) { self._onMouseMove.call(self, event) }, false);
                this.canvas.addEventListener('click', function(event) { self._onClick.call(self, event) }, false);
            },

            _createParticles:function () {

                var self = this;

                this._createShapeParticles();
                this._renderLoop();

            },

            _generateText:function () {
                this.context.font = 100 + 'px Arial, sans-serif';
                this.context.fillStyle = 'rgb(255, 255, 255)';
                this.context.textAlign = 'center';

                var sentence = this.data.text.toUpperCase().split('').join(String.fromCharCode(8202));

                this.context.fillText(sentence, this.canvas.width * 0.5, this.canvas.height - 50);
            },


            _grabParticlesFromCanvas:function () {

                var surface = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

                for (var width = 0; width < surface.width; width += 7) {

                    for (var height = 0; height < surface.height; height += 7) {

                        var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];

                        if (color === 255) {

                            var radius = randomBetween(0, 12);
                            var hasBorn = radius > 0 || radius < 12 ? false : true;

                            var color = this.colors[~~(Math.random() * this.colors.length)];

                            this.particles.push({

                                x:width,
                                y:height,

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
                    }

                }

                return this.swapText.length;

            },

            _createShapeParticles:function () {

                var self = this;

                var img = new Image();
                var surface;


                img.onload = function () {

                    self.context.drawImage(img, self.canvas.width/2 - img.width/2, 30);

                    self._createTextParticles();
                }

                img.src = this.data.shape;
            },

            _createTextParticles:function () {

                this._generateText();
                var seed = this._grabParticlesFromCanvas();

//                for (var quantity = 0, len = seed; quantity < len; quantity++) {
//
//                    var radius = randomBetween(0, 12);
//                    var hasBorn = radius > 0 || radius < 12 ? false : true;
//
//                    var color = this.colors[~~(Math.random() * this.colors.length)];
//
//                    this.particles.push({
//
//                        x:this.swapText[quantity].x,
//                        y:this.swapText[quantity].y,
//
//                        hasBorn:hasBorn,
//
//                        ease:0.04 + Math.random() * 0.06,
//                        bornSpeed:0.07 + Math.random() * 0.07,
//
//                        alpha:0,
//                        maxAlpha:0.7 + Math.random() * 0.4,
//
//                        radius:radius,
//                        maxRadius:4,
//
//                        color:color,
//                        interactive:false
//
//                    });
//
//                }


            },

            _clear:function () {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            },

            _updateTransition:function () {

                var self = this;


//                [].forEach.call(this.particles, function (particle, index) {
//
//                    if (!self.particles[index].interactive) {
//
//                        self.particles[index].y += ((particle.y + Math.sin(particle.angle + index) * particle.orbit) - self.particles[index].y) * 0.08;
//
//                    }
//
//                    else {
//
//                        self.particles[index].x += ((self.mouse.x + Math.sin(particle.angle) * 30) - self.particles[index].x) * 0.08;
//                        self.particles[index].y += ((self.mouse.y + Math.cos(particle.angle) * 30) - self.particles[index].y) * 0.08;
//
//                    }
//
//                    particle.angle += 0.08;
//
//                });

//                if(this.swapText.length < this.particles.length) {
//
//                    var extra = [].slice.call(this.particles, this.swapText.length, this.particles.length);
//
//                    for(var index = 0; index < extra.length; index++)
//
//                        this.particles.splice(index, 1);
//
//                }

            },


            _update:function () {

                var self = this;

//                this._updateTransition();


                [].forEach.call(this.particles, function (particle, index) {

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

                    if(distanceTo(self.mouse, particle) <= 1)
                        {
                            console.log('collision')
                        }


                })

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


