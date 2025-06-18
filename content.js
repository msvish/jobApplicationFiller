console.log("Form autofill extension loaded - waiting for click trigger");

// Common patterns for identifying form fields
const FIELD_PATTERNS = {
  // First name patterns
  firstName: {
    id: /(?:^|_|-)(?:first|given|fore)[_-]?name(?:$|_|-)/i,
    name: /(?:^|_|-)(?:first|given|fore)[_-]?name(?:$|_|-)/i,
    placeholder: /(?:^|[\s,])(?:first|given|fore)[_\s-]?name(?:$|[\s,])/i,
    label: /first\s+name|given\s+name|fore\s+name/i,
    class: /(?:^|_|-)(?:first|given|fore)[_-]?name(?:$|_|-)/i,
  },

  // Last name patterns
  lastName: {
    id: /(?:^|_|-)(?:last|family|sur)[_-]?name(?:$|_|-)/i,
    name: /(?:^|_|-)(?:last|family|sur)[_-]?name(?:$|_|-)/i,
    placeholder: /(?:^|[\s,])(?:last|family|sur)[_\s-]?name(?:$|[\s,])/i,
    label: /last\s+name|family\s+name|surname/i,
    class: /(?:^|_|-)(?:last|family|sur)[_-]?name(?:$|_|-)/i,
  },

  // Email patterns
  email: {
    id: /(?:^|_|-)(?:e-?mail|email|e_?mail)(?:$|_|-|address)/i,
    name: /(?:^|_|-)(?:e-?mail|email|e_?mail)(?:$|_|-|address)/i,
    type: /^email$/i,
    placeholder: /(?:^|[\s,])(?:e-?mail|email|e_?mail)(?:$|[\s,])/i,
    label: /e-?mail|email\s+address/i,
    class: /(?:^|_|-)(?:e-?mail|email|e_?mail)(?:$|_|-|address)/i,
  },

  // Phone patterns
  phone: {
    id: /(?:^|_|-)(?:phone|mobile|cell|tel(?:ephone)?)(?:$|_|-|number)/i,
    name: /(?:^|_|-)(?:phone|mobile|cell|tel(?:ephone)?)(?:$|_|-|number)/i,
    type: /^tel$/i,
    placeholder:
      /(?:^|[\s,])(?:phone|mobile|cell|tel(?:ephone)?)(?:$|[\s,]|number)/i,
    label: /phone|mobile|cell|telephone|contact\s+number/i,
    class: /(?:^|_|-)(?:phone|mobile|cell|tel(?:ephone)?)(?:$|_|-|number)/i,
  },

  // Address patterns
  address: {
    id: /(?:^|_|-)(?:address|addr|street)(?:$|_|-|[0-9]|line)/i,
    name: /(?:^|_|-)(?:address|addr|street)(?:$|_|-|[0-9]|line)/i,
    placeholder: /(?:^|[\s,])(?:address|addr|street)(?:$|[\s,]|line)/i,
    label: /address|street|addr/i,
    class: /(?:^|_|-)(?:address|addr|street)(?:$|_|-|[0-9]|line)/i,
  },

  // City patterns
  city: {
    id: /(?:^|_|-)(?:city|town|locale)(?:$|_|-)/i,
    name: /(?:^|_|-)(?:city|town|locale)(?:$|_|-)/i,
    placeholder: /(?:^|[\s,])(?:city|town|locale)(?:$|[\s,])/i,
    label: /city|town|locale/i,
    class: /(?:^|_|-)(?:city|town|locale)(?:$|_|-)/i,
  },

  // State/Province patterns
  state: {
    id: /(?:^|_|-)(?:state|province|region)(?:$|_|-)/i,
    name: /(?:^|_|-)(?:state|province|region)(?:$|_|-)/i,
    placeholder: /(?:^|[\s,])(?:state|province|region)(?:$|[\s,])/i,
    label: /state|province|region/i,
    class: /(?:^|_|-)(?:state|province|region)(?:$|_|-)/i,
  },

  // ZIP/Postal code patterns
  zipCode: {
    id: /(?:^|_|-)(?:zip|postal|post)[_-]?(?:code)?(?:$|_|-)/i,
    name: /(?:^|_|-)(?:zip|postal|post)[_-]?(?:code)?(?:$|_|-)/i,
    placeholder: /(?:^|[\s,])(?:zip|postal|post)[_\s-]?(?:code)?(?:$|[\s,])/i,
    label: /zip\s+code|postal\s+code|post\s+code/i,
    class: /(?:^|_|-)(?:zip|postal|post)[_-]?(?:code)?(?:$|_|-)/i,
  },

  // Password patterns
  password: {
    id: /(?:^|_|-)(?:password|passwd|pwd|pass)(?:$|_|-)/i,
    name: /(?:^|_|-)(?:password|passwd|pwd|pass)(?:$|_|-)/i,
    type: /^password$/i,
    placeholder: /(?:^|[\s,])(?:password|passwd|pwd|pass)(?:$|[\s,])/i,
    label: /password|passwd|pwd|pass/i,
    class: /(?:^|_|-)(?:password|passwd|pwd|pass)(?:$|_|-)/i,
  },

  // Username patterns
  username: {
    id: /(?:^|_|-)(?:username|userid|user[_-]?name|user[_-]?id|login)(?:$|_|-)/i,
    name: /(?:^|_|-)(?:username|userid|user[_-]?name|user[_-]?id|login)(?:$|_|-)/i,
    placeholder:
      /(?:^|[\s,])(?:username|userid|user\s+name|user\s+id|login)(?:$|[\s,])/i,
    label: /username|user\s+name|user\s+id|login\s+id/i,
    class:
      /(?:^|_|-)(?:username|userid|user[_-]?name|user[_-]?id|login)(?:$|_|-)/i,
  },

  // LinkedIn Profile patterns
  linkedin: {
    id: /linkedin/i,
    name: /linkedin/i,
    placeholder: /linkedin\s*(profile)?\s*url/i,
    label: /linkedin\s*(profile)?/i,
    class: /linkedin/i,
  },

  // Website / Portfolio patterns
  website: {
    id: /(?:web|portfolio|site|url)/i,
    name: /(?:web|portfolio|site|url)/i,
    placeholder: /(?:website|portfolio|personal\s+site|url)/i,
    label: /website|portfolio|personal\s+site|url/i,
    class: /(?:web|portfolio|site|url)/i,
    type: /^url$/i,
  },
};

