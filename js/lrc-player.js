(function (window, $) {
    'use strict'

    function LRCPlayer(desc) {
        this.el = desc.el;
        this.offsetTop = desc.offsetTop ? desc.offsetTop : 0;
        this.data = null;
        this.currentLine = 0;
        $(this.el).css('position', 'relative');
    }

    LRCPlayer.parse = function (data) {
        let regexp = /\[\d{2}:\d{2}.\d{2}\]/g;
        function linesCleanup(input) {
            let output = [];
            for (let i = 0; i < input.length; i++) {
                if (input[i].search(regexp) >= 0) {
                    output.push(input[i]);
                }
                else {
                    console.warn('LRCPlayer.load(): Line ' + i + ' is not a valid lyrics line, would be ignored.\nLine: "' + input[i] + '"');
                }
            }
            return output;
        }
        let lines = linesCleanup(data.split('\n'));
        let result = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let nodes = line.match(regexp);
            let splitted = line.replace(regexp, '').trim().split('|');
            let text = splitted[0].trim();
            let translation = null;
            if (splitted.length > 1) {
                translation = splitted[1].trim();
            }
            for (let j = 0; j < nodes.length; j++) {
                let t = nodes[j].slice(1, -1).split(':');
                let resultItem = [parseInt(t[0], 10) * 60 + parseFloat(t[1]), (text == '' ? '&nbsp;' : text)];
                if (translation) {
                    resultItem.push(translation);
                }
                result.push(resultItem);
            }
        }
        return result.sort((a, b) => (a[0] - b[0]));
    }

    LRCPlayer.prototype.load = function (data) {
        this.data = LRCPlayer.parse(data);
        this.currentLine = -1;
        let $container = $(this.el);
        $container.empty();
        for (var i = 0; i < this.data.length; i++) {

            let $p = $('<p>' + this.data[i][1] + '</p>')
            if (this.data[i][2]) {
                $p.append('<br /><small>' + this.data[i][2] + '</small>');
            }


            $container.append($p);
        }
        $container.css('top', this.offsetTop + 'px');
    };

    LRCPlayer.prototype.clear = function () {
        this.data = null;
        $(this.el).css('top', this.offsetTop + 'px');
    };

    LRCPlayer.prototype.update = function (time) {
        if (this.data) {
            let $container = $(this.el);
            for (let i = this.data.length - 1; i >= 0; i--) {
                if (time >= this.data[i][0]) {
                    if (i != this.currentLine) {
                        let $currentLine = $container.find('p').eq(i);
                        this.currentLine = i;
                        $container.find('.active').removeClass('active');
                        $currentLine.addClass('active');
                        $container.css('top', (this.offsetTop - $currentLine[0].offsetTop) + 'px');
                    }
                    break;
                }
            }
        }
    };

    if (typeof (window.LRCPlayer) === 'undefined') {
        window.LRCPlayer = LRCPlayer;
    }

})(window, $);
