/**
 * smoothScrollTo — scrolls to a DOM section by id.
 *
 * @param {string} id     - The target element's id attribute
 * @param {number} offset - Pixels to subtract from offsetTop (for fixed header). Default: 80
 */
export const smoothScrollTo = (id, offset = 80) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: 'smooth',
    });
  }
};
