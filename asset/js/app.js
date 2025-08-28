console.log("JS Loaded..!");

function callApi(endpoint) {
  return fetch(`https://www.themealdb.com/api/json/v1/1/${endpoint}`)
    .then(res => res.json());
}


document.getElementById("searchBtn").addEventListener("click", searchMealName);

document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMealName();
});

document.getElementById("ingredientInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchByIngredient();
});


async function mainFunction(endpoint) {
  const data = await callApi(endpoint);
  const meals = data.meals;
  const container = document.getElementById("grid");

  container.innerHTML = "";
  if (!meals) {
    container.innerHTML = "<p class='text-center'>No meals found.</p>";
    return;
  }

  meals.forEach(meal => {
    const col = document.createElement("div");
    col.className = "col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="text-muted">${meal.strArea || ""} • ${meal.strCategory || ""}</p>
          ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="btn btn-danger btn-sm">YouTube</a>` : ""}
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}


// ================== RANDOM GALLERY ==================
async function loadGallery() {
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await res.json();
      const meal = data.meals[0];

      const imgEl = document.getElementById("imgnew" + i);
      if (imgEl) {
        imgEl.src = meal.strMealThumb;
        imgEl.alt = meal.strMeal;
      }

      const nameEl = document.getElementById("nameMeal" + i);
      if (nameEl) {
        nameEl.innerText = meal.strMeal;
      }
    } catch (err) {
      console.error("Gallery load error:", err);
    }
  }
}



function searchMealName() {
  const meal = document.getElementById("searchInput").value.trim();
  if (!meal) return;
  mainFunction("search.php?s=" + meal);
}

function searchByIngredient() {
  const ing = document.getElementById("ingredientInput").value.trim();
  if (!ing) return;
  mainFunction("filter.php?i=" + ing);
}

function searchRandom() {
  mainFunction("random.php");
}


// ================== CATEGORIES & AREAS ==================
async function browseCategories() {
  const data = await callApi("list.php?c=list");
  const dropdown = document.getElementById("categorySelect");

  dropdown.innerHTML = "<option>Category</option>";
  data.meals.forEach(cat => {
    let opt = document.createElement("option");
    opt.value = cat.strCategory;
    opt.innerText = cat.strCategory;
    dropdown.appendChild(opt);
  });
}
browseCategories();

async function browseArea() {
  const data = await callApi("list.php?a=list");
  const dropdown = document.getElementById("areaSelect");

  dropdown.innerHTML = "<option>Area</option>";
  data.meals.forEach(area => {
    let opt = document.createElement("option");
    opt.value = area.strArea;
    opt.innerText = area.strArea;
    dropdown.appendChild(opt);
  });
}
browseArea();

// ================== DROPDOWN FILTERS ==================
document.getElementById("categorySelect").addEventListener("change", function () {
  mainFunction("filter.php?c=" + this.value);
});

document.getElementById("areaSelect").addEventListener("change", function () {
  mainFunction("filter.php?a=" + this.value);
});

// ================== RANDOM BTN ==================
document.getElementById("randomBtn").addEventListener("click", searchRandom);

// ================== CLEAR FILTERS ==================
document.getElementById("clearFilters").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  document.getElementById("ingredientInput").value = "";
  document.getElementById("categorySelect").value = "Category";
  document.getElementById("areaSelect").value = "Area";
  document.getElementById("grid").innerHTML = "";
});

loadGallery();