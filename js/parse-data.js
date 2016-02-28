'use strict';

(function () {
    // --- parse csv ---
    
    window.facilities = [];

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

                window.facilities = csvObjects;
            }
         });
    });

    // convert csv into array
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
}());
