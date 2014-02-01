//imagehandler.js

// BEGIN CLASS DEFINITION
//======================
// Class: ImageHandler
//=================
// Generates and displays HTML for an array of StreetViewPoints
// ----------
// REQUIRED PARAMETERS ON CONSTRUCTION
//      divID : string : HTML id where the images will be displayed
// ----------
// USAGE
//      var imageHandler = new imageHandler('streetview-images');
//      imageHandler.displayHTML(svpArray);
// ----------

function imageHandler(divID){
    this.divID = divID;

    this.displayImages = function(svpArray){
        clearImages();
        var imgArray = buildImgTags(svpArray);
        loadImages(imgArray);
    }

    function clearImages(){
        document.getElementById(divID).innerHTML = "";
    }

    function buildImgTags(svpArray){
        var imgArray = [];
        for (var i = 0; i<svpArray.length; i++){
            var img = '<img class="streetview" src="'+svpArray[i].src+'"/>';
            imgArray[i] = img;
        }
        return imgArray;
    }
    function loadImages(imgArray){
        hideImages();
        
        //put the img tags onto the page
        for (var i = 0; i < imgArray.length; i++){
            document.getElementById(divID).innerHTML += imgArray[i];
        }
        document.getElementById(divID).firstChild.className += " current-image"

        var imgs = $("#"+divID+" > img").not(function() { return this.complete; });
        var count = imgs.length;

        //Check if any images need to be loaded
        if (count) {
            //Wait for them to load
            console.log('Loading...');
            imgs.load(function() {
                count--;
                if (!count) {
                    console.log('Done loading!');
                    hideLoadingScreen();
                    showImages();
                }
            });
        //If count is 0 to begin with, all images were already done loading
        } else {
            console.log('No loading needed');
            showImages();
        }
    }

    function displayLoadingScreen(){
        $("#loading-images").css('visibility', 'visible');
    }

    function hideLoadingScreen(){
        $("#loading-images").css('visibility', 'hidden');
    }

    function showImages(){
        $("#"+divID).css('visibility', 'visible');
    }

    function hideImages(){
        $("#"+divID).css('visibility', 'hidden');
    }   
}