//scroller.js
//===========
//Reads scroll input and parses it accordingly.
//Changes images, changes markers on google map, updates progress bar.
var sensitivity = 200;
var pageHeight;
var windowHeight = $(window).height();
var scrollDistance;
var scrollPercentage;
var numImages;
var displayedImage = 1;
var currImage = 1;

$(window).resize(function() {
    //Set page height for number of images grabbed. 
    numImages = streetVG.numImages();
    windowHeight = $(window).height();
    //subtract 1 to make make sure currImage calculation doesn't exceed numImages
    pageHeight = windowHeight + (numImages * sensitivity) - 1;
    $('#container').css("height", pageHeight);
});

$(window).scroll(function(){
    scrollDistance = getScrollDistance();
    scrollPercentage = getScrollPercentage();
    moveTracker(scrollPercentage);

    //Find image for current distance
    currImage = getCurrImage();

    //Update current image
    if (currImage != displayedImage){
        updateDisplayedImage(currImage);
        updateMarker(currImage, displayedImage);
        displayedImage = currImage;
    }
});

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
    $("#streetview-images > img").removeClass("current-image");
    $("#streetview-images > img:nth-child("+currImg+")" ).addClass("current-image");
}

function updateMarker(currImg, displayedImg){
    streetVG.removeMarker(displayedImg-1);
    streetVG.displayMarker(currImg-1, miniMap);
}