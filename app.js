//--------------------------------------------------
//-----------------BUDGET CONTROLLER
//--------------------------------------------------

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
  //inc:income, exp:expenses
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

//--------------------------------------------------
//-----------------UI CONTROLLER--------------------
//--------------------------------------------------
const UIController = (function () {
  //Object to keep in one place all classes/strings
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
  };

  return {
    getInput: function () {
      return {
        //return an object, everything below
        type: document.querySelector(DOMstrings.inputType).value, //take value of input +(inc) or -(exp)
        description: document.querySelector(DOMstrings.inputDescription).value,
        //"value" return string. "parseFloat" convert string to a number.
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    //obj:object,
    addListItem: function (obj, type) {
      let html, newHtml, element;
      //Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id = "expense-%id%" ><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
      }

      //Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function () {
      let fields, fieldsArray;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      //Convert a list to an array because querySelectorAll returns a list!
      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach(function (current, index, array) {
        current.value = "";
      });
      //Set cursor to input description field
      fieldsArray[0].focus();
    },

    //Exposing DOMstrings object the PUBLIC section.
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

//--------------------------------------------------
//---------------GLOBAL APP CONTROLLER
//--------------------------------------------------
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

  const updateBudget = function () {
    //1. Calculate the budget
    //2.Return the budget
    //3. Display the budget on the UI
  };

  //Get value from input
  const ctrlAddItem = function () {
    let input, newItem;

    //1. Get the field input data
    input = UIController.getInput();
    //isNaN() - is not a number, !isNaN() gives "fals" to not a numbers! Func to allows write only numbers in input.value field
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget controller
      newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );
      //3. Add the item to the UI
      UIController.addListItem(newItem, input.type);
      //4.Clear the fields
      UIController.clearFields();
      //5.Calculate and update budget
      updateBudget();
    }
  };

  //All functions that wa want executed at the beginning
  return {
    init: function () {
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
