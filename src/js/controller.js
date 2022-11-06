import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

//importing these 2 packages so that old browsers can also run this application
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept(); // coming form parcel
}
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //load recipe....... Now as model.loadRecipe is an async function and returns a promise, therefore we await it
    await model.loadRecipe(id);

    //render recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    recipeView.renderError();
    console.log(e);
  }
};

const controllerSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) load the search results
    await model.loadSearchResults(query);

    //3) render results
    resultsView.render(model.getSearchResultsPage());

    //4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings state
  model.updateServings(newServings);
  //update the recipe  view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    //render success message
    addRecipeView.renderMessage();

    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL to the recipe created
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controllerSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  // controlServings();
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
