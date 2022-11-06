const recipeContainer = document.querySelector('.recipe');
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
const recipe = async function() {
    try {
        const res = await fetch(// 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
        'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        let { recipe: recipe1  } = data.data;
        recipe1 = {
            id: recipe1.id,
            title: recipe1.title,
            publisher: recipe1.publisher,
            sourceUrl: recipe1.source_url,
            image: recipe1.image_url,
            servings: recipe1.servings,
            cookingTime: recipe1.cooking_time,
            ingredients: recipe1.ingredients
        };
        console.log(recipe1);
        const markup = `
            <figure class="recipe__fig">
                  <img src="${recipe1.image}" alt="${recipe1.title}" class="recipe__img" />
                  <h1 class="recipe__title">
                    <span>${recipe1.title}</span>
                  </h1>
                </figure>

                <div class="recipe__details">
                  <div class="recipe__info">
                    <svg class="recipe__info-icon">
                      <use href="src/img/icons.svg#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe1.cookingTime}</span>
                    <span class="recipe__info-text">minutes</span>
                  </div>
                  <div class="recipe__info">
                    <svg class="recipe__info-icon">
                      <use href="src/img/icons.svg#icon-users"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe1.servings}</span>
                    <span class="recipe__info-text">servings</span>

                    <div class="recipe__info-buttons">
                      <button class="btn--tiny btn--increase-servings">
                        <svg>
                          <use href="src/img/icons.svg#icon-minus-circle"></use>
                        </svg>
                      </button>
                      <button class="btn--tiny btn--increase-servings">
                        <svg>
                          <use href="src/img/icons.svg#icon-plus-circle"></use>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="recipe__user-generated">
                    <svg>
                      <use href="src/img/icons.svg#icon-user"></use>
                    </svg>
                  </div>
                  <button class="btn--round">
                    <svg class="">
                      <use href="src/img/icons.svg#icon-bookmark-fill"></use>
                    </svg>
                  </button>
                </div>

                <div class="recipe__ingredients">
                  <h2 class="heading--2">Recipe ingredients</h2>
                  <ul class="recipe__ingredient-list">
                  ${recipe1.ingredients.map((ing)=>{
            return `
                    <li class="recipe__ingredient">
                      <svg class="recipe__icon">
                        <use href="src/img/icons.svg#icon-check"></use>
                      </svg>
                      <div class="recipe__quantity">${ing.quantity}</div>
                      <div class="recipe__description">
                        <span class="recipe__unit">${ing.unit}</span>
                        ${ing.description}
                      </div>
                    </li>`;
        }).join('')}
                    
                  </ul>
                </div>

                <div class="recipe__directions">
                  <h2 class="heading--2">How to cook it</h2>
                  <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">${recipe1.publisher}</span>. Please check out
                    directions at their website.
                  </p>
                  <a
                    class="btn--small recipe__btn"
                    href="${recipe1.sourceUrl}"
                    target="_blank"
                  >
                    <span>Directions</span>
                    <svg class="search__icon">
                      <use href="src/img/icons.svg#icon-arrow-right"></use>
                    </svg>
                  </a>
                </div>
    `;
        recipeContainer.innerHTML = '';
        recipeContainer.insertAdjacentHTML('afterbegin', markup);
    } catch (e) {
        alert(e);
    }
};
recipe();

//# sourceMappingURL=index.62406edb.js.map
