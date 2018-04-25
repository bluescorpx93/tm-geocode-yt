const APIKEY = `AIzaSyBr-bRYdgqrfnYLNzQR8_m_sW1cLMPGRpY`;
const APIURL = "https://maps.googleapis.com/maps/api/geocode/json";

var addressInput = document.getElementById("addressInput");
var mapElem = document.getElementById("map");
const statusDiv = document.getElementById("statusMsg");

let theAddress = '';
let ADDRSS_LAT, ADDRSS_LNG, INFO_ADDRSS;

document.getElementById("loadMap").addEventListener("click", testAll);

document.getElementById("clearAll").addEventListener("click", function(e){
  e.preventDefault(); 
  mapElem.innerHTML = "";
  statusDiv.innerHTML = "";
});

addressInput.addEventListener("keyup", function(e){
  var keyboardCode = (e.keyCode ? e.keyCode : e.which);
  statusDiv.innerHTML = addressInput.value;
  if(keyboardCode == 13) {
    theAddress = addressInput.value;
    initGeoCodeAxios();
  }
});


function testAll(e){
  e.preventDefault();
  statusDiv.innerHTML = addressInput.value;
  addressInput.value? ( theAddress = addressInput.value, initGeoCodeAxios() ) : ( statusDiv.innerHTML = "<h5> Please Type sth!</h5>", mapElem.innerHTML = "");
}

function initGeoCodeAxios() {

  axios.get(APIURL, {
    params: {
      address: theAddress,
      key: APIKEY
    }
  }).then((res) => {
    var theData = res.data.results[0];

    var formatted_address = theData.formatted_address;

    var types = "";
    for (var i in theData.types) {
      types += `${theData.types[i]} ,`;
    };

    ADDRSS_LAT = theData.geometry.location.lat;
    ADDRSS_LNG = theData.geometry.location.lng;
    INFO_ADDRSS = `${theData.address_components[0].long_name}, ${theData.address_components[1].long_name} - ${types}`;

    console.log(ADDRSS_LAT, ADDRSS_LNG);

    statusDiv.innerHTML = `
      <div class='col s12'>
        <h5> Address: ${formatted_address}</h5>
        <p> Lat: ${ADDRSS_LAT}</p>
        <P> Lng: ${ADDRSS_LNG}</P>
      </div>
    `;

    
    var mapOptionsObj = {
      zoom: 14,
      center: {
        lat: ADDRSS_LAT,
        lng: ADDRSS_LNG,
      }
    }

    var theMap = new google.maps.Map(mapElem, mapOptionsObj);
    var markerOptionsObj = {
      position: {
        lat: ADDRSS_LAT,
        lng: ADDRSS_LNG
      },
      map: theMap
    }

    var theMarker = new google.maps.Marker(markerOptionsObj);
    var theInfoWindow = new google.maps.InfoWindow({
      content: `${INFO_ADDRSS}`
    });

    theMarker.addListener("click", function () {
      theInfoWindow.open(theMap, theMarker);
    })

  }).catch((err) => {
    statusMsg.innerHTML = err;
  })
}


// function initMap(){

//   var mapElem = document.getElementById("map");
//   var mapOptionsObj = {
//     zoom:12,
//     center:{
//       lat: ADDRSS_LAT,
//       lng: ADDRSS_LNG,
//       // lat: 23.8639354,
//       // lng: 90.3953525
//     }
//   }

//   var markerOptionsObj = {
//     position: {
//       lat: ADDRSS_LAT, 
//       lng: ADDRSS_LNG
//     }, 
//     map: theMap
//   }

//   var theMap = new google.maps.Map(mapElem, mapOptionsObj);

//   var theMarker = new google.maps.Marker(markerOptionsObj);

//   var theInfoWindow = new google.maps.InfoWindow({ content: `${INFO_ADDRSS}`});

//   theMarker.addListener("click", function(){
//     theInfoWindow.open(theMap, theMarker);
//   })
// }