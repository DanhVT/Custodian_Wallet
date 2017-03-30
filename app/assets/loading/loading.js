(function(window, $, undefined) {
    "use strict";

    var $loadingElements = $(".loading-animation"),
        alreadyShow = false;

    function showLoadingAnimation(inner) {
        if (inner == undefined) {
            if ($loadingElements.length > 0 && alreadyShow) {
                alreadyShow = false;
                $loadingElements.show();
            }
        } else {
            $(".loading-animation-in").css({ 'display': 'flex' });
        }
    }

    function hideLoadingAnimation(callback) {

        $(".loading-animation-in").hide();
        if ($loadingElements.length > 0 && !alreadyShow) {
            $loadingElements.fadeOut({
                duration: 500,
                complete: function() {
                    if (callback && typeof callback === "function") {
                        callback();
                    }
                }
            });
            alreadyShow = true;
        } else {
            if (callback && typeof callback === "function") {
                callback();
            }
        }
    }

    window.showLoadingAnimation = showLoadingAnimation;
    window.hideLoadingAnimation = hideLoadingAnimation;

})(window, window.$);