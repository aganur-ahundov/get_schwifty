jQuery(document).ready(function ($) {
    $headerHelper.Init();
    $dynamicPage.Init();

    var homepageRevealObjects = ['#first', '#second', '#third', '#start'];
    $dynamicPage.RegisterRevealObjects(homepageRevealObjects);

    var autoTyped = false;
    $(window).on('scroll', function () {
        if (!autoTyped && $dynamicPage.isOnScreen('.artist')) {
            $dynamicPage.ScrollPageTo('.artist');
            $dynamicPage.AutoType('.typewriter', 150, 1200);
            autoTyped = true;
        }
    });

    $(window).on('resize', function () {
        headerHeight = mainHeader.height();
    });
});