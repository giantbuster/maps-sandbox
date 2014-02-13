//streetviewpoint.js

//Class: StreetViewPoint
//========================
//Generates and stores information of a single street view image call,
//generating the source URL and marker.

function StreetViewPoint(latLng, heading, imgOptions){
	var imgOptions = imgOptions;
	this.latLng = latLng;
	var heading = heading;
	var self = this;

	function createSrc(){
        var src = "http://maps.googleapis.com/maps/api/streetview?location="+
                    latLng.toUrlValue()+
                    "&heading="+
                    heading+
                    "&size="+
                    imgOptions.width+"x"+imgOptions.height+
                    "&fov="+
                    imgOptions.fov+
                    "&pitch="+
                    imgOptions.pitch+
                    "&sensor=false&key="+
                    imgOptions.key;
        self.src = src;
    }

    function createMarker(){
        var marker = new google.maps.Marker({
            position: latLng,
        });
        self.marker = marker;
    }

    createSrc();
    createMarker();
}