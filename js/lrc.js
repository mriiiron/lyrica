(function (window, $) {
    'use strict'

    function Lyrics(desc) {
        this.container = desc.container;
        this.data = null;
        this.currentLine = 0;
        this.offsetTop = 100;
    }

    Lyrics.prototype.load = function (data) {
        let lines = data.split("\n");
        let regexp = /\[\d{2}:\d{2}.\d{2}\]/g;
        let result = [];
        while (!regexp.test(lines[0]) && lines.length > 0) {
            lines = lines.slice(1);
        }
        if (lines[lines.length - 1].length === 0) {
            lines.pop();
        }
        lines.forEach(function (line, i, arr_i) {
            let timeNodes = line.match(regexp);
            let lyricLine = line.replace(regexp, '').trim();
            timeNodes.forEach(function (timeNode, j, arr_j) {
                var t = timeNode.slice(1, -1).split(':');
                result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), (lyricLine == '' ? '&nbsp;' : lyricLine)]);
            });
        });
        result.sort(function (a, b) {
            return a[0] - b[0];
        });
        this.data = result;
        this.currentLine = -1;
        let $container = $(this.container);
        $container.empty();
        for (var i = 0; i < result.length; i++) {
            $container.append('<p>' + result[i][1] + '</p>');
        }
    }

    if (typeof (window.Lyrics) === 'undefined') {
        window.Lyrics = Lyrics;
    }

})(window, $);
