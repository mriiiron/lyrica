(function (window, $) {
    'use strict'

    function nthIndexOf(str, sub, n) {
        let start = 0;
        let index = -1;
        for (let i = 0; i < n; i++) {
            index = str.indexOf(sub, start);
            if (index === -1) {
                return -1;
            }
            else {
                start = index + 1;
            }
        }
        return index;
    }

    function lineStartAt(str, lineNum) {
        if (lineNum === 1) {
            return 0;
        }
        else {
            return nthIndexOf(str, '\n', lineNum - 1) + 1;
        }
    }

    function timeTag(time) {
        let minutes = Math.floor(time / 60);
        let seconds = (time - minutes * 60).toFixed(2);
        let minutesToStr = ('0' + minutes).slice(-2);
        let secondsInt = Math.floor(seconds);
        let secondsDec = (seconds - secondsInt).toFixed(2);
        let secondsToStr = ('0' + secondsInt).slice(-2) + secondsDec.toString().substr(1);
        return '[' + minutesToStr + ':' + secondsToStr + ']';
    };


    function LRCMaker(desc) {
        this.el = {
            textarea: desc.el.textarea,
            audio: desc.el.audio
        }
        this.audio = $(this.el.audio)[0];
    }

    LRCMaker.prototype.getCursorLineNum = function () {
        let editor = $(this.el.textarea)[0];
        return editor.value.substr(0, editor.selectionStart).split('\n').length;
    };

    LRCMaker.prototype.scrollToCursor = function () {
        let $editor = $(this.el.textarea);
        let lineNum = this.getCursorLineNum();
        let lineHeight = parseInt($editor.css('line-height'));
        let paddingTop = parseInt($editor.css('padding-top'));
        let editorHeight = parseInt($editor.css('height'));
        let cursorTopmost = paddingTop + lineHeight * (lineNum - 1);
        let cursorBottommost = lineHeight * lineNum - editorHeight - paddingTop;
        let currentScrollTop = $editor.scrollTop();
        if (currentScrollTop > cursorTopmost) {
            $editor.scrollTop(cursorTopmost - lineHeight);
        }
        else if (currentScrollTop < cursorBottommost) {
            $editor.scrollTop(cursorBottommost);
        }
    }

    LRCMaker.prototype.insertTag = function () {
        let $editor = $(this.el.textarea);
        let editor = $(this.el.textarea)[0];
        let text = editor.value;
        let lineNum = this.getCursorLineNum();
        let lineStartPos = lineStartAt(text, lineNum);
        let textBefore = text.substring(0, lineStartPos);
        let textAfter = text.substring(lineStartPos, text.length);
        editor.value = textBefore + timeTag(this.audio.currentTime) + textAfter;
        let nextLineStartPos = nthIndexOf(editor.value, '\n', lineNum) + 1;
        let currentScrollTop = $editor.scrollTop();
        editor.focus();
        $editor.scrollTop(currentScrollTop);
        editor.setSelectionRange(nextLineStartPos, nextLineStartPos);
        this.scrollToCursor();
    }

    LRCMaker.prototype.removeTag = function () {
        let $editor = $(this.el.textarea);
        let editor = $(this.el.textarea)[0];
        let text = editor.value;
        let lineNum = this.getCursorLineNum();
        let lineStartPos = lineStartAt(text, lineNum);
        let textBefore = text.substring(0, lineStartPos);
        let textAfter = text.substring(lineStartPos, text.length);
        let lineLength = textAfter.indexOf('\n');
        let textCurrentLine = textAfter.substring(0, lineLength);
        let lastTagWrapperPos = textCurrentLine.lastIndexOf(']');
        textAfter = textAfter.substring(lastTagWrapperPos + 1, textAfter.length);
        editor.value = textBefore + textAfter;
        let currentScrollTop = $editor.scrollTop();
        editor.focus();
        $editor.scrollTop(currentScrollTop);
        editor.setSelectionRange(lineStartPos, lineStartPos);
        this.scrollToCursor();
    }

    LRCMaker.prototype.editTag = function (action) {
        let $editor = $(this.el.textarea);
        let editor = $(this.el.textarea)[0];
        let text = editor.value;
        let lineNum = this.getCursorLineNum();
        let lineStartPos = lineStartAt(text, lineNum);
        let textBefore = text.substring(0, lineStartPos);
        let textAfter = text.substring(lineStartPos, text.length);
        let scrollTo = 0;
        switch (action) {
            case 'insert':
                {
                    editor.value = textBefore + timeTag(this.audio.currentTime) + textAfter;
                    let nextLineStartPos = nthIndexOf(editor.value, '\n', lineNum) + 1;
                    scrollTo = nextLineStartPos;
                }
                break;
            case 'remove':
                {
                    let lineLength = textAfter.indexOf('\n');
                    if (lineLength == -1) lineLength = textAfter.length;
                    let textCurrentLine = textAfter.substring(0, lineLength);
                    let lastTagWrapperPos = textCurrentLine.lastIndexOf(']');
                    textAfter = textAfter.substring(lastTagWrapperPos + 1, textAfter.length);
                    editor.value = textBefore + textAfter;
                    scrollTo = lineStartPos;
                }
                break;
            case 'replace':
                {
                    let lineLength = textAfter.indexOf('\n');
                    if (lineLength == -1) lineLength = textAfter.length;
                    let textCurrentLine = textAfter.substring(0, lineLength);
                    let lastTagWrapperPos = textCurrentLine.lastIndexOf(']');
                    textAfter = textAfter.substring(lastTagWrapperPos + 1, textAfter.length);
                    editor.value = textBefore + timeTag(this.audio.currentTime) + textAfter;
                    let nextLineStartPos = nthIndexOf(editor.value, '\n', lineNum) + 1;
                    scrollTo = nextLineStartPos;
                }
                break;
            default:
                console.warn('LRCMaker: Unexpected operation "' + action + '"');
                break;
        }
        let currentScrollTop = $editor.scrollTop();
        editor.focus();
        $editor.scrollTop(currentScrollTop);
        editor.setSelectionRange(scrollTo, scrollTo);
        this.scrollToCursor($editor);
    }


    if (typeof (window.maker) === 'undefined') {
        window.LRCMaker = LRCMaker;
    }

})(window, $);
