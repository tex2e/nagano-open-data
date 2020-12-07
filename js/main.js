'use strict';

(function () {
  // --- parse csv ---

  var facilities = []; // 施設一覧
  var facilityInfoWindows = []; // 施設情報ウィンドウの一覧

  $.ajax({
    type: "GET",
    url: "data/child-facilities.csv",
    dataType: "text",
    success: function(csvStr) {

      $(document).ready(function () {
        // Convert CSV to JSON object
        var csvArray = csvToArray(csvStr);
        var labels = csvArray[0];
        var contents = csvArray.slice(1, csvArray.length)
        var csvObjects = [];
        contents.forEach(function (data) {
          var obj = {};
          for (let i = 0; i < labels.length; i++) {
            obj[labels[i]] = data[i]
          }
          csvObjects.push(obj);
        });

        facilities = csvObjects;
        // window.facilities = facilities; // DEBUG!!
        draw();
      });

    }
  });

  // convert csv into array
  function csvToArray(csvStr) {
    var csvArray = csvStr
      .split(/\r?\n/)
      .filter(function (line) { return line !== ""; })
      .map(function (line) { return line.split(","); });
    return csvArray;
  }


  // --- show google map ---

  var googleMarkerFilter = function(facility) {
    // For search purpose
    return true;
  }

  function draw() {
    var map = initMap();
    facilities
      .filter(googleMarkerFilter)
      .forEach(function (facility) {
        var marker = pointMarker(map, facility.lat, facility.lng);
        attachMessage(marker, contentToString(facility));
      });
  };

  // init google map
  function initMap() {
    return new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: new google.maps.LatLng(36.643122, 138.188643),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  // point google marker
  function pointMarker(map, lat, lng) {
    return new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: map
    });
  }

  // show a content on google map marker if a marker clicked
  function attachMessage(googleMarker, content) {
    google.maps.event.addListener(googleMarker, "click", function(event) {
      // hide all info windows
      for (let i = 0; i < facilityInfoWindows.length; i++) {
        facilityInfoWindows[i].close();
      }
      facilityInfoWindows = [];

      // attach and open info window
      var infoWindow = new google.maps.InfoWindow({content: content})
      infoWindow.open(googleMarker.getMap(), googleMarker);

      facilityInfoWindows.push(infoWindow);
    });
  };

  function contentToString(facility) {
    var string = 
      facility.name + "<br>\n" +
      "Tel：" + facility.tel + "<br>\n" +
      "定員：" + facility.capacity + "<br>\n" +
      "受け入れ年齢：" + facility.min_age + "<br>"
    return string;
  }
}());
