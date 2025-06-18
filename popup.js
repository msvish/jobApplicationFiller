document.addEventListener("DOMContentLoaded", function () {
  // Autofill button handler - single purpose popup
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
});
