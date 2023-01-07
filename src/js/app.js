let customer = {
  name: "",
  people: "",
  table: "",
  time: "",
  order: [],
};

const categories = {
  1: "Coffee",
  2: "Food",
};

const formContainer = document.querySelector(".form");
formContainer.addEventListener("submit", saveCustomer);

function saveCustomer(e) {
  e.preventDefault();
  const name = document.querySelector("#name").value;
  const people = document.querySelector("#people").value;
  const table = document.querySelector("#table").value;
  const time = document.querySelector("#time").value;

  // Checko for empy fields
  const emptyFields = [name, people, table, time].some((field) => field === "");

  if (emptyFields) {
    // Check if there is already an alert
    const existAlert = document.querySelector(".alert-box");

    if (existAlert) return;

    const alert = document.createElement("DIV");
    alert.classList.add("alert-box");
    setTimeout(() => {
      alert.classList.add("error");
    }, 200);

    const alertMessage = document.createElement("P");
    alertMessage.classList.add("alert-text");
    alertMessage.textContent = "All fields are required";

    alert.appendChild(alertMessage);

    document.querySelector(".form").appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 3000);
    return;
  }

  // Assign data from the form to customer
  customer = { ...customer, name, people, table, time };

  // hide form
  const formContainer = document.querySelector(".content-contact");
  formContainer.classList.add("hidden");

  // Show sections
  showSections();

  // Get dished from JSON server API
  getDishes();
}

function showSections() {
  const hiddenSections = document.querySelectorAll(".d-none");
  hiddenSections.forEach((section) => section.classList.remove("d-none"));
}

function getDishes() {
  const url = "http://localhost:4000/dishes";

  fetch(url)
    .then((response) => response.json())
    .then((result) => showDishes(result))
    .catch((error) => console.log(error));
}

function showDishes(dishes) {
  const content = document.querySelector("#content-order");

  dishes.forEach((dish) => {
    const { name, price, category, id } = dish;
    const row = document.createElement("TR");

    const dishName = document.createElement("TD");
    dishName.textContent = name;

    const dishPrice = document.createElement("TD");
    dishPrice.textContent = `$${price}`;

    const dishCategory = document.createElement("TD");
    dishCategory.textContent = categories[category];

    const amount = document.createElement("TD");
    amount.classList.add("order-amount");

    const inputAmount = document.createElement("INPUT");
    inputAmount.type = "number";
    inputAmount.min = 0;
    inputAmount.value = 0;
    inputAmount.id = `product-${id}`;

    // Function that detects the amount and the dish that is added
    inputAmount.onchange = function () {
      const amount = parseInt(inputAmount.value);
      addDish({ ...dish, amount });
    };

    amount.appendChild(inputAmount);

    row.appendChild(dishName);
    row.appendChild(dishPrice);
    row.appendChild(dishCategory);
    row.appendChild(amount);

    content.appendChild(row);
  });
}

function addDish(product) {
  // Get the actual order
  let { order } = customer;
  // Check if the amount is greater than 0
  const { amount } = product;
  if (amount > 0) {
    // Check if the element exists in the array
    if (order.some((article) => article.id === product.id)) {
      // The article already exists, update amount
      const updateOrder = order.map((article) => {
        if (article.id === product.id) {
          article.amount = product.amount;
        }
        return article;
      });

      // Assign new array for customer.order
      customer.order = [...updateOrder];
    } else {
      // The article do not exist we added to the order array
      customer.order = [...order, product];
    }
  } else {
    // delete elements when the amount is 0
    const result = order.filter((article) => article.id !== product.id);
    customer.order = [...result];
  }

  // Clean previous HTML code
  cleanHTML();

  if (customer.order.length) {
    // Show summary
    updateSummary();
  } else {
    messageEmptyOrder();
  }
}

