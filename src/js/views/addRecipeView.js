import View from './view.js';

import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');

  _overlay = document.querySelector('.overlay');

  _buttonOpen = document.querySelector('.nav__btn--add-recipe');

  _buttonClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); //enables the use of this keyword in the constructor function

    this._addHandlerShowWindow();

    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');

    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._buttonOpen.addEventListener('click', this.toggleWindow.bind(this));
  } //this keyword inside of a handler function points to the element on which that listener is attached to.
  //this keyword is manually set to the current object using bind()

  _addHandlerHideWindow() {
    this._buttonClose.addEventListener('click', this.toggleWindow.bind(this));

    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  } //this keyword inside of a handler function points to the element on which that listener is attached to.
  //this keyword is manually set to the current object using bind()

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();

      const formDataArray = [...new FormData(this)]; //this keyword inside of a handler function points to the element
      // ...on which that listener is attached to.

      const data = Object.fromEntries(formDataArray); //convert array of entries into an object

      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
