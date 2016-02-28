'use strict';

$(document).ready(function() {
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

            csvObjects.forEach(function (object) {
                $('.result').append(
                    '<div>' +
                        object.name + ' ' +
                        object.category + ' ' +
                        object.address_main + ' ' +
                        object.tel + ' ' +
                        object.age + ' ' +
                        object.lat + ' ' +
                        object.long + ' ' +
                        object.open + ' ' +
                        object.holiday +
                        '<br>' +
                    '</div>'
                );
            });
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
