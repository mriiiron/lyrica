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

### Who is Lyrica?
> Lyrica Prismriver is a "poltergeist (phantom, or ghost)". She's able to play her musical instrument without actually touching, just like her sisters.

—— From [Touhou Project](https://en.wikipedia.org/wiki/Touhou_Project)

![Lyrica Prismriver](./assets/lyrica-bw.png "Lyrica Prismriver")
