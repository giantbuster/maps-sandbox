//StreetViewGallery
//-----------------
// By: Jefferson Lam
// Updated: January 22nd, 2014
// Special Thanks To:
//      Google
//      CodingDojo : http://codingdojo.com/
//      Brian Folts : http://www.brianfolts.com/driver/
//      The Folks behind HyperLapse : http://hyperlapse.tllabs.io/

function StreetViewGallery(divID, imgOptions){
    // console.log('divID:', divID);
    this.divID = divID;
    this.imgOptions = imgOptions;
    var webService = new google.maps.StreetViewService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var RADIUS = 10;
    var LIMIT = 100;

    //findRoute(origin, destination)
    //------------------------------
    //Public function. Finds directions from pointA to pointB using Google Maps API,
    //pulls up street view images between pointA and pointB, generates HTML, and
    //displays it.
    this.findRoute = function(origin, destination) {
        var start = origin;
        var end = destination;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                resetStreetViews();
                directionsDisplay.setMap(googleMap);
                directionsDisplay.setDirections(response);
                findStreetViews(response.routes[0].overview_path);
            }
        });
    }

    //Given an array of points, goes through them and finds panoramic images
    function findStreetViews(pointsArray){
        var currentIteration = 0;
        var panoArray = [];
        for (var i = 0; i < (pointsArray.length > LIMIT ? LIMIT : pointsArray.length); i++){
            findPanorama(pointsArray[i], i, pointsArray.length, panoArray, currentIteration);
        }

        //Tries to find a single panoramic image at a point, and puts it into the specified index
        function findPanorama(point, index, pointsArrayLength, panoArray){
            webService.getPanoramaByLocation(point, RADIUS, function(result, status){
                currentIteration++;
                panoArray[index] = result;

                //If we're on the last iteration, parse the entire array
                if (currentIteration == (pointsArrayLength > LIMIT ? LIMIT : pointsArrayLength)){
                    parsePanoramaArray(panoArray);
                }
            });
        }
    }

    //Given an array of Street View Panorama points, remove any null elements,
    //generate headings for each point (for the URL), generate HTML tags with ,
    //and display the HTML.
    function parsePanoramaArray(panoArray){
        trimNull(panoArray);
        getAllHeadings(panoArray);
        markerArray = getAllMarkers(panoArray);
        var htmlArray = getAllStreetViewHTML(panoArray);
        displayHTML(htmlArray);
    }

    //Removes null elements from an array
    function trimNull(array){
        for(var i = 0; i<array.length; i++) {
            if(array[i] == null) {
                array.splice(i--, 1);
            }
        }
    }

    //Calculates heading between i and i+1 for every google Point in an array
    function getAllHeadings(array){
        var heading = 0;
        for (var i = 0; i<array.length; i++){
            if (array[i] && array[i+1]) heading = calculateHeading(array[i], array[i+1]);
            array[i].heading = heading;
        }
    }

    //Given two Google Map Points, calculates heading from pointA to pointB
    function calculateHeading(pointA, pointB){
        return google.maps.geometry.spherical.computeHeading(pointA.location.latLng, pointB.location.latLng);
    }

    //Given an array of Google Maps points, creates an array of markers
    function getAllMarkers(array){
        var markers = [];
        for (var i = 0; i < array.length; i++){
            markers[i] = createMarker(array[i].location.latLng);
        }
        return markers;
    }

    //Given a latLng, creates a marker (not on a map)
    function createMarker(latLng){
        var marker = new google.maps.Marker({
            position: latLng,
        });
        return marker;
    }

    //Given an array of HTML, adds the HTML into the specified ID
    function displayHTML(array){
        for (var i = 0; i < array.length; i++){
            document.getElementById(divID).innerHTML += array[i];
        }
        //Insert CSS class for first streetview
        document.getElementById(divID).firstChild.className += 'current-image';
    }

    //Given an array of street view panorama points, creates an array 
    //of HTML with those street view images (div tags with image as background)
    function getAllStreetViewHTML(array){
        var htmlArray = [];
        for (var i = 0; i<array.length; i++){
            htmlArray[i] = generateStreetViewHTML(array[i]);
        }
        return htmlArray;
    }
    
    //Takes a single Google Maps Point and generates
    //a div with the streetview image as its background.
    function generateStreetViewHTML(point){
        var src = streetViewSrc(point);
        var html = divWithBackground(src);
        return html;
    }

    //Take a Google Maps Point for a street view image and 
    //generates a URL for it, using location, heading, size, fov, pitch, and key. 
    function streetViewSrc(point){
        var src = "http://maps.googleapis.com/maps/api/streetview?location="+
                    point.location.latLng.toUrlValue()+
                    "&heading="+
                    point.heading+
                    "&size="+
                    imgOptions.width+"x"+imgOptions.height+
                    "&fov="+
                    imgOptions.fov+
                    "&pitch="+
                    imgOptions.pitch+
                    "&sensor=false&key="+
                    imgOptions.key;
        return src;
    }

    //Given a url source, puts it in a div as the background image
    function divWithBackground(src){
        var div = '<div style="background-image: url(\''+src+'\');"></div>';
        return div;
    }

    //On form submit, resets images and variables
    function resetStreetViews(){
        document.getElementById('streetview-images').innerHTML = "";
        directionsDisplay.setMap(null);
        currImage = 0;
        markerArray = [];
    }
};