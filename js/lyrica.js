(function (window) {
    'use strict'

    // To parse formatted .lrc text file
    function parse(data) {
        let regexp = /\[\d{2}:\d{2}.\d{2}\]/g;
        function linesCleanup(input) {
            let output = [];
            for (let i = 0; i < input.length; i++) {
                if (input[i].search(regexp) >= 0) {
                    output.push(input[i]);
                }
                else {
                    console.warn('Lyrica.load(): Line ' + i + ' is not a valid lyrics line, would be ignored.\nLine: "' + input[i] + '"');
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

    // To create html tags conveniently
    function quickCreate(tag, initClassName, initHTML) {
        let element = document.createElement(tag);
        if (initClassName) { element.className = initClassName; }
        if (initHTML) { element.innerHTML = initHTML; }
        return element;
    }


    function LyricaPrismriver(desc) {

        // Outer DOM. Picked by user
        this.domOuter = document.querySelector(desc.el);

        // Inner DOM. Managing rows of lyrics
        this.domInner = quickCreate('div');

        // Initial top offset allowing adjusting lyrics position
        this.offsetTop = desc.offsetTop ? desc.offsetTop : 0;

        // Storing parsed lyrics data
        this.data = null;

        // Recording current line #. Upon change during lyrics scrolling.
        this.currentLine = 0;

        // Setup default styles
        this.domOuter.innerHTML = '';
        this.domOuter.style.textAlign = 'center';
        this.domOuter.style.overflow = 'hidden';
        this.domOuter.appendChild(this.domInner);
        this.domInner.style.position = 'relative';
        this.domInner.className = 'lyrica-inner';

    }


    LyricaPrismriver.prototype.clear = function () {
        this.data = null;
        this.domInner.style.top = this.offsetTop + 'px'
    };

    LyricaPrismriver.prototype.load = function (data) {
        this.data = parse(data);
        this.currentLine = -1;
        this.domInner.innerHTML = '';
        for (var i = 0; i < this.data.length; i++) {
            let p = quickCreate('p', null, this.data[i][1]);
            if (this.data[i][2]) {
                p.appendChild(quickCreate('br'));
                p.appendChild(quickCreate('small', null, this.data[i][2]));
            }
            this.domInner.appendChild(p)
        }
        this.domInner.style.top = this.offsetTop + 'px';
    };

    LyricaPrismriver.prototype.update = function (time) {
        if (this.data) {
            for (let i = this.data.length - 1; i >= 0; i--) {
                if (time >= this.data[i][0]) {
                    if (i != this.currentLine) {
                        let currentLine = this.domInner.querySelectorAll('p')[i];
                        this.currentLine = i;
                        let activeLines = this.domInner.querySelectorAll('.active');
                        for (let i = 0; i < activeLines.length; i++) {
                            activeLines[i].className = '';
                        }
                        currentLine.className = 'active';
                        this.domInner.style.top = (this.offsetTop - currentLine.offsetTop) + 'px';
                    }
                    break;
                }
            }
        }
    };

    if (typeof (window.Lyrica) === 'undefined') {
        window.Lyrica = LyricaPrismriver;
    }

})(window);
