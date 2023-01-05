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

  // Show summary
  updateSummary();
}

function updateSummary() {
  console.log("eh");
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

  // Add to content
  summary.appendChild(textHeader);
  summary.appendChild(table);
  summary.appendChild(time);
  summary.appendChild(heading);

  content.appendChild(summary);
}

function cleanHTML() {
  const content = document.querySelector("#summary .content");

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}
