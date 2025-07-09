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
    label: /^(city|current\s+city|residence\s+city)$/i,
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

  school: {
    id: /(?:^|_|-)(school)(?:$|_|-)/i,
    name: /(?:^|_|-)(school)(?:$|_|-)/i,
    placeholder: /school/i,
    label: /school/i,
    class: /school/i,
  },

  degree: {
    id: /(?:^|_|-)(degree|qualification|edu.*level|academic.*level)(?:$|_|-)/i,
    name: /(?:^|_|-)(degree|qualification|edu.*level|academic.*level)(?:$|_|-)/i,
    placeholder: /degree|qualification|education level|academic level/i,
    label: /degree|qualification|education level|academic level/i,
    class:
      /(?:^|_|-)(degree|qualification|edu.*level|academic.*level)(?:$|_|-)/i,
  },

  discipline: {
    id: /(?:^|_|-)(discipline|field.*study|subject|speciali[sz]ation)(?:$|_|-)/i,
    name: /(?:^|_|-)(discipline|field.*study|subject|speciali[sz]ation)(?:$|_|-)/i,
    placeholder: /discipline|field of study|subject|specialization/i,
    label: /discipline|field of study|subject|specialization/i,
    class:
      /(?:^|_|-)(discipline|field.*study|subject|speciali[sz]ation)(?:$|_|-)/i,
  },

  major: {
    id: /(?:^|_|-)(major|concentration|program)(?:$|_|-)/i,
    name: /(?:^|_|-)(major|concentration|program)(?:$|_|-)/i,
    placeholder: /major|concentration|program/i,
    label: /major|concentration|program/i,
    class: /(?:^|_|-)(major|concentration|program)(?:$|_|-)/i,
  },

  startMonth: {
    id: /(?:^|_|-)(start.*month|from.*month|begin.*month)(?:$|_|-)?/i,
    name: /(?:^|_|-)(start.*month|from.*month|begin.*month)(?:$|_|-)?/i,
    placeholder: /start\s*month|from\s*month|begin\s*month/i,
    label: /start\s*month|from\s*month|begin\s*month/i,
    class: /(?:^|_|-)(start.*month|from.*month|begin.*month)(?:$|_|-)?/i,
  },

  startYear: {
    id: /(?:^|_|-)(start.*year|from.*year|begin.*year)(?:$|_|-)?/i,
    name: /(?:^|_|-)(start.*year|from.*year|begin.*year)(?:$|_|-)?/i,
    placeholder: /start\s*year|from\s*year|begin\s*year/i,
    label: /start\s*year|from\s*year|begin\s*year/i,
    class: /(?:^|_|-)(start.*year|from.*year|begin.*year)(?:$|_|-)?/i,
  },

  endMonth: {
    id: /(?:^|_|-)(end.*month|to.*month|finish.*month)(?:$|_|-)?/i,
    name: /(?:^|_|-)(end.*month|to.*month|finish.*month)(?:$|_|-)?/i,
    placeholder: /end\s*month|to\s*month|finish\s*month/i,
    label: /end\s*month|to\s*month|finish\s*month/i,
    class: /(?:^|_|-)(end.*month|to.*month|finish.*month)(?:$|_|-)?/i,
  },

  endYear: {
    id: /(?:^|_|-)(end.*year|to.*year|finish.*year)(?:$|_|-)?/i,
    name: /(?:^|_|-)(end.*year|to.*year|finish.*year)(?:$|_|-)?/i,
    placeholder: /end\s*year|to\s*year|finish\s*year/i,
    label: /end\s*year|to\s*year|finish\s*year/i,
    class: /(?:^|_|-)(end.*year|to.*year|finish.*year)(?:$|_|-)?/i,
  },

  // // Password patterns
  // password: {
  //   id: /(?:^|_|-)(?:password|passwd|pwd|pass)(?:$|_|-)/i,
  //   name: /(?:^|_|-)(?:password|passwd|pwd|pass)(?:$|_|-)/i,
  //   type: /^password$/i,
  //   placeholder: /(?:^|[\s,])(?:password|passwd|pwd|pass)(?:$|[\s,])/i,
  //   label: /password|passwd|pwd|pass/i,
  //   class: /(?:^|_|-)(?:password|passwd|pwd|pass)(?:$|_|-)/i,
  // },

  // // Username patterns
  // username: {
  //   id: /(?:^|_|-)(?:username|userid|user[_-]?name|user[_-]?id|login)(?:$|_|-)/i,
  //   name: /(?:^|_|-)(?:username|userid|user[_-]?name|user[_-]?id|login)(?:$|_|-)/i,
  //   placeholder:
  //     /(?:^|[\s,])(?:username|userid|user\s+name|user\s+id|login)(?:$|[\s,])/i,
  //   label: /username|user\s+name|user\s+id|login\s+id/i,
  //   class:
  //     /(?:^|_|-)(?:username|userid|user[_-]?name|user[_-]?id|login)(?:$|_|-)/i,
  // },

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

  disability: {
    id: /disab(ilit(y)?|led)/i,
    name: /disab(ilit(y)?|led)/i,
    placeholder: /disab(ilit(y)?|led)/i,
    label: /do\s+you\s+have\s+a\s+disability|person\s+with\s+disability/i,
    class: /disab(ilit(y)?|led)/i,
  },

  sponsorship: {
    id: /sponsor(ship)?|require.*visa/i,
    name: /sponsor(ship)?|require.*visa/i,
    placeholder: /require.*sponsorship|visa/i,
    label: /require\s+sponsorship|will\s+you\s+require\s+visa/i,
    class: /sponsor(ship)?|visa/i,
  },

  authorization: {
    id: /\bauthoriz(e|ation)[-_ ]?(to)?[-_ ]?work\b/i,
    name: /\bauthoriz(e|ation)[-_ ]?(to)?[-_ ]?work\b/i,
    placeholder: /\bauthoriz(e|ation)[-_ ]?(to)?[-_ ]?work\b/i,
    label:
      /(?:legally\s*)?(authoriz(e|ation)|eligible|right)\s+(to\s+)?work.*(in\s+(the\s+)?u\.?s\.?|united\s+states)?/i,
    class: /\bauthoriz(e|ation)[-_ ]?(to)?[-_ ]?work\b/i,
  },

  relocation: {
    id: /relocat(e|ion)/i,
    name: /relocat(e|ion)/i,
    placeholder: /relocat(e|ion)/i,
    label: /willing\s+to\s+relocate|relocation\s+required/i,
    class: /relocat(e|ion)/i,
  },

  veteran: {
    id: /veteran|military/i,
    name: /veteran|military/i,
    placeholder: /veteran|military/i,
    label: /protected\s+veteran|military\s+status|are\s+you\s+a\s+veteran/i,
    class: /veteran|military/i,
  },

  race: {
    id: /race|ethnic/i,
    name: /race|ethnic/i,
    placeholder: /race|ethnic/i,
    label: /racial\s+group|ethnicity|select\s+your\s+race/i,
    class: /race|ethnic/i,
  },

  ethnicity: {
    id: /hispanic|latino/i,
    name: /hispanic|latino|ethnic/i,
    placeholder: /hispanic|latino|ethnic/i,
    label:
      /are\s+you\s+hispanic|do\s+you\s+identify\s+as\s+hispanic|ethnic\s+origin/i,
    class: /hispanic|latino|ethnic/i,
  },

  gender: {
    id: /gender|sex/i,
    name: /gender|sex/i,
    placeholder: /gender|sex/i,
    label: /please\s+select\s+your\s+gender|sex\s+assigned/i,
    class: /gender|sex/i,
  },

  startDate: {
    id: /start.*date|availability/i,
    name: /start.*date|availability/i,
    placeholder: /available\s+start\s+date/i,
    label: /when\s+can\s+you\s+start|available\s+to\s+begin/i,
    class: /start.*date|availability/i,
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
  school: "University of Michigan - Dearborn",
  degree: "Master's Degree",
  discipline: "Computer Science",
  startMonth: "September",
  startYear: 2024,
  endMonth: "May",
  endYear: 2025,
  linkedin: "https://www.linkedin.com/in/msvishal",
  website: "https://vishalms.com",
  disability: "No, I do not have a disability and have not had one in the past",
  sponsorship: "Yes",
  authorization: "Yes",
  relocation: "Yes",
  veteran: "I am not a protected veteran",
  race: "No",
  gender: "Male",
  startDate: "Immediately",
  ethnicity: "No",
};

