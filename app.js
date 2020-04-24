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

  return {
    //des:description, val:value
    addItem: function (type, des, val) {
      let newItem, ID;
      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      //Push it into our data structure
      data.allItems[type].push(newItem);
      //Return the new element
      return newItem;
    },
    testing: function () {
      console.log(data);
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
    let input, newItem;

    //1. Get the field input data
    input = UIController.getInput();

    //2. Add the item to the budget controller
    newItem = budgetController.addItem(
      input.type,
      input.description,
      input.value
    );
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
