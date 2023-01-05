let customer = {
  name: "",
  people: "",
  table: "",
  time: "",
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
}

function showSections() {}
