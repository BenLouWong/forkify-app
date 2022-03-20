import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const { compilePseudoSelector } = require('css-select/lib/pseudo-selectors');
const { async } = require('regenerator-runtime');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Keeps the state using parcel - not actual js
if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // loading recipe

    if (!id) return;
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //   1 Get search Query
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultsPage());

    // 4. render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  //   controlServings();
};
init();
