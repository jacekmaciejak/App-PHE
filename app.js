//--------------------------------------------------
//-----------------BUDGET CONTROLLER----------------
//--------------------------------------------------

const budgetController = (function () {
  //Constructor-object,
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  //inc:income, exp:expenses
  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
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

    deleteItem: function (type, id) {
      let ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    //Calculate total incomes and total expenses
    calculateBudget: function () {
      //Calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      //Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      //Calculate the precentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      const allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    //Returns values from array
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
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
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  const formatNumber = function (num, type) {
    let numSplit, int, dec;
    /*
+ or - before number
exactly 2 decimal points
comma separating the thousands
2310.4567 -> + 2,310.46
2000 -> + 2,000.00
*/
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); //input 2310, output 2,310
    }
    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  const nodeListForEach = function (list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%$</div><div class="item__delete"><button class="item__delete--btn"><i ><ion-icon name="close-circle-outline"></ion-icon></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id = "exp-%id%" ><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i><ion-icon name="close-circle-outline"></ion-icon></i></button></div></div>';
      }

      //Replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      //Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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

    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent =
        formatNumber(obj.budget, type) + "$";
      document.querySelector(DOMstrings.incomeLabel).textContent =
        formatNumber(obj.totalInc, "inc") + "$";
      document.querySelector(DOMstrings.expensesLabel).textContent =
        formatNumber(obj.totalExp, "exp") + "$";

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentages: function (percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displayMonth: function () {
      let now, year, month, months;

      now = new Date();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
    },

    changedType: function () {
      const fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );
      nodeListForEach(fields, function (cur) {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
    },
    //Exposing DOMstrings object the PUBLIC section.
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

//--------------------------------------------------
//---------------GLOBAL APP CONTROLLER--------------
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
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UIController.changedType);
  };

  const updateBudget = function () {
    //1. Calculate the budget
    budgetController.calculateBudget();
    //2. Return the budget
    let budget = budgetController.getBudget();
    //3. Display the budget on the UI
    UIController.displayBudget(budget);
  };

  const updatePercentages = function () {
    //1.Calculate percentages
    budgetController.calculatePercentages();
    //2.Read precentages from the budget controller
    const percentages = budgetController.getPercentages();
    //3.update the UI with the new percentages
    UIController.displayPercentages(percentages);
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
      //6.Calculate and update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function (event) {
    let itemID, splitID, type, ID;
    itemID =
      event.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]); //parseInt converse string to a number

      //1. Delete the item from the data structure
      budgetController.deleteItem(type, ID);
      //2. Delete the item from the UI
      UIController.deleteListItem(itemID);
      //3. Update and show the new budget
      updateBudget();
      //4.Calculate and update percentages
      updatePercentages();
    }
  };

  //All functions that wa want executed at the beginning
  return {
    init: function () {
      UIController.displayMonth();
      UIController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
