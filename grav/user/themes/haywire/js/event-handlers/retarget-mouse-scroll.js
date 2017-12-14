// Usage
// -----
//
//      RetargetMouseScroll({
//          element             :Node,        // default: document
//          target              :Node/Window, // default: window
//          preventDefault      :Boolean,     // default: true
//          preventRetarget     :Boolean,     // default: null
//          scrollMultiplier    :Number       // default: 1.0
//          verticalScrollOnly  :Boolean, // default: true
//      })
//
// `RetargetMouseScroll` returns an object containing a `restore` method. Calling the method restores the default scrolling.


import _throttle from "lodash/throttle";

const mouseScrollEvents = ["DOMMouseScroll", "mousewheel"];

let handleVerticalScroll = function (target, scrollAmount) {
    if (target.scrollBy) {
        target.scrollBy(0, scrollAmount);
    } else {
        target.scrollTop += scrollAmount;
    }
};

let handleHorizontalScroll = function (target, scrollAmount) {
    if (target.scrollBy) {
        target.scrollBy(scrollAmount, 0);
    } else {
        target.scrollLeft += scrollAmount;
    }
};

let handleScroll = function (evt, target, preventDefault, scrollMultiplier, verticalScrollOnly) {

    if (preventDefault) {
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            event.returnValue = false;
        }
    }

    let scrollAmount = evt.detail || (-evt.wheelDelta / 40); // convert wheelData to lines
    scrollAmount *= 19; // convert lines to pixels

    if (typeof scrollMultiplier === "number" && !isNaN(scrollMultiplier)) {
        scrollAmount *= scrollMultiplier;
    }

    if (verticalScrollOnly) {
        handleVerticalScroll(target, scrollAmount);
    } else if (evt.wheelDeltaX || ("axis" in evt && "HORIZONTAL_AXIS" in evt && evt.axis === evt.HORIZONTAL_AXIS)) {
        handleHorizontalScroll(target, scrollAmount);
    } else {
        handleVerticalScroll(target, scrollAmount);
    }
};

let RetargetMouseScroll = function (options) {

    let elem,
        target,
        preventDefault,
        preventRetarget,
        scrollMultiplier,
        throttleDelay,
        verticalScrollOnly;

    options = options || {};

    if (!options.element) {
        elem = document;
    } else {
        elem = options.element;
    }

    if (!options.target) {
        target = window;
    } else {
        target = options.target;
    }

    if (typeof options.preventDefault !== "boolean") {
        preventDefault = true;
    } else {
        preventDefault = options.preventDefault;
    }

    if (!options.scrollMultiplier) {
        scrollMultiplier = 1.0
    } else {
        scrollMultiplier = options.scrollMultiplier;
    }

    if (typeof options.preventRetarget !== "function") {
        preventRetarget = null;
    } else {
        preventRetarget = options.preventRetarget;
    }

    if (!options.throttleDelay) {
        throttleDelay = options.throttleDelay;
    } else {
        throttleDelay = 300;
    }

    if (!options.verticalScrollOnly) {
        verticalScrollOnly = true;
    } else {
        verticalScrollOnly = options.verticalScrollOnly;
    }

    let addListener, removeListener, restoreFn,
        handler = _throttle(function (evt) {
            evt = evt || window.event;
            if (preventRetarget && preventRetarget.call(this, evt)) return;
            handleScroll(evt, target, preventDefault, scrollMultiplier, verticalScrollOnly);
        }, throttleDelay);

    if (addListener = elem.addEventListener) {
        addListener.call(elem, mouseScrollEvents[0], handler, false);
        addListener.call(elem, mouseScrollEvents[1], handler, false);
    } else if (addListener = elem.attachEvent) {
        addListener.call(elem, "on" + mouseScrollEvents[1], handler);
    }

    if (removeListener = elem.removeEventListener) {
        restoreFn = function () {
            removeListener.call(elem, mouseScrollEvents[0], handler, false);
            removeListener.call(elem, mouseScrollEvents[1], handler, false);
        };
    } else if (removeListener = elem.detachEvent) {
        restoreFn = function () {
            removeListener.call(elem, "on" + mouseScrollEvents[1], handler);
        };
    }

    return {
        restore: restoreFn
    };
};

export default RetargetMouseScroll;
