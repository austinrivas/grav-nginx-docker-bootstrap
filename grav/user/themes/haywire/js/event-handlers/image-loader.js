export default class ImageLoader {
    constructor() {
        // NodeList polyfill for IE, still doing this in 2018
        (function () {
            if ( typeof NodeList.prototype.forEach === "function" ) return false;
            NodeList.prototype.forEach = Array.prototype.forEach;
        })();
        document.querySelectorAll('img').forEach((element) => {
            element.addEventListener('load', () => {
                element.classList.add('loaded');
            });
        });
    }
}
