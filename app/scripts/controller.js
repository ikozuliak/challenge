(function (window) {
    'use strict';

    function Controller(view, model, options) {

        this.view = view;
        this.model = model;

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

            this._initEvents();

        },

        _initEvents:function () {

            var self = this;

            [].forEach.call(
                document.body.querySelectorAll('[data-toggle="demo"]'),
                function (ev) {
                    ev.addEventListener('click', function () {
                            self._startDemo();
                        }
                    );
                });
        },

        _toggleYouTubePlayer:function () {
            document.querySelector('#canvas-stage').style.display = 'block';
            document.querySelector('#player').style.display = 'none';

        },

        _initYouTubePlayer:function () {

            var self = this;
            var player;
            var tag = document.createElement('script');
            var firstScriptTag = document.getElementsByTagName('script')[0];

            tag.src = "https://www.youtube.com/iframe_api";
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            document.querySelector('#canvas-stage').style.display = 'none';

            window.onYouTubeIframeAPIReady = function () {
                player = new YT.Player('player', {
                    height:self.canvas.height,
                    width:self.canvas.width,
                    videoId:self.data.steps[self.stepIndex - 1].video,
                    events:{
                        'onReady':onPlayerReady,
                        'onStateChange':onPlayerStateChange
                    }
                });
            }

            function onPlayerReady(event) {
                event.target.playVideo();
            }

            function onPlayerStateChange(event) {

                if (event.data === 0) {
                    self.view.canvasExtension._goTo(self.stepIndex++);
                    self._toggleYouTubePlayer();
                }
            }
        },

        _startDemo:function () {

            var self = this;

            document.querySelector('#modal').className = 'in';
            document.querySelector('#overlay').className = 'in';

            this.data = this.model.getData();
            this.canvas = this.view.canvasExtension._init(this.data, 0);

            this.canvas.addEventListener('click', function (event) {
                self._onCanvasClick.call(self, event)
            }, false);

        },

        _onCanvasClick:function (event) {

            event.preventDefault();

            if (this.data.steps[this.stepIndex].url)
                window.open(this.data.steps[this.stepIndex].url);

            else if (this.data.steps[this.stepIndex].video) {
                this._initYouTubePlayer();
                this.stepIndex++;
            }

            else if (!this.data.steps[this.stepIndex - 1].blocked)
                this.view.canvasExtension._goTo(this.stepIndex++);


        }

    }
    window.app.Controller = Controller;

})(window);