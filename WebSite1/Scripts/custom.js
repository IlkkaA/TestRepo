﻿$(document).ready(function () {
    console.log("ready!");

    /////////////////////////////////////////////////////
    //gradentify
    // target to give background to
    var $div = document.getElementById("gradentify");
    // rgb vals of the gradients
    var gradients = [
      { start: [128, 179, 171], stop: [30, 41, 58] },
      { start: [255, 207, 160], stop: [234, 92, 68] },
      { start: [212, 121, 121], stop: [130, 105, 151] }
    ];
    // how long for each transition
    var transition_time = 8;
    // how many frames per second
    var fps = 60;


    // interal type vars
    var timer; // for the setInterval
    var interval_time = Math.round(1000 / fps); // how often to interval
    var currentIndex = 0; // where we are in the gradients array
    var nextIndex = 1; // what index of the gradients array is next
    var steps_count = 0; // steps counter
    var steps_total = Math.round(transition_time * fps); // total amount of steps
    var rgb_steps = {
        start: [0, 0, 0],
        stop: [0, 0, 0]
    }; // how much to alter each rgb value
    var rgb_values = {
        start: [0, 0, 0],
        stop: [0, 0, 0]
    }; // the current rgb values, gets altered by rgb steps on each interval
    var prefixes = ["-webkit-", "-moz-", "-o-", "-ms-", ""]; // for looping through adding styles
    var div_style = $div.style; // short cut to actually adding styles
    var gradients_tested = false;
    var color1, color2;

    // sets next current and next index of gradients array
    function set_next(num) {
        return (num + 1 < gradients.length) ? num + 1 : 0;
    }

    // work out how big each rgb step is
    function calc_step_size(a, b) {
        return (a - b) / steps_total;
    }

    // populate the rgb_values and rgb_steps objects
    function calc_steps() {
        for (var key in rgb_values) {
            if (rgb_values.hasOwnProperty(key)) {
                for (var i = 0; i < 3; i++) {
                    rgb_values[key][i] = gradients[currentIndex][key][i];
                    rgb_steps[key][i] = calc_step_size(gradients[nextIndex][key][i], rgb_values[key][i]);
                }
            }
        }
    }

    // update current rgb vals, update DOM element with new CSS background
    function updateGradient() {
        // update the current rgb vals
        for (var key in rgb_values) {
            if (rgb_values.hasOwnProperty(key)) {
                for (var i = 0; i < 3; i++) {
                    rgb_values[key][i] += rgb_steps[key][i];
                }
            }
        }

        // generate CSS rgb values
        var t_color1 = "rgb(" + (rgb_values.start[0] | 0) + "," + (rgb_values.start[1] | 0) + "," + (rgb_values.start[2] | 0) + ")";
        var t_color2 = "rgb(" + (rgb_values.stop[0] | 0) + "," + (rgb_values.stop[1] | 0) + "," + (rgb_values.stop[2] | 0) + ")";

        // has anything changed on this interation
        if (t_color1 != color1 || t_color2 != color2) {

            // update cols strings
            color1 = t_color1;
            color2 = t_color2;

            // update DOM element style attribute
            div_style.backgroundImage = "-webkit-gradient(linear, left bottom, right top, from(" + color1 + "), to(" + color2 + "))";
            for (var i = 0; i < 4; i++) {
                div_style.backgroundImage = prefixes[i] + "linear-gradient(45deg, " + color1 + ", " + color2 + ")";
            }
        }

        // test if the browser can do CSS gradients
        if (div_style.backgroundImage.indexOf("gradient") == -1 && !gradients_tested) {
            // if not, kill the timer
            clearTimeout(timer);
        }
        gradients_tested = true;

        // we did another step
        steps_count++;
        // did we do too many steps?
        if (steps_count > steps_total) {
            // reset steps count
            steps_count = 0;
            // set new indexs
            currentIndex = set_next(currentIndex);
            nextIndex = set_next(nextIndex);
            // calc steps
            calc_steps();
        }
    }

    // initial step calc
    calc_steps();

    // go go go!
    timer = setInterval(updateGradient, interval_time);


    ///////////////////////////////////////////////////
    // chart.js
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [8, 6, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    }); // chart scripts end

}); // document-ready function ends