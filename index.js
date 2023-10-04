class Model {
  constructor() {
    // The state of the model, an array of todo objects, prepopulated with some data
    this.expenses = []
  }

  addExpense(expense_item_name, expense_item_cost, pay_per_hour) {
    const expense_item = {
      id: this.expenses.length > 0 ? this.expenses[this.expenses.length - 1].id + 1 : 1,
      name: expense_item_name,
      cost: expense_item_cost,
      hours: parseFloat(expense_item_cost / pay_per_hour).toFixed(2),
    }

    this.expenses.push(expense_item)
    this.onExpenseListChanged(this.expenses)
  }

  // Filter an expense out of the array by id
  deleteExpense(id) {
    this.expenses = this.expenses.filter((expense_item) => expense_item.id !== id)
    this.onExpenseListChanged(this.expenses)
  }
  
  bindExpenseListChanged(callback) {
    this.onExpenseListChanged = callback
  }
}

class View {
  constructor() {
        // The root element
        this.app = this.getElement('#root')

        // The title of the app
        this.title = this.createElement('h1')
        this.title.textContent = 'Time Vs. Money'  

        //The top row of inputs as a form element, one [type="text"] input        
        this.top_row_inputs = this.createElement('form')
        //input for the person' pay per hour
        this.input_pay_per_hour = this.createElement('input')
        this.input_pay_per_hour.type = 'text'
        this.input_pay_per_hour.placeholder = 'Add pay per hour'
        this.input_pay_per_hour.name = 'pay_per_hour'

        this.top_row_inputs.append(this.input_pay_per_hour)
  
        //The bottom row of inputs as a form element, two [type="text"] inputs
        this.bottom_row_inputs = this.createElement('form')
        //input for the person's expense item name
        this.input_expense_name = this.createElement('input')
        this.input_expense_name.type = 'text'
        this.input_expense_name.placeholder = 'Add an expense item'
        this.input_expense_name.name = 'expense_item_name'

        //input for the person's expense item cost
        this.input_expense_cost = this.createElement('input')
        this.input_expense_cost.type = 'text'
        this.input_expense_cost.placeholder = 'Add the expense cost'
        this.input_expense_cost.name = 'expense_item_cost'

        this.bottom_row_inputs.append(this.input_expense_name, this.input_expense_cost)

        //the submit button
        //need to make a submit button a form so can utilize the JS built-in 'submit' event
        this.submitButton_form = this.createElement('form')
        this.submitButton = this.createElement('button')
        this.submitButton.textContent = 'Submit'
        this.submitButton_form.append(this.submitButton)
    
        // The visual representation of the todo list
        this.expenseList = this.createElement('ul', 'expense-list')
    

        //The visual representation of the total_time
        this.total_time_display = this.createElement('ul', 'total_time')

        // Append the title, form(top_row_inputs), form(bottom_row_inputs), expense_list to the app
        this.app.append(this.title, this.top_row_inputs, this.bottom_row_inputs, this.submitButton_form, this.total_time_display, this.expenseList)
  }

  displayExpenses(expenses) {
    // Delete all nodes from expenseList
    while (this.expenseList.firstChild) {
      this.expenseList.removeChild(this.expenseList.firstChild)
    }

    // Delete all nodes in total_time_display
    while (this.total_time_display.firstChild) {
      this.total_time_display.removeChild(this.total_time_display.firstChild)
    }

    // Show default message
    if (expenses.length === 0) {
      const p = this.createElement('p')
      p.textContent = 'Submit an expense item above.'
      this.expenseList.append(p)
    } else {

      //total_time variable
      var total_time = 0

      // Create expense_item nodes for each expense
      expenses.forEach(expense => {

        total_time = parseFloat(total_time) + parseFloat(expense.hours)

        const li = this.createElement('li')
        li.id = expense.id

        // The expense_item text will be in a span
        const span = this.createElement('span')
        span.contentEditable = false
        span.classList.add('editable')        
        span.textContent = expense.name

        //the expense_item cost will display its cost
        const span2 = this.createElement('span')
        span2.contentEditable = false
        span2.classList.add('editable')        
        span2.textContent = "$" + expense.cost

        // The expense_item will have a delete button
        const deleteButton = this.createElement('button', 'delete')
        deleteButton.textContent = 'Delete'

        li.append(span, span2, deleteButton)

        // Append nodes to the todo list
        this.expenseList.append(li)

        const expense_item_hours = this.createElement('p')
        expense_item_hours.textContent = 'Total hours needed to work: ' + expense.hours + " hours (or " + parseFloat(expense.hours / 8).toFixed(2) + " standard 8hr days)"
        this.expenseList.append(expense_item_hours)     
        
      })
      //total_time label
      const TotalTimeLabel = this.createElement('p')
      TotalTimeLabel.textContent = "Total time needed to cover all monthly expenses: " + parseFloat(total_time).toFixed(2) + "hrs (or " + parseFloat(total_time / 8).toFixed(2) + " standard 8hr days)"
      this.total_time_display.append(TotalTimeLabel)
    }   

  }

  
  // Create an element with an optional CSS class
  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }

  bindAddExpense(handler) {
    this.submitButton_form.addEventListener('submit', event => {
      event.preventDefault()
  
      if (this._input_expense_name) {
        handler(this._input_expense_name, this._input_expense_cost, this._input_pay_per_hour)
        this._reset_input_expense_name()
        this._reset_input_expense_cost()        
      }
    })
  }
  
  bindDeleteExpense(handler) {
    this.expenseList.addEventListener('click', event => {
      if (event.target.className === 'delete') {
        const id = parseInt(event.target.parentElement.id)  
        handler(id)
      }
    })
  }
  
  // Retrieve an element from the DOM
  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  //get input_pay_per_hour 
  get _input_pay_per_hour() {
    return parseFloat(this.input_pay_per_hour.value).toFixed(2)
  }

  //get input_expense_name 
  get _input_expense_name() {
    return this.input_expense_name.value
  }

  //get input_expense_cost 
  get _input_expense_cost() {
    return parseFloat(this.input_expense_cost.value).toFixed(2)
  }
  
  // reset the input_pay_per_hour
  _reset_input_pay_per_hour() {
    this.input_pay_per_hour.value = ''
  }

  // reset the input_expense_name
  _reset_input_expense_name() {
    this.input_expense_name.value = ''
  }

  // reset the input_expense_cost
  _reset_input_expense_cost() {
    this.input_expense_cost.value = ''
  }

}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.view.bindAddExpense(this.handleAddExpense)
    this.view.bindDeleteExpense(this.handleDeleteExpense)
    this.model.bindExpenseListChanged(this.onExpenseListChanged)
    // Display initial expenses
    this.onExpenseListChanged(this.model.expenses)
  }

  onExpenseListChanged = (expenses) => {
    this.view.displayExpenses(expenses)
  }

  handleAddExpense = (expense_item_name, expense_item_cost, pay_per_hour) => {
    this.model.addExpense(expense_item_name, expense_item_cost, pay_per_hour)
  }  

  handleDeleteExpense = (id) => {
    this.model.deleteExpense(id)
  }

}

const app = new Controller(new Model(), new View())