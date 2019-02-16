# lyrica.js
Make your lyrics scroll along with music play.

[>> Demo <<](http://caiyi.us/lyrica)

## Usage

### Include `lyrica.js`

``` html
<script src="./js/lyrica.js"></script>
```

### Prepare HTML

``` html
<!-- I Use HTML5 audio tag for demonstration. You may also use fancy things like jPlayer -->
<audio src="./assets/ShapeOfYou.mp3" controls>Your browser does not support audio tag.</audio>

<!-- Container for scrolling lyrics -->
<div id="lyrica-wrap"></div>
```

### Load and Play

``` javascript

const lyrica = new Lyrica({

    // Lyrica would reside in your prepared wrapper.
    el: "#lyrica-wrap",
    
    // Adjust the distance between container top and the active line of lyrics.
    offsetTop: 50

});

// Add listener for the audio tag's time updating event then Lyrica would do the work.
const audio = document.querySelector('audio');
audio.addEventListener('timeupdate', function () {

    // update() takes current time of audio as input.
    lyrica.update(audio.currentTime);
    
});


Promise.all([

    // Here I ajax-ed the lyrics file as pure text.
    // You may need to write your own ajax code or use libs such as jQuery.
    ajax('./assets/ShapeOfYou.lrc.txt', 'text')
    
]).then(function (res) {

    // load() would parse pure text lyrics and render into the wrapper.
    lyrica.load(res[0]);

});
```

## Styling

Inside the wrapper (you specified), Lyrica would generate an inner wrapper with class `lyrica-inner`.

Inside the inner wrapper, rows of lyrics would be simply `<p>` elements. The currently active row would have class `active`.

Inside a single line, Translation would be wrapped into a `<small>` tag, prefixed by a `<br />`.

``` html
<div class="lyrica-inner">
    <p>foo foo foo</p>
    <p>foo foo foo<br /><small>translation translation</small></p>
    <p class="active">foo foo foo</p>
    <p>foo foo foo</p>
    ...
</div>
```

### Styling Example:

``` css
.lyrica-inner p {
    color: gray;
}

.lyrica-inner p.active {
    font-weight: bold;
    color: black;
}
```
