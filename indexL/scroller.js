//scroller.js
//===========
//Reads scroll input and parses it accordingly.
//Changes images, changes markers on google map, updates progress bar.

//Distance between each image change
var sensitivity = 200;
var pageHeight;

$(document).ready(function() {
    var windowHeight = $(window).height();
    var scrollDistance;
    var scrollPercentage;
    var numImages;
    var displayedImage = 1;
    var currImage = 1;

    $('.tab').on('click', function() {
        togglePanel();
    });

    $(window).resize(function() {
        //Set page height for number of images grabbed. 
        //TODO: Only do this on a new search and window resize, not every time page is scrolled.
        numImages = streetVG.numImages();
        windowHeight = $(window).height();
        //subtract 1 to make make sure currImage calculation doesn't exceed numImages
        pageHeight = windowHeight + (numImages * sensitivity) - 1;
        $('#container').css("height", pageHeight);
        $('#bottom').css("bottom", 0);
    });

    // $(window).scroll(function(){
    $(window).on('scroll', function(){
        scrollDistance = getScrollDistance();
        scrollPercentage = getScrollPercentage();
        moveTracker(scrollPercentage);
        //Find image for current distance
        currImage = getCurrImage();
        // console.log('currImage', currImage);
        // console.log('displayedImage', displayedImage);
        //Update current image
        if (currImage != displayedImage){
            // console.log('changing image');
            updateDisplayedImage(currImage);
            updateMarker(currImage, displayedImage);
            displayedImage = currImage;
        }
    });

    function togglePanel(){
        $('.panel-with-tab').animate({
            "right": parseInt($('.panel-with-tab').css('right'))==0 ? "-=270px" : "+=270px"
            }, 
            300
        );
    }

    function getScrollDistance(){
        //maybe constrain this scroll distance so that we don't have to do
        //constrain checks in the percentage and currImage
        var dist = $(document).scrollTop();
        if (dist<0){
            dist = 0;
        } else if (dist>pageHeight - windowHeight) {
            dist = pageHeight - windowHeight;
        }
        return dist;
    }

    function getScrollPercentage(){
        var percentage = scrollDistance/(pageHeight - windowHeight) * 100;
        // console.log('percentage', percentage);
        if (percentage>100){
            percentage = 100;
        } else if (percentage<0){
            percentage = 0;
        }
        return percentage;
    }

    function moveTracker(percentage){
        // console.log(percentage);
        $('.tracker').css('left', percentage+'%');
    }

    function getCurrImage(){
        //currImage and numImages are 1-indexed.
        var currImg = Math.floor(scrollDistance/sensitivity) + 1;
        if (currImg<1) {
            currImg = 1;
        } else if (currImg>numImages){
            currImg = numImages;
        }
        return currImg;
    }

    function updateDisplayedImage(currImg){
        $("#streetview-images > div").removeClass("current-image");
        $("#streetview-images > div:nth-child("+currImg+")" ).addClass("current-image");
    }

    function updateMarker(currImg, displayedImg){
        //currImage and displayedImage are 1-indexed, while the array in 
        //streetVG is 0-indexed, so we used -1 to fix this misalignment
        streetVG.removeMarker(displayedImg-1);
        streetVG.displayMarker(currImg-1, googleMap);
    }

    var imgs = $("#test > img").not(function() {
        return this.complete; 
    });
    //Number of imgs that are not done loading
    var count = imgs.length;

    //Check if any images need to be loaded
    if (count) {
        //Wait for them to load
        console.log('loading...');
        imgs.load(function() {
            count--;
            //Check again if count is 0
            if (!count) {
                $("#test").show();
                console.log('done loading');
            }
        });
    //If count is 0 to begin with, all images were already done loading
    } else {
        $("#test").show();
    }
});