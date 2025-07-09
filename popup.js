const fields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "zipCode",
  "school",
  "degree",
  "discipline",
  "startMonth",
  "startYear",
  "endMonth",
  "endYear",
  "linkedin",
  "website",
];

let formData = {};
let currentStep = 0;

function renderStep() {
  const content = document.getElementById("content");
  const field = fields[currentStep];
  const value = formData[field] || "";

  content.innerHTML = `
  <input id="fieldInput" placeholder="${field}" value="${value}" />
  <div class="error" id="errorText"></div>
  <button id="nextBtn">${
    currentStep === fields.length - 1 ? "Save" : "Next"
  }</button>
`;

  const errorText = document.getElementById("errorText");

  document.getElementById("fieldInput").addEventListener("input", () => {
    errorText.innerText = "";
    errorText.style.visibility = "hidden";
  });

  document.getElementById("nextBtn").onclick = () => {
    const input = document.getElementById("fieldInput").value.trim();

    if (!input) {
      errorText.innerText = "This field cannot be empty.";
      errorText.style.visibility = "visible";
      return;
    }

    formData[field] = input;
    currentStep++;

    if (currentStep < fields.length) {
      renderStep();
    } else {
      localStorage.setItem("autofillData", JSON.stringify(formData));
      showAutofillUI();
    }
  };
}

function showAutofillUI() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <button id="autofillButton">Autofill</button>
    <div class="small-link" id="updateData">Update autofill data</div>
  `;

  document
    .getElementById("autofillButton")
    .addEventListener("click", function () {
      // Disable the button to prevent multiple clicks
      const button = document.getElementById("autofillButton");
      button.disabled = true;
      button.textContent = "Filling...";

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs[0] && tabs[0].id) {
          console.log("Active tab ID:", tabs[0].id);
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "autofill" },
            function (response) {
              if (chrome.runtime.lastError) {
                console.error(
                  "Error sending message:",
                  chrome.runtime.lastError.message
                );
              } else {
                console.log("Autofill response:", response);
              }
              setTimeout(() => {
                button.disabled = false;
                button.textContent = "Click";
                if (response && response.status) window.close();
              }, 500);
            }
          );
        } else {
          console.warn("No valid active tab found.");
          button.disabled = false;
          button.textContent = "Click";
        }
      });
    });

  document.getElementById("updateData").onclick = () => {
    formData = JSON.parse(localStorage.getItem("autofillData") || "{}");
    currentStep = 0;
    renderStep();
  };
}

function render() {
  const data = localStorage.getItem("autofillData");
  if (data) {
    formData = JSON.parse(data);
    showAutofillUI();
  } else {
    renderStep();
  }
}

document.addEventListener("DOMContentLoaded", render);
