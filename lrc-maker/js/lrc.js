function nthIndexOf(str, sub, n) {
    var start = 0;
    var index = -1;
    for (var i = 0; i < n; i++) {
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
        return nthIndexOf(str, "\n", lineNum - 1) + 1;
    }
}

var domAudioInput = $("#file-uploader")[0];
var domAudio = $("#player")[0];
var jEditor = $("#lyric-editor");

function getCurserLineNum() {
    var domEditor = jEditor[0];
    return domEditor.value.substr(0, domEditor.selectionStart).split("\n").length;
}

function createTimeTag(time) {
    var minutes = Math.floor(time / 60);
    var seconds = (time - minutes * 60).toFixed(2);
    var minutesToStr = ("0" + minutes).slice(-2);
    var secondsInt = Math.floor(seconds);
    var secondsDec = (seconds - secondsInt).toFixed(2);
    var secondsToStr = ("0" + secondsInt).slice(-2) + secondsDec.toString().substr(1);
    return "[" + minutesToStr + ":" + secondsToStr + "]";
}

function scrollToCursor() {
    var lineNum = getCurserLineNum(jEditor);
    var lineHeight = parseInt(jEditor.css("line-height"));
    var paddingTop = parseInt(jEditor.css("padding-top"));
    var editorHeight = parseInt(jEditor.css("height"));
    var cursorTopmost = paddingTop + lineHeight * (lineNum - 1);
    var cursorBottommost = lineHeight * lineNum - editorHeight - paddingTop;
    var currentScrollTop = jEditor.scrollTop();
    if (currentScrollTop > cursorTopmost) {
        jEditor.scrollTop(cursorTopmost - lineHeight);
    }
    else if (currentScrollTop < cursorBottommost) {
        jEditor.scrollTop(cursorBottommost);
    }
}

function insertTag() {
    var domEditor = jEditor[0];
    var text = domEditor.value;
    var lineNum = getCurserLineNum(jEditor);
    var lineStartPos = lineStartAt(text, lineNum);
    var textBefore = text.substring(0, lineStartPos);
    var textAfter = text.substring(lineStartPos, text.length);
    domEditor.value = textBefore + createTimeTag(domAudio.currentTime) + textAfter;
    var nextLineStartPos = nthIndexOf(domEditor.value, "\n", lineNum) + 1;
    var currentScrollTop = jEditor.scrollTop();  
    domEditor.focus();
    jEditor.scrollTop(currentScrollTop);
    domEditor.setSelectionRange(nextLineStartPos, nextLineStartPos);
    scrollToCursor(jEditor);
}

function removeTag() {
    var domEditor = jEditor[0];
    var text = domEditor.value;
    var lineNum = getCurserLineNum(jEditor);
    var lineStartPos = lineStartAt(text, lineNum);
    var textBefore = text.substring(0, lineStartPos);
    var textAfter = text.substring(lineStartPos, text.length);
    var lineLength = textAfter.indexOf("\n");
    var textCurrentLine = textAfter.substring(0, lineLength);
    var lastTagWrapperPos = textCurrentLine.lastIndexOf("]");
    textAfter = textAfter.substring(lastTagWrapperPos + 1, textAfter.length);
    domEditor.value = textBefore + textAfter;
    var currentScrollTop = jEditor.scrollTop(); 
    domEditor.focus();
    jEditor.scrollTop(currentScrollTop);
    domEditor.setSelectionRange(lineStartPos, lineStartPos);
    scrollToCursor(jEditor);
}

function editTag(action) {
    
    var domEditor = jEditor[0];
    var text = domEditor.value;
    var lineNum = getCurserLineNum(jEditor);
    var lineStartPos = lineStartAt(text, lineNum);
    var textBefore = text.substring(0, lineStartPos);
    var textAfter = text.substring(lineStartPos, text.length);
    var scrollTo = 0;
    
    switch(action) {
        
    case "insert":
        domEditor.value = textBefore + createTimeTag(domAudio.currentTime) + textAfter;
        var nextLineStartPos = nthIndexOf(domEditor.value, "\n", lineNum) + 1;
        scrollTo = nextLineStartPos;      
        break;
    case "remove":
        var lineLength = textAfter.indexOf("\n");
        if (lineLength === -1) lineLength = textAfter.length;
        var textCurrentLine = textAfter.substring(0, lineLength);
        var lastTagWrapperPos = textCurrentLine.lastIndexOf("]");
        textAfter = textAfter.substring(lastTagWrapperPos + 1, textAfter.length);
        domEditor.value = textBefore + textAfter;
        scrollTo = lineStartPos;
        break;
    case "replace":
        var lineLength = textAfter.indexOf("\n");
        if (lineLength === -1) lineLength = textAfter.length;
        var textCurrentLine = textAfter.substring(0, lineLength);
        var lastTagWrapperPos = textCurrentLine.lastIndexOf("]");
        textAfter = textAfter.substring(lastTagWrapperPos + 1, textAfter.length);
        domEditor.value = textBefore + createTimeTag(domAudio.currentTime) + textAfter;
        var nextLineStartPos = nthIndexOf(domEditor.value, "\n", lineNum) + 1;
        scrollTo = nextLineStartPos;
        break;
    }
    var currentScrollTop = jEditor.scrollTop();
    domEditor.focus();
    jEditor.scrollTop(currentScrollTop);
    domEditor.setSelectionRange(scrollTo, scrollTo);
    scrollToCursor(jEditor);
    
}