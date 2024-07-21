// DOM Elements
const recipeForm = document.getElementById('recipe-form');
const titleInput = document.getElementById('title');
const ingredientsInput = document.getElementById('ingredients');
const instructionsInput = document.getElementById('instructions');
const featuredRecipeCards = document.getElementById('featured-recipe-cards');
const clearRecipesBtn = document.getElementById('clear-recipes-btn');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event Listeners
window.addEventListener('DOMContentLoaded', displayRecipes);
recipeForm.addEventListener('submit', addRecipe);
clearRecipesBtn.addEventListener('click', clearSavedRecipes);
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        getMealList(searchTerm);
    }
});
mealList.addEventListener('click', (e) => {
    if (e.target.classList.contains('recipe-btn')) {
        const mealItem = e.target.parentElement.parentElement;
        fetchMealById(mealItem.dataset.id);
    }
});
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
    mealDetailsContent.innerHTML = ''; // Clear the meal details content
});

// Functions
function displayRecipes() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    featuredRecipeCards.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong><br>${recipe.ingredients}</p>
            <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
        `;
        featuredRecipeCards.appendChild(card);
    });
}

function addRecipe(e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    const ingredients = ingredientsInput.value.trim();
    const instructions = instructionsInput.value.trim();

    if (title && ingredients && instructions) {
        const newRecipe = {
            title,
            ingredients,
            instructions
        };

        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));

        addFeaturedRecipe(newRecipe);

        titleInput.value = '';
        ingredientsInput.value = '';
        instructionsInput.value = '';
    } else {
        alert('Please fill in all fields');
    }
}

function addFeaturedRecipe(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
        <h3>${recipe.title}</h3>
        <p><strong>Ingredients:</strong><br>${recipe.ingredients}</p>
        <p><strong>Instructions:</strong><br>${recipe.instructions}</p>
    `;
    featuredRecipeCards.appendChild(card);
}

function clearSavedRecipes() {
    localStorage.removeItem('recipes');
    featuredRecipeCards.innerHTML = '';
}

async function getMealList(searchTerm) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();

        if (data.meals) {
            displayMealList(data.meals);
        } else {
            mealList.innerHTML = '';
            const html = `<p>No recipes found for '${searchTerm}'</p>`;
            mealList.innerHTML = html;
        }
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
}

function displayMealList(meals) {
    let html = '';
    meals.forEach(meal => {
        html += `
            <div class="meal-item" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
            </div>
        `;
    });
    mealList.innerHTML = html;
}

async function fetchMealById(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        displayMealDetails(data.meals[0]);
    } catch (error) {
        console.error('Error fetching meal by ID:', error);
    }
}

function displayMealDetails(meal) {
    const html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        <button id="clear-details-btn">Clear Recipe Details</button>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');

    // Add event listener for the clear details button
    const clearDetailsBtn = document.getElementById('clear-details-btn');
    clearDetailsBtn.addEventListener('click', () => {
        mealDetailsContent.innerHTML = ''; // Clear the meal details content
        mealDetailsContent.parentElement.classList.remove('showRecipe');
    });

    // Add close button after displaying recipe details
    mealDetailsContent.insertAdjacentHTML('beforeend', '<button id="close-details-btn">Close Recipe</button>');
    const closeDetailsBtn = document.getElementById('close-details-btn');
    closeDetailsBtn.addEventListener('click', () => {
        mealDetailsContent.innerHTML = ''; // Clear the meal details content
        mealDetailsContent.parentElement.classList.remove('showRecipe');
    });
}
