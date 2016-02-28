'use strict';

// --- parse csv ---
var facilities = [];

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "data/child-facilities.csv",
        dataType: "text",
        success: function(csvStr) {
            var csvArray   = csvToArray(csvStr);
            var labels     = _.first(csvArray);
            var contents   = _.rest(csvArray);
            var csvObjects = [];

            contents.forEach(function (data) {
                csvObjects.push(_.object(labels, data));
            });

            facilities = csvObjects;
        }
     });
});

function csvToArray(csvStr) {
    var csvArray = csvStr
        .split(/\r\n|\n/)
        .filter(function (line) {
            return line !== "";
        })
        .map(function (line) {
            return line.split(',');
        });
    return csvArray;
}

// --- show google map ---

var picker = function(value, key) {
    return true;
}

$(window).load(function () {
    var map = initMap();
    _.chain(facilities)
        .pick(picker)
        .each(function (facility) {
            var latlng = new google.maps.LatLng(facility.lat, facility.lng);
            var marker = pointMarker(map, latlng);
            attachMessage(marker, contentToString(facility));
        });
});

function initMap() {
    return new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: new google.maps.LatLng(36.651289, 138.181224),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}

function pointMarker(map, latlng) {
    return new google.maps.Marker({
        position: latlng, // new google.maps.LatLng(float, float),
        map: map
    });
}

// show a content on google map marker if a marker clicked
function attachMessage(googleMarker, content) {
    google.maps.event.addListener(googleMarker, 'click', function(event) {
        var infoWindow = new google.maps.InfoWindow({
            content: content
        })
        infoWindow.open(googleMarker.getMap(), googleMarker);
    });
};

var config = {
    "name": "",
    "address": "",
    "tel": "Tel：",
    "capacity": "定員：",
    "min_age": "受け入れ年齢：",
};

function contentToString(facility) {
    var string = _.chain(facility)
        .pick(function (value, key) {
            return key in config;
        })
        .omit(function (value, key) {
            return value === "";
        })
        .map(function (value, key) {
            return "" + config[key] + value;
        })
        .value()
        .join("<br>\n");
    return string;
}