// Function to detect field type based on its attributes
function detectFieldType(field) {
  const attributes = {
    id: field.id || "",
    name: field.name || "",
    className: field.className || "",
    placeholder: field.placeholder || "",
    type: field.type || "",
  };

  // Try to find associated label text
  let labelText = "";
  const labels = document.querySelectorAll("label");
  labels.forEach((label) => {
    if (label.htmlFor === field.id) {
      labelText = label.textContent.trim();
    }
  });

  if (!labelText && field.parentElement) {
    const parentLabel = field.parentElement.querySelector("label");
    if (parentLabel) {
      labelText = parentLabel.textContent.trim();
    }
  }

  // Strict field matching using defined patterns
  for (const [fieldType, patterns] of Object.entries(FIELD_PATTERNS)) {
    if (patterns.id && patterns.id.test(attributes.id)) {
      console.log(` Matched [${fieldType}] by id: ${attributes.id}`);
      return fieldType;
    }
    if (patterns.name && patterns.name.test(attributes.name)) {
      console.log(` Matched [${fieldType}] by name: ${attributes.name}`);
      return fieldType;
    }
    if (patterns.class && patterns.class.test(attributes.className)) {
      console.log(`Matched [${fieldType}] by class: ${attributes.className}`);
      return fieldType;
    }
    if (
      patterns.placeholder &&
      patterns.placeholder.test(attributes.placeholder)
    ) {
      console.log(
        ` Matched [${fieldType}] by placeholder: ${attributes.placeholder}`
      );
      return fieldType;
    }
    if (patterns.type && patterns.type.test(attributes.type)) {
      console.log(`Matched [${fieldType}] by type: ${attributes.type}`);
      return fieldType;
    }
    if (patterns.label && labelText && patterns.label.test(labelText)) {
      console.log(`Matched [${fieldType}] by label: ${labelText}`);
      return fieldType;
    }
  }

  // Final fallback removed (no outerHTML scanning)
  console.log(" No match for field:", {
    id: attributes.id,
    name: attributes.name,
    className: attributes.className,
    placeholder: attributes.placeholder,
    label: labelText,
  });

  return null;
}

