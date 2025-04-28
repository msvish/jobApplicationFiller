document.getElementById("fillButton").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: fillForm,
  });
});

function fillForm() {
  const data = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    resume: "Paste your resume text here",
    coverLetter: "Paste your cover letter here",
  };

  // Example - fill input fields by name
  document.querySelectorAll("input").forEach((input) => {
    if (input.name.toLowerCase().includes("name")) input.value = data.name;
    if (input.name.toLowerCase().includes("email")) input.value = data.email;
    if (input.name.toLowerCase().includes("phone")) input.value = data.phone;
  });

  // Example - fill textarea (for cover letter or other text inputs)
  document.querySelectorAll("textarea").forEach((textarea) => {
    if (textarea.name.toLowerCase().includes("cover"))
      textarea.value = data.coverLetter;
    if (textarea.name.toLowerCase().includes("resume"))
      textarea.value = data.resume;
  });
}
