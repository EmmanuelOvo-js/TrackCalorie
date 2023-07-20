class CalorieTracker {
	constructor() {
		this._caloriesLimit = Storage.getCalorieLimit();
		this._totalCalories = Storage.getTotalCalories(0);
		this._meals = Storage.getMeals(); //array
		this._workouts = Storage.getWorkouts(); //array

		this._displayCaloriesLimit();
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemaining();
		this._displayCaloriesProgress();
	}

	//Public Methods / API
	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		Storage.setTotalCalories(this._totalCalories);
		Storage.saveMeal(meal);
		this._displayNewMeal(meal);

		this._render();
	}
	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		Storage.setTotalCalories(this._totalCalories);
		Storage.saveWorkout(workout);
		this._displayNewWorkout(workout);

		this._render();
	}

	removeMeal(id) {
		//if findindex does not match it returns -1
		const index = this._meals.findIndex((meal) => meal.id === id);
		//here we check if findindex does not match
		if (index !== -1) {
			const meal = this._meals[index];
			this._totalCalories -= meal.calories;
			Storage.setTotalCalories(this._totalCalories);
			this._meals.splice(index, 1);
			Storage.removeMealFromStorage(id);
			this._render();
		}
	}
	removeWorkout(id) {
		//if findindex does not match it returns -1
		const index = this._workouts.findIndex((workout) => workout.id === id);
		//here we check if findindex does not match
		if (index !== -1) {
			const workout = this._workouts[index];
			this._totalCalories += workout.calories;
			Storage.setTotalCalories(this._totalCalories);
			this._workouts.splice(index, 1);
			Storage.removeWorkoutFromStorage(id);
			this._render();
		}
	}

	reset() {
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
		Storage.clearAll();
		this._render();
	}

	setLimit(calorieLimit) {
		this._caloriesLimit = calorieLimit;
		Storage.setCalorieLimit(calorieLimit);
		this._displayCaloriesLimit();
		//show calorie limit value in form field
		document.getElementById("limit").value = this._caloriesLimit;
		this._displaySetlimitPlaceholder();
		this._render();
	}

	//To load meals and workout data on the dom
	loadItems() {
		this._meals.forEach((meal) => this._displayNewMeal(meal));
		this._workouts.forEach((workout) => this._displayNewWorkout(workout));
	}

	//Private Methods
	_displayCaloriesTotal() {
		const totalCaloriesEl = document.getElementById("calories-total");
		totalCaloriesEl.innerHTML = this._totalCalories;
	}

	_displayCaloriesLimit() {
		const CaloriesLimitEl = document.getElementById("calories-limit");
		CaloriesLimitEl.innerHTML = this._caloriesLimit;
	}

	_displayCaloriesConsumed() {
		const caloriesConsumedEl = document.getElementById("calories-consumed");

		const consumed = this._meals.reduce(
			(total, meal) => total + meal.calories,
			0
		);

		//push to DOM
		caloriesConsumedEl.innerHTML = consumed;
	}

	_displayCaloriesBurned() {
		const caloriesBurnedEl = document.getElementById("calories-burned");

		const burned = this._workouts.reduce(
			(total, workout) => total + workout.calories,
			0
		);

		//push to DOM
		caloriesBurnedEl.innerHTML = burned;
	}

	_displayCaloriesRemaining() {
		const caloriesRemainingEl = document.getElementById("calories-remaining");
		const progressEl = document.getElementById("calorie-progress");
		const remaining = this._caloriesLimit - this._totalCalories;

		caloriesRemainingEl.innerHTML = remaining;

		if (remaining <= 0) {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				"bg-light"
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add(
				"bg-danger"
			);
			progressEl.classList.add("bg-danger");
			progressEl.classList.remove("bg-success");
		} else {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				"bg-danger"
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
			progressEl.classList.remove("bg-danger");
			progressEl.classList.add("bg-success");
		}
	}

	_displayCaloriesProgress() {
		const progressEl = document.getElementById("calorie-progress");
		const percentage = (this._totalCalories / this._caloriesLimit) * 100;
		const width = Math.min(percentage, 100);
		progressEl.style.width = `${width}%`;
	}

	_displayNewMeal(meal) {
		const mealsEl = document.getElementById("meal-items");
		const mealEl = document.createElement("div");
		mealEl.classList.add("card", "my-2");
		mealEl.setAttribute("data-id", meal.id);
		mealEl.innerHTML = `
		<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
		`;

		mealsEl.appendChild(mealEl);
	}

	_displayNewWorkout(workout) {
		const workoutsEl = document.getElementById("workout-items");
		const workoutEl = document.createElement("div");
		workoutEl.classList.add("card", "my-2");
		workoutEl.setAttribute("data-id", workout.id);
		workoutEl.innerHTML = `
		<div class="card-body">
			<div class="d-flex align-items-center justify-content-between">
				<h4 class="mx-1">${workout.name}</h4>
				<div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">${workout.calories}</div>
				<button class="delete btn btn-danger btn-sm mx-2">
				<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
        </div>
		`;

		workoutsEl.appendChild(workoutEl);
	}

	//Emmanuel added and update this method
	_displaySetlimitPlaceholder() {
		const input = document.getElementById("limit");
		input.setAttribute("placeholder", this._caloriesLimit);
		//console.log(input);
	}

	_render() {
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemaining();
		this._displayCaloriesProgress();
	}
}
// End of class CaloriesTracker

class Meal {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = calories;
	}
}
// End of class Meal

class Workout {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = calories;
	}
}
// End of class Workout

//Local Storage class
class Storage {
	//get and set calorie limit data to storage
	static getCalorieLimit(defaultLimit = 2000) {
		let calorieLimit;
		if (localStorage.getItem("calorieLimit") === null) {
			calorieLimit = defaultLimit;
		} else {
			calorieLimit = +localStorage.getItem("calorieLimit");
		}

		return calorieLimit;
	}

	static setCalorieLimit(calorieLimit) {
		localStorage.setItem("calorieLimit", calorieLimit);
	}

	//get and set total calories data to storage
	static getTotalCalories(defaultTotalCalories) {
		let totalCalorie;
		if (localStorage.getItem("totalCalories") === null) {
			totalCalorie = defaultTotalCalories;
		} else {
			totalCalorie = +localStorage.getItem("totalCalories");
		}

		return totalCalorie;
	}
	static setTotalCalories(totalCalories) {
		localStorage.setItem("totalCalories", totalCalories);
	}

	//To save meals form data to local storage
	static getMeals() {
		let meals;
		if (localStorage.getItem("meals") === null) {
			meals = [];
		} else {
			meals = JSON.parse(localStorage.getItem("meals"));
		}

		return meals;
	}

	static saveMeal(meal) {
		const meals = Storage.getMeals();
		meals.push(meal);
		localStorage.setItem("meals", JSON.stringify(meals));
	}

	//To save workouts form data to local storage
	static getWorkouts() {
		let workouts;
		if (localStorage.getItem("workouts") === null) {
			workouts = [];
		} else {
			workouts = JSON.parse(localStorage.getItem("workouts"));
		}

		return workouts;
	}

	static saveWorkout(workout) {
		const workouts = Storage.getWorkouts();
		workouts.push(workout);
		localStorage.setItem("workouts", JSON.stringify(workouts));
	}

	//Remove meals array data from local storage when one clicks on the delete icon
	static removeMealFromStorage(id) {
		const meals = Storage.getMeals();
		meals.forEach((meal, index) => {
			if (meal.id === id) {
				meals.splice(index, 1);
			}
		});
		//Then set meals array to the current array that was deleted from
		localStorage.setItem("meals", JSON.stringify(meals));
	}

	//Remove Workouts array data from local storage when one clicks on the delete icon
	static removeWorkoutFromStorage(id) {
		const workouts = Storage.getWorkouts();
		workouts.forEach((workout, index) => {
			if (workout.id === id) {
				workouts.splice(index, 1);
			}
		});
		//Then set workouts array to the current array that was deleted from
		localStorage.setItem("workouts", JSON.stringify(workouts));
	}
	static clearAll() {
		localStorage.removeItem('totalCalories')
		localStorage.removeItem('workouts')
		localStorage.removeItem('meals')

		//To clear all from storage
		//localStorage.clear();
	}
}
// End of Storage class

class App {
	constructor() {
		this._tracker = new CalorieTracker();
		this._loadEventListeners();
		this._tracker.loadItems();
	}

	_loadEventListeners() {
		//Add new item with form events
		document
			.getElementById("meal-form")
			.addEventListener("submit", this._newItem.bind(this, "meal")); //takes in the event and the type
		document
			.getElementById("workout-form")
			.addEventListener("submit", this._newItem.bind(this, "workout")); //takes in the event and the type

		//Remove item events
		document
			.getElementById("meal-items")
			.addEventListener("click", this._removeItem.bind(this, "meal"));
		document
			.getElementById("workout-items")
			.addEventListener("click", this._removeItem.bind(this, "workout"));

		//Search filed event
		document
			.getElementById("filter-meals")
			.addEventListener("keyup", this._filterItems.bind(this, "meal"));
		document
			.getElementById("filter-workouts")
			.addEventListener("keyup", this._filterItems.bind(this, "workout"));

		//Reset button event
		document
			.getElementById("reset")
			.addEventListener("click", this._reset.bind(this));

		//Set limit form
		document
			.getElementById("limit-form")
			.addEventListener("submit", this._setLimit.bind(this));
	}

	_newItem(type, e) {
		e.preventDefault();

		const name = document.getElementById(`${type}-name`);
		const calories = document.getElementById(`${type}-calories`);

		//Validate
		if (name.value === "" || calories.value === "") {
			alert("Please fill in all fileds");
			return;
		}

		if (type === "meal") {
			//the + changes the submited string value into an integer
			const meal = new Meal(name.value, +calories.value);
			this._tracker.addMeal(meal);
		} else {
			const workout = new Workout(name.value, +calories.value);
			this._tracker.addWorkout(workout);
		}

		//clear form fileds after submit or reloads
		name.value = "";
		calories.value = "";

		//Adding bootstrap collapse
		const collapse = document.getElementById(`collapse-${type}`);
		const bsCollapse = new bootstrap.Collapse(collapse, {
			toggle: true,
		});
	}

	_removeItem(type, e) {
		if (
			e.target.classList.contains("delete") ||
			e.target.classList.contains("fa-xmark")
		) {
			if (confirm("Are you sure")) {
				const id = e.target.closest(".card").getAttribute("data-id");

				type === "meal"
					? this._tracker.removeMeal(id)
					: this._tracker.removeWorkout(id);

				e.target.closest(".card").remove();
			}
		}
	}

	_filterItems(type, e) {
		const text = e.target.value.toLowerCase();
		document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
			const name = item.firstElementChild.firstElementChild.textContent;

			if (name.toLowerCase().indexOf(text) !== -1) {
				item.style.display = "block";
			} else {
				item.style.display = "none";
			}
		});
	}

	_reset() {
		this._tracker.reset();
		document.getElementById("meal-items").innerHTML = "";
		document.getElementById("workout-items").innerHTML = "";
		document.getElementById("filter-meals").value = "";
		document.getElementById("filter-workouts").value = "";
	}

	_setLimit(e) {
		e.preventDefault();

		//target the input to get value
		const limit = document.getElementById("limit");

		//Validate form
		if (limit.value === "") {
			alert("Please set a limit");
			return;
		}

		this._tracker.setLimit(+limit.value);
		limit.value = "";

		//Hide Bootstrap Modal after submitting form
		const modalEl = document.getElementById("limit-modal");
		const modal = bootstrap.Modal.getInstance(modalEl);
		modal.hide();
	}
}

const app = new App();
