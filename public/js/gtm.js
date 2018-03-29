$(document).ready(function() {
    window.dataLayer = window.dataLayer || [];

    $(document).on('gtm', function(e, pushObject) {
        window.dataLayer.push(pushObject);
    })
});