// Your autofill data - hardcoded since we're not using the storage API anymore
const autofillData = {
  firstName: "Vishal",
  lastName: "Meda Srinivasa Murthy",
  email: "vishalms@umich.edu",
  phone: "313-675-1143",
  address: "5200 Heather Dr Apt 106",
  city: "Dearborn",
  state: "Michigan",
  zipCode: "48126",
  linkedin: "https://www.linkedin.com/in/vishal-m-s-71373a147",
  website: "https://vishalms.com",
};

// Function to detect field type based on its attributes
function detectFieldType(field) {
  // Get all relevant attributes
  const attributes = {
    id: field.id || "",
    name: field.name || "",
    className: field.className || "",
    placeholder: field.placeholder || "",
    type: field.type || "",
  };

  // Collect all data attributes that might contain field identifiers
  const dataAttributes = {};
  if (field.dataset) {
    Object.keys(field.dataset).forEach((key) => {
      dataAttributes[key] = field.dataset[key];
    });
  }

  // Check for custom attributes like contact_information_id
  const customAttributes = {};
  for (let i = 0; i < field.attributes.length; i++) {
    const attr = field.attributes[i];
    if (!["id", "name", "class", "placeholder", "type"].includes(attr.name)) {
      customAttributes[attr.name] = attr.value;
    }
  }

  // Try to find associated label text
  let labelText = "";
  const labels = document.querySelectorAll("label");
  labels.forEach((label) => {
    if (label.htmlFor === field.id) {
      labelText = label.textContent.trim();
    }
  });

  // If no direct label found, try to find nearby label
  if (!labelText && field.parentElement) {
    const parentLabel = field.parentElement.querySelector("label");
    if (parentLabel) {
      labelText = parentLabel.textContent.trim();
    }
  }

  // Check each field pattern against all attributes
  for (const [fieldType, patterns] of Object.entries(FIELD_PATTERNS)) {
    // Check ID attribute
    if (attributes.id && patterns.id && patterns.id.test(attributes.id)) {
      console.log(`Field ${attributes.id} identified as ${fieldType} by ID`);
      return fieldType;
    }

    // Check name attribute
    if (
      attributes.name &&
      patterns.name &&
      patterns.name.test(attributes.name)
    ) {
      console.log(
        `Field ${attributes.name} identified as ${fieldType} by name`
      );
      return fieldType;
    }

    // Check className attribute
    if (
      attributes.className &&
      patterns.class &&
      patterns.class.test(attributes.className)
    ) {
      console.log(
        `Field with class ${attributes.className} identified as ${fieldType} by class`
      );
      return fieldType;
    }

    // Check placeholder attribute
    if (
      attributes.placeholder &&
      patterns.placeholder &&
      patterns.placeholder.test(attributes.placeholder)
    ) {
      console.log(
        `Field with placeholder "${attributes.placeholder}" identified as ${fieldType} by placeholder`
      );
      return fieldType;
    }

    // Check input type attribute
    if (
      attributes.type &&
      patterns.type &&
      patterns.type.test(attributes.type)
    ) {
      console.log(
        `Field with type ${attributes.type} identified as ${fieldType} by type`
      );
      return fieldType;
    }

    // Check associated label text
    if (labelText && patterns.label && patterns.label.test(labelText)) {
      console.log(
        `Field with label "${labelText}" identified as ${fieldType} by label text`
      );
      return fieldType;
    }

    // NEW: Check data attributes
    for (const [dataKey, dataValue] of Object.entries(dataAttributes)) {
      if (typeof dataValue === "string") {
        // Check if data attribute key matches pattern
        if (patterns.id && patterns.id.test(dataKey)) {
          console.log(
            `Field with data-${dataKey} identified as ${fieldType} by data attribute key`
          );
          return fieldType;
        }

        // Check if data attribute value matches pattern
        if (patterns.id && patterns.id.test(dataValue)) {
          console.log(
            `Field with data-${dataKey}="${dataValue}" identified as ${fieldType} by data attribute value`
          );
          return fieldType;
        }
      }
    }

    // NEW: Check custom attributes (like contact_information_id="first_name")
    for (const [attrName, attrValue] of Object.entries(customAttributes)) {
      // Check if attribute name matches pattern (like contact_information_id containing "id")
      if (
        attrName.includes("id") &&
        patterns.id &&
        patterns.id.test(attrName)
      ) {
        console.log(
          `Field with ${attrName} identified as ${fieldType} by custom attribute name`
        );
        return fieldType;
      }

      // Check if attribute value matches pattern (like "first_name")
      if (
        typeof attrValue === "string" &&
        patterns.id &&
        patterns.id.test(attrValue)
      ) {
        console.log(
          `Field with ${attrName}="${attrValue}" identified as ${fieldType} by custom attribute value`
        );
        return fieldType;
      }
    }
  }

  // If we get here, we couldn't detect the type

  // Final attempt: Look for specific field values directly in the markup
  // This handles cases like contact_information_id="first_name"
  for (const [fieldType, patterns] of Object.entries(FIELD_PATTERNS)) {
    // Convert the field element to a string representation to check for patterns in raw HTML
    const fieldHtml = field.outerHTML.toLowerCase();

    // Check if any form of "first_name", "lastname", etc. appears in the HTML
    if (patterns.id) {
      const patternStr = patterns.id
        .toString()
        .replace(/[\[\]\(\)\{\}\\\.\^\$\|\?\*\+]/g, "") // Remove regex special chars
        .replace(/[ij]/g, ""); // Remove non-signal characters to get core pattern

      if (
        fieldHtml.includes(fieldType.toLowerCase()) ||
        (patternStr &&
          fieldHtml.includes(patternStr.substring(1, patternStr.length - 1)))
      ) {
        console.log(
          `Field identified as ${fieldType} by presence in HTML: ${fieldHtml.substring(
            0,
            50
          )}...`
        );
        return fieldType;
      }
    }
  }

  return null;
}

// Function to autofill forms
function autofillForms() {
  const inputFields = document.querySelectorAll("input, textarea, select");

  inputFields.forEach((field) => {
    // Skip hidden, submit, button, and already filled fields
    if (
      field.type === "hidden" ||
      field.type === "submit" ||
      field.type === "button" ||
      field.type === "file" ||
      field.value
    ) {
      return;
    }

    const fieldType = detectFieldType(field);
    if (fieldType && autofillData[fieldType]) {
      // Set the value
      field.value = autofillData[fieldType];

      // Dispatch events to trigger any listeners
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));

      console.log(`Autofilled ${fieldType} field:`, field);
    }
  });
}

// REMOVED: Do not run autofill automatically when page loads
// window.addEventListener('load', function() {
//   setTimeout(autofillForms, 1000);
// });

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "autofill") {
    console.log("Autofill triggered by popup button");
    autofillForms();
    sendResponse({ status: "Autofill completed" });
    return true; // Keep the messaging channel open for the async response
  }
});
