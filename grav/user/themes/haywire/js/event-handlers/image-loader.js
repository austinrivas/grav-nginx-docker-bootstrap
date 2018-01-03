export default class ImageLoader {
    constructor() {
        document.querySelectorAll('img').forEach((element) => {
            element.addEventListener('load', () => {
                element.classList.add('loaded');
            });
        });
    }
}
