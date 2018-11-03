$headerHelper = new function () {
    this.header = undefined;
    this.autoHideTime = undefined;
    this.headerHeight = undefined;
    this.previousTop = undefined;
    this.scrolling = undefined;
    this.scrollDelta = undefined;
    this.scrollOffset = undefined;

    this.Init = function () {
        $headerHelper.header = $('header');
        $headerHelper.autoHideTime = 250;

        $headerHelper.scrolling = false;
        $headerHelper.scrollDelta = 10;
        $headerHelper.scrollOffset = 50;

        $(window).on('scroll', function () {
            if (!$headerHelper.scrolling) {
                $headerHelper.scrolling = true;

                (!window.requestAnimationFrame)
                    ? setTimeout($headerHelper.AutoHideHeader, $headerHelper.autoHideTime)
                    : window.requestAnimationFrame($headerHelper.AutoHideHeader);
            }
        });

        $(window).on('resize', function () {
            $headerHelper.headerHeight = $headerHelper.header.height();
        });
    };

    this.HideHeader = function () {
        $headerHelper.header.addClass('is-hidden');
    }

    this.ShowHeader = function () {
        $headerHelper.header.removeClass('is-hidden');
    }

    this.AutoHideHeader = function () {
        var currentTop = $(window).scrollTop();
        $headerHelper.CheckSimpleNavigation(currentTop);

        $headerHelper.previousTop = currentTop;
        $headerHelper.scrolling = false;
    };

    this.CheckSimpleNavigation = function (currentTop) {
        if ($headerHelper.IsScrollUpMoreThanDelta(currentTop)) {
            $headerHelper.ShowHeader();
        }
        else if ($headerHelper.IsScrollDownMoreThanDelta(currentTop)) {
            $headerHelper.HideHeader();
        }
    }

    this.IsScrollUpMoreThanDelta = function (currentTop) {
        return $headerHelper.previousTop - currentTop > $headerHelper.scrollDelta;
    };

    this.IsScrollDownMoreThanDelta = function (currentTop) {
        return (currentTop - $headerHelper.previousTop > $headerHelper.scrollDelta)
            && (currentTop > $headerHelper.scrollOffset);
    }
}