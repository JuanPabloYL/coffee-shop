let customer = {
  table: "",
  time: "",
  order: [],
};

// Event Listeners
const name = document.querySelector("#name");
const email = document.querySelector("#email");
const table = document.querySelector("#table");
const time = document.querySelector("#time");

const formContact = document.querySelector(".form");
const btnSaveCustomer = document.querySelector("#save-customer");
btnSaveCustomer.addEventListener("click", saveCustomer);

// functions

// check if email is valid
function isValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function checkRequired(inputArr) {
  inputArr.forEach((input) => {
    const { value, id } = input;
    if (value.trim() === "") {
      showError(input, `${id} is required`);
    } else {
      input.classList.remove("error");
    }
  });
}

// Check length
function checkLength(input, min, max) {
  const { value, id } = input;
  if (value.length < min) {
    showError(input, `${id} must be at least ${min} characters `);
  } else if (value.length > max) {
    showError(input, `${id} must be less than ${max} characters`);
  } else {
    input.classList.remove("error");
  }
}

function saveCustomer(e) {
  e.preventDefault();

  checkRequired([name, email]);
  checkLength(name, 3, 15);
}

function showSuccess() {
  // const errorBox = document.createElement("DIV");
  // const errorText = document.createElement("P");
  // errorText.classList.add("alert-text");
  // errorBox.classList.add("error-box");
}

function showError(input, msg) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  input.classList.add("error");
  small.innerText = msg;
}
