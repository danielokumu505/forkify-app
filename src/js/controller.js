import * as model from './model.js'; //imports all functions and const from model.js module
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'regenerator-runtime/runtime'; //for poyfiling async await
import 'core-js/stable'; //for polyfiling everything else

////////////////////////////////////////////////

// if (module.hot) {
// module.hot.accept();
// } //retain state after page reloads, enables the hot module replacement,
//  which reloads the modules that changed without refreshing the whole website. from parcel

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) {
      return;
    } //guard clause if the id is not available

    recipeView.renderSpinner();

    //0)Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2. Loading recipe
    await model.loadRecipe(id); //loadRecipe is an asynchronous function that returns a promise that should
    //... be handled using await

    // // const recipe = model.state.recipe;
    // const { recipe } = model.state; //refer to destructuring

    //3. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);

    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) Get search query
    const query = searchView.getQuery();

    if (!query) {
      return;
    } //guard clause if there is no query

    //2) Load search results
    await model.loadSearchResults(query);

    //3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goToPage) {
  console.log(`go to page ${goToPage}`);

  //3) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  console.log(model.state.search.results);

  //4) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in the state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1)Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2)Update recipe view
  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //allows changing of url without loading
    //...the page

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(`form error : ${error}`);

    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); //publisher subscriber pattern
  recipeView.addHandlerRender(controlRecipes); //publisher subscriber pattern
  recipeView.addHandlerUpdateServings(controlServings); //publisher subscriber pattern
  recipeView.addHandlerAddBookmark(controlAddBookmark); //publisher subscriber pattern
  searchView.addHandlerSearch(controlSearchResults); //publisher subscriber pattern
  paginationView.addHandlerClick(controlPagination); //publisher subscriber pattern
  addRecipeView.addHandlerUpload(controlAddRecipe); // ps pattern
};

init();
