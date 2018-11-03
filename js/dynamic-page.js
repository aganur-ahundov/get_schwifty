$dynamicPage = new function () {
    this.srFactory = undefined;
    this.revealStartDelay = undefined;
    this.animationInterval = undefined;
    this.scrollSpeed = undefined;
    this.scrollInterval = undefined;
    this.scrollEnd = undefined;

    this.Init = function () {
        $dynamicPage.srFactory = ScrollReveal();
        $dynamicPage.revealStartDelay = 1000;

        $dynamicPage.scrollInterval = undefined;
        $dynamicPage.scrollEnd = undefined;

        $dynamicPage.animationInterval = 15; //Scrolling speed. Lower is faster
        $dynamicPage.scrollSpeed = 10; //Scrolling speed. Lower is faster

        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', $dynamicPage.OnMouseScrollHandle, false);
        }
        window.onmousewheel = document.onmousewheel = $dynamicPage.OnMouseScrollHandle;
    }

    this.RegisterRevealObjects = function (selectors, delay = 1200) {
        var startDelay = $dynamicPage.revealStartDelay + delay;

        //First element appears from top
        $dynamicPage.srFactory.reveal(selectors[0], { delay: startDelay, easing: 'ease-in', distance: '40px', origin: 'top' });

        for (var i = 1; i < selectors.length; i++) {
            startDelay += delay;

            var defaultOptions = {
                delay: startDelay,
                easing: 'ease-in'
            };

            $dynamicPage.srFactory.reveal(selectors[i], defaultOptions);
        }
    };

    // Slow page scrolling
    this.OnMouseScrollHandle = function (event) {
        var eventDelta = 0;

        if (event.wheelDelta) {
            eventDelta = event.wheelDelta / 120;
        }
        else if (event.detail) {
            eventDelta = -event.detail / 3;
        }

        $dynamicPage.ScrollWithDelta(eventDelta);

        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    }

    this.ScrollWithDelta = function (delta) {
        if ($dynamicPage.scrollEnd == null) {
            $dynamicPage.scrollEnd = $(window).scrollTop();
        }

        $dynamicPage.scrollEnd -= 20 * delta;

        if ($dynamicPage.scrollInterval == null) {
            $dynamicPage.scrollInterval = setInterval(function () { $dynamicPage.SetScrollingInterval(delta); }, $dynamicPage.animationInterval);
        }
    };

    this.IsScrollingFinished = function (scrollTop, isScrollUp, step) {
        return scrollTop <= 0
            || scrollTop >= $(window).prop("scrollHeight") - $(window).height()
            || isScrollUp && step > -1
            || !isScrollUp && step < 1;
    };

    this.SetScrollingInterval = function (delta) {

        var isScrollUp = delta > 0;
        var scrollTop = $(window).scrollTop();
        var step = Math.round(($dynamicPage.scrollEnd - scrollTop) / $dynamicPage.scrollSpeed);

        if ($dynamicPage.IsScrollingFinished(scrollTop, isScrollUp, step)) {
            clearInterval($dynamicPage.scrollInterval);
            $dynamicPage.scrollInterval = null;
            $dynamicPage.scrollEnd = null;
        }

        $(window).scrollTop(scrollTop + step);
    };

    this.AutoType = function (elementClass, typingSpeed, delay = 1000) {
        var container = $(elementClass);

        container.css({
            "position": "relative",
            "display": "inline-block"
        });

        container.prepend('<div class="cursor" styles="right: initial; left: 0;"></div>');
        container = container.find(".text-js");

        var text = container.text().trim().split('');
        var length = text.length;
        var newString = "";

        container.text("|");
        setTimeout(function () {
            container.css("opacity", 1);
            container.prev().removeAttr("style");
            container.text("");

            for (var i = 0; i < length; i++) {
                (function (i, char) {
                    setTimeout(function () {
                        newString += char;
                        container.text(newString);
                    }, i * typingSpeed);
                })(i + 1, text[i]);
            }

        }, delay);
    }

    this.isOnScreen = function (element) {
        var win = $(window);
        var currentElement = $(element);

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };

        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = currentElement.offset();
        bounds.right = bounds.left + currentElement.outerWidth();
        bounds.bottom = bounds.top + currentElement.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };

    this.ScrollPageTo = function (element, speed = 1500) {
        $('html, body').animate({
            scrollTop: $(element).offset().top
        }, speed);
    }
}