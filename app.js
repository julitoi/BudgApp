/**********************************************
 *** CALCULATION CONTROLLER MODULE
 **********************************************/

var calcController = (function () {

    // private

    var budget = 0;
    var total_inc = 0;
    var total_exp = 0;
    var inc = [];
    var exp = [];

    var Income = function (id, type, description, value) {
        this.description = description;
        this.value = value;
        this.type = type;

        if (inc.length < 1) {
            this.id = 0;
        } else {
            this.id = inc[inc.length - 1].id + 1;
        }
    }

    var Expense = function (id, type, description, value) {
        this.description = description;
        this.value = value;
        this.type = type;

        if (exp.length < 1) {
            this.id = 0;
        } else {
            this.id = exp[exp.length - 1].id + 1;
        }
    }

    // publicly available object

    return {
        addItem: function (x) {

            if (x.type === 'inc') {
                var obj = new Income(0, x.type, x.description, x.value);
                inc.push(obj);
                total_inc += obj.value;
            } else if (x.type === 'exp') {
                var obj = new Expense(0, x.type, x.description, x.value);
                exp.push(obj);
                total_exp += obj.value;
                console.log(exp);
                console.log(total_exp);
            }
            return obj;
        },

        updatePercentages: function () {
            var percentage;
            var total_percentage = 0;
            var percentages = [];
            var values_exp = exp.map(cur => cur.value);

            if (total_inc > 0) {
                for (el of values_exp) {
                    percentage = Math.round((el / total_inc) * 100);
                    percentages.push(percentage);
                    total_percentage += percentage;
                }
            } else {
                total_percentage = -1;
            }

            return {
                percentages: percentages,
                total_percentage: total_percentage
            }
        },

        updateBudget: function () {
            total_inc = 0;
            var values_inc = inc.map(function (current) {
                return current.value;
            });

            for (var i = 0; i < values_inc.length; i++) {
                total_inc += values_inc[i];
            }

            total_exp = 0;
            var values_exp = exp.map(function (current) {
                return current.value;
            });

            for (var i = 0; i < values_exp.length; i++) {
                total_exp += values_exp[i];
            }

            return {
                total_inc: total_inc,
                total_exp: total_exp,
                budget: total_inc - total_exp
            };
        },

        deleteItem: function (type, id) {
            var index, ids;

            if (type === 'income') {
                ids = inc.map(function (current) {
                    return current.id;
                });

                index = ids.indexOf(id);

                if (index !== -1) {
                    inc.splice(index, 1);
                }
            } else if (type === 'expense') {
                ids = exp.map(function (current) {
                    return current.id;
                });

                index = ids.indexOf(id);

                if (index !== -1) {
                    exp.splice(index, 1);
                }
            }
        }
    };

})();


/**********************************************
 *** UI CALCULATION MODULE
 **********************************************/

var UIcontroller = (function () {

    // private

    var html, newHtml;

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // publicly available object

    return {

        displayMonth: function () {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var currentDate = new Date();
            var month = currentDate.getMonth();
            var year = currentDate.getFullYear();

            document.querySelector('.date_label').textContent = `${months[month]} ${year}`;
        },

        readInput: function () {
            return {
                type: document.querySelector('.add_selection').value,
                description: document.querySelector('.add_description').value,
                value: parseFloat(document.querySelector('.add_value').value)
            };
        },

        addItem: function (x) {
            if (x.type == 'inc') {
                html = '<div class="list-item" id="income-%id%"><div class="item_description">%description%</div><div class="right"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                newHtml = html.replace('%id%', x.id);
                newHtml = newHtml.replace('%description%', x.description);
                newHtml = newHtml.replace('%value%', x.value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }));

                document.querySelector('.income_list').insertAdjacentHTML('beforeend', newHtml);
            } else if (x.type === 'exp') {
                html = '<div class="list-item" id="expense-%id%"><div class="item_description">%description%</div><div class="right"><div class="item_value">%value%</div><div class="item_percentage">---</div><div class="item_delete"><button class="item_delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                newHtml = html.replace('%id%', x.id);
                newHtml = newHtml.replace('%description%', x.description);
                newHtml = newHtml.replace('%value%', x.value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }));

                document.querySelector('.expenses_list').insertAdjacentHTML('beforeend', newHtml);
            }

            document.querySelector('.add_description').value = '';
            document.querySelector('.add_value').value = '';
        },

        deleteItem: function (x) {
            var el = document.getElementById(x);
            el.parentNode.removeChild(el);
        },

        updatePercentages: function (x) {
            document.querySelector('.h_expense_percentage').textContent = `${x.total_percentage}%`;

            var fields = document.querySelectorAll('.item_percentage');

            nodeListForEach(fields, function (current, index) {

                if (x.percentages[index] > 0) {
                    current.textContent = x.percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        updateBudget: function (x) {
            document.querySelector('.budget_total').textContent = x.budget.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            document.querySelector('.h_income_value').textContent = x.total_inc.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            document.querySelector('.h_expense_value').textContent = x.total_exp.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    };

})();


/**********************************************
 *** CONTROLLER MODULE
 **********************************************/

var controller = (function (calcCon, UICon) {

    // private
    var input, obj, total, percentageInfo;

    var setupEventListeners = function () {

        // 1. eventListener for add button
        document.querySelector('.add_btn').addEventListener('click', ctrlAddItem);

        // 2. eventListener for adding item via hitting enter key
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        // 3. eventListener for delete button
        document.querySelector('.container').addEventListener('click', ctrlDeleteItem);

    };

    var ctrlUpdatePercentages = function () {

        // 1. calculate and return percentages (CALC)
        percentageInfo = calcCon.updatePercentages();
        console.log(percentageInfo);

        // 2. update UI (UI)
        UICon.updatePercentages(percentageInfo);
    }

    var ctrlUpdateBudget = function () {

        // 1. calculate and return budget (CALC)
        total = calcCon.updateBudget();

        // 2. update budget (UI)
        UICon.updateBudget(total);
    }

    var ctrlAddItem = function () {

        // 1. read input (UI)
        input = UICon.readInput();

        // 2. store new item (CALC)
        obj = calcCon.addItem(input);

        // 3. update budget
        ctrlUpdateBudget();

        // 4. add item UI and clear input fields (UI)
        UICon.addItem(obj);

        // 5. update percentages
        ctrlUpdatePercentages();
    };

    var ctrlDeleteItem = function (event) {
        var ID, itemType, itemID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            var id = itemID.split('-');
            ID = parseInt(id[1]);
            itemType = id[0];

            // 1. delete item in data structure (CALC)
            calcCon.deleteItem(itemType, ID);

            // 2. Update Budget
            ctrlUpdateBudget();

            // 3. Update UI (UI)
            UICon.deleteItem(itemID);

            // 4. Update percentages
            ctrlUpdatePercentages();
        }
    };


    // publicly available object

    return {
        init: function () {
            console.log('Application has started.');
            ctrlUpdateBudget();
            setupEventListeners();
            UICon.displayMonth();
        }
    };

})(calcController, UIcontroller);

controller.init();