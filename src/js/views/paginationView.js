import View from './view.js';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (event) {
      //   event.preventDefault();not necessary ,page does not load on click events

      const button = event.target.closest('.btn--inline'); //looks up the DOM tree for the closest
      //...ancestor element(parent element) or the element itself..Note..useful feature for nested elements
      //  inside target element

      if (!button) {
        return;
      } //guard clause if user clicks outside the button,,ie button=null

      const goToPage = +button.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    console.log(numPages, currentPage);

    //Page 1 and there are other pages

    if (currentPage === 1 && numPages > 1) {
      return `
          <button data-goto ='${
            currentPage + 1
          }' class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    //Last page

    if (currentPage === numPages && numPages > 1) {
      return ` <button data-goto ='${
        currentPage - 1
      }' class="btn--inline pagination__btn--prev">
                 <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                 </svg>
                <span>Page ${currentPage - 1}</span>
               </button>
                `;
    }

    //Other page

    if (currentPage < numPages && currentPage !== 1) {
      return ` <button data-goto ='${
        currentPage - 1
      }' class="btn--inline pagination__btn--prev">
                 <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                 </svg>
                <span>Page ${currentPage - 1}</span>
               </button> 
               <button data-goto ='${
                 currentPage + 1
               }' class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                  <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                  </svg>
               </button>   `;
    }

    //Page 1 and there are no other pages
    return '';
  }
}

export default new PaginationView();
