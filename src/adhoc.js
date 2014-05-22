(function (window) {
    if (window.adhoc) {
        throw new Error("adhoc.js: `window.adhoc` is already defined");
    } else {
        window.adhoc = {};
    }
})(window);