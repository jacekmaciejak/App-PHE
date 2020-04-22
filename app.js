//BUDGET CONTROLLER
const budgetController = (function () {
  //Constructor-object,
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };
})();

//UI CONTROLLER
const UIController = (function () {
  //Object to keep in one place all classes/strings
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
  };

  return {
    getInput: function () {
      return {
        //return an object, everything below
        type: document.querySelector(DOMstrings.inputType).value, //take value of input +(inc) or -(exp)
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    //Exposing DOMstrings object the PUBLIC section.
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

//GLOBAL APP CONTROLLER
const controller = (function (budgetController, UIController) {
  const setupEventListeners = function () {
    const DOM = UIController.getDOMstrings(); //Access to the DOMstrings object
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    //Global function, confirm input field when press "enter" button
    document.addEventListener("keypress", function (event) {
      //event.which is the same as event.keyCode - support for all browsers
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  //Get value from input
  const ctrlAddItem = function () {
    //1. Get the field input data
    const input = UIController.getInput();

    //2. Add the item to the budget controller
    //3. Add the item to the UI
    //4. Calculate the budget
    //5. Display the budget on the UI
  };

  //All functions that wa want executed at the beginning
  return {
    init: function () {
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
