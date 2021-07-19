$(document).ready(function () {
    var $element1 = $('#dot1');
    var $element2 = $("#dot2");
    // var $element3 = $("#dot3");
    // var $element4 = $("#dot4");

    function fadeInOut() {
        $element1.fadeIn('fast', function () {
            $element1.delay(3000).fadeOut('slow', function () {
                $element1.fadeIn('fast', function () {
                    setTimeout(fadeInOut, 5);
                });
            });
        });

        $element2.fadeIn('fast', function () {
            $element2.delay(2950).fadeOut('slow', function () {
                $element2.fadeIn('fast', function () {
                });
            });
        });


    };

    fadeInOut();

    /* Progress Bar Animation */
    $(".progress-bar").animate({
        width: "100%"
    }, 1);
});