async function uploadResume() {
  const resumeFileURL = chrome.runtime.getURL("assets/Vishal_Resume.pdf");

  let inputToUse = null;
  const fileInputs = Array.from(
    document.querySelectorAll('input[type="file"]')
  );
  const resumeRegex = /resume|cv|upload\s?(file|document)?|select\s?file/i;

  const response = await fetch(resumeFileURL);
  const blob = await response.blob();
  const file = new File([blob], "Vishal_Resume.pdf", { type: blob.type });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  for (const input of fileInputs) {
    if (input.files?.length) continue;

    // Step 1: Match id, name, class (even if unlikely in your case)
    const attrs = [input.id, input.name, input.className]
      .filter(Boolean)
      .join(" ");
    if (resumeRegex.test(attrs)) {
      inputToUse = input;
      break;
    }

    // Step 2: Match parent/sibling text content
    const parentText = input.closest("div, span")?.textContent || "";
    const prevText = input.previousElementSibling?.textContent || "";
    const nextText = input.nextElementSibling?.textContent || "";
    const combined = `${parentText} ${prevText} ${nextText}`.toLowerCase();

    if (resumeRegex.test(combined)) {
      inputToUse = input;
      break;
    }
  }

  if (!inputToUse) {
    console.log("No resume file input found.");
    return;
  }

  // Inject the file
  inputToUse.files = dataTransfer.files;
  inputToUse.dispatchEvent(new Event("input", { bubbles: true }));
  inputToUse.dispatchEvent(new Event("change", { bubbles: true }));
  console.log("Resume uploaded successfully.");
}

// Function to autofill forms
function autofillForms() {
  const inputFields = document.querySelectorAll("input, textarea, select");
  inputFields.forEach((field) => {
    if (
      field.type === "hidden" ||
      field.type === "submit" ||
      field.type === "button" ||
      field.type === "file" ||
      field.value // skip already filled fields
    )
      return;

    const fieldType = detectFieldType(field);

    // Fill only if type is confidently detected AND defined in data
    if (
      fieldType &&
      Object.prototype.hasOwnProperty.call(autofillData, fieldType)
    ) {
      console.log(`Autofilling [${fieldType}]`, {
        field,
        value: autofillData[fieldType],
      });

      field.value = autofillData[fieldType];

      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      console.log(`Skipping field`, {
        field,
        reason: fieldType
          ? `No data for fieldType [${fieldType}]`
          : `Field type not detected`,
      });
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
    setTimeout(uploadResume, 500);
    sendResponse({ status: "Autofill completed" });
    return true; // Keep the messaging channel open for the async response
  }
});