function updateSummary() {
  const content = document.querySelector("#summary .content");

  const summary = document.createElement("DIV");
  summary.classList.add("content-consumed");

  const textHeader = document.createElement("P");
  textHeader.textContent = "Add elements to the order";
  textHeader.classList.add("margin-0", "text-center");
  // Table information
  const table = document.createElement("P");
  table.textContent = "Table: ";

  const tableSpan = document.createElement("SPAN");
  tableSpan.textContent = customer.table;

  // Time information
  const time = document.createElement("P");
  time.textContent = "Time: ";

  const timeSpan = document.createElement("SPAN");
  timeSpan.textContent = customer.time;

  // Add to parent element
  table.appendChild(tableSpan);
  time.appendChild(timeSpan);

  // Section title
  const heading = document.createElement("H4");
  heading.classList.add("text-center");
  heading.textContent = "Consumed Dishes";

  // Iteray over the order array
  const group = document.createElement("DIV");
  group.classList.add("content-consumed-dishes");

  const { order } = customer;
  order.forEach((article) => {
    const { name, amount, price, id } = article;

    const nameEl = document.createElement("H4");
    nameEl.textContent = name;

    // Amount of article
    const amountEl = document.createElement("P");
    amountEl.textContent = "Amount: ";

    const amountValue = document.createElement("SPAN");
    amountValue.textContent = amount;

    // Price of article
    const pricetEl = document.createElement("P");
    pricetEl.textContent = "Price: ";

    const priceValue = document.createElement("SPAN");
    priceValue.textContent = `$${price}`;

    // Subtotal of article
    const subtotaltEl = document.createElement("P");
    subtotaltEl.textContent = "Subtital: ";

    const subtotalValue = document.createElement("SPAN");
    subtotalValue.textContent = calculateSubtotal(price, amount);

    // Button to delete
    const btnDelete = document.createElement("BUTTON");
    btnDelete.textContent = "Delete order";

    // Function to delete from the order
    btnDelete.onclick = function () {
      deleteProduct(id);
    };

    const line = document.createElement("HR");

    // Add values to their containers
    amountEl.appendChild(amountValue);
    pricetEl.appendChild(priceValue);
    subtotaltEl.appendChild(subtotalValue);

    // Add element to the group
    group.appendChild(nameEl);
    group.appendChild(amountEl);
    group.appendChild(pricetEl);
    group.appendChild(subtotaltEl);
    group.appendChild(btnDelete);
    group.appendChild(line);
  });

  // Add to content
  summary.appendChild(textHeader);
  summary.appendChild(table);
  summary.appendChild(time);
  summary.appendChild(heading);
  summary.appendChild(group);

  content.appendChild(summary);

  // Show Tips form
  tipsForm();
}

function cleanHTML() {
  const content = document.querySelector("#summary .content");

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

function calculateSubtotal(price, amount) {
  return `$${price * amount}`;
}

function deleteProduct(id) {
  const { order } = customer;
  const result = order.filter((article) => article.id !== id);
  customer.order = [...result];

  // clear previous HTML
  cleanHTML();

  // Show summary
  if (customer.order.length) {
    // Show summary
    updateSummary();
  } else {
    messageEmptyOrder();
  }

  // The product is deleted so we set the amount to 0
  const deletedProduct = `#product-${id}`;
  const inputDeleted = document.querySelector(deletedProduct);
  inputDeleted.value = 0;
}

function messageEmptyOrder() {
  const content = document.querySelector("#summary");

  const text = document.createElement("P");
  text.classList.add("text-center");

  content.appendChild(text);
}

function tipsForm() {
  const content = document.querySelector("#summary .content");

  const formContainer = document.createElement("DIV");
  formContainer.classList.add("tips", "container");

  const heading = document.createElement("H4");
  heading.textContent = "Tips";

  const form = document.createElement("FORM");
  form.classList.add("tips-form");

  // Radio Button 10%
  const radioButtonContainer = document.createElement("DIV");
  radioButtonContainer.classList.add("tips-field");

  formContainer.appendChild(heading);

  content.appendChild(formContainer);
}
