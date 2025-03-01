const models = [
  {
    id: "auto",
    name: "Auto",
    description: "Best for daily searches",
    apiValue: "auto",
  },
  {
    id: "sonar",
    name: "Sonar",
    description: "Perplexity's latest fast model",
    apiValue: "experimental",
  },
  {
    id: "gpt4",
    name: "GPT-4o",
    description: "OpenAI's fast model",
    apiValue: "gpt4o",
  },
  {
    id: "gpt45",
    name: "GPT-4.5",
    description: "OpenAI's new advanced model",
    isNew: true,
    apiValue: "gpt45",
  },
  {
    id: "claude",
    name: "Claude 3.7 Sonnet",
    description: "Anthropic's most advanced model",
    isNew: true,
    apiValue: "claude2",
  },
  {
    id: "grok2",
    name: "Grok-2",
    description: "xAI's latest model",
    apiValue: "grok",
  },
  {
    id: "gemini",
    name: "Gemini 2.0 Flash",
    description: "Google's latest fast model",
    apiValue: "gemini2flash",
  },
]

// Global state
let observer = null
let isProcessing = false

// API functions
async function updateModel(modelValue) {
  try {
    const response = await fetch(
      "https://www.perplexity.ai/rest/user/save-settings?version=2.18&source=default",
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "content-type": "application/json",
          "x-app-apiclient": "default",
          "x-app-apiversion": "2.18",
        },
        credentials: "include",
        body: JSON.stringify({
          updated_settings: {
            default_model: modelValue,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error updating model:", error)
  }
}

async function fetchDefaultModel() {
  try {
    const response = await fetch(
      "https://www.perplexity.ai/rest/user/settings?version=2.18&source=default",
      {
        method: "GET",
        headers: {
          accept: "*/*",
          "content-type": "application/json",
          "x-app-apiclient": "default",
          "x-app-apiversion": "2.18",
        },
        credentials: "include",
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.default_model
  } catch (error) {
    console.error("Error fetching default model:", error)
    return "auto"
  }
}

// UI creation
async function createModelSelector() {
  // Prevent multiple simultaneous calls
  if (isProcessing || document.querySelector("[data-model-button]")) return
  isProcessing = true

  try {
    const targetElement = document.querySelector(".gap-sm.flex")
    if (!targetElement) {
      isProcessing = false
      return
    }

    const defaultModel = await fetchDefaultModel()
    const defaultModelData =
      models.find((m) => m.apiValue === defaultModel) || models[0]

    // Check if button was created while we were fetching
    if (document.querySelector("[data-model-button]")) {
      isProcessing = false
      return
    }

    // Create button
    const button = document.createElement("button")
    button.setAttribute("data-model-button", "true")
    button.className =
      "border border-borderMain/50 dark:border-borderMainDark/50 text-textOff dark:text-textOffDark md:hover:text-textMain md:dark:hover:text-textMainDark rounded-md font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out select-none items-center relative group/button justify-center text-center items-center rounded cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 pl-2.5 pr-3"
    button.innerHTML = `
      <div class="flex items-center min-w-0 font-medium gap-1.5 justify-center">
        <div class="text-align-center relative truncate leading-loose -mb-px">${defaultModelData.name}</div>
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-xs opacity-50" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
        </svg>
      </div>
    `

    // Create menu
    const menu = document.createElement("div")
    menu.setAttribute("data-model-menu", "true")
    menu.className =
      "shadow-subtle flex min-h-0 min-w-0 rounded-md border duration-150 animate-in fade-in zoom-in-[0.97] ease-out border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-background dark:bg-backgroundDark fixed"
    menu.style.display = "none"
    menu.innerHTML = `
      <div class="flex flex-col min-w-[200px]">
        <div class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-idle dark:scrollbar-thumb-idleDark min-h-0 flex-1 overflow-auto py-2">
        </div>
      </div>
    `

    const optionsContainer = menu.querySelector(".scrollbar-thin")

    // Build model options function
    function buildModelOptions(selectedModelValue) {
      optionsContainer.innerHTML = ""

      models.forEach((model) => {
        const option = document.createElement("div")
        option.className =
          "px-3 py-1 hover:bg-offset dark:hover:bg-offsetDark cursor-pointer"
        const isSelected = model.apiValue === selectedModelValue
        option.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="font-sans text-sm font-medium ${
                  isSelected
                    ? "text-super dark:text-superDark"
                    : "text-textMain dark:text-textMainDark"
                }">${model.name}</span>
              </div>
              <div class="font-sans text-xs text-textOff dark:text-textOffDark">${
                model.description
              }</div>
            </div>
            ${
              isSelected
                ? `<svg aria-hidden="false" focusable="false" data-prefix="far" data-icon="check" class="svg-inline--fa fa-check fa-sm text-super dark:text-superDark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12"><path fill="currentColor" d="M441 103c9.4 9.4 9.4 24.6 0 33.9L177 401c-9.4 9.4-24.6 9.4-33.9 0L7 265c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l119 119L407 103c9.4-9.4 24.6-9.4 33.9 0z"></path></svg>`
                : ""
            }
          </div>
        `

        option.addEventListener("click", async () => {
          button.querySelector(".text-align-center").textContent = model.name
          menu.style.display = "none"
          await updateModel(model.apiValue)
          buildModelOptions(model.apiValue)
        })

        optionsContainer.appendChild(option)
      })
    }

    // Initial build
    buildModelOptions(defaultModel)

    // Add to DOM
    targetElement.appendChild(button)
    document.body.appendChild(menu)

    // Button click event
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const rect = button.getBoundingClientRect()
      menu.style.top = `${rect.bottom + 4}px`
      menu.style.left = `${rect.left}px`
      menu.style.display = menu.style.display === "none" ? "flex" : "none"
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && !button.contains(e.target)) {
        menu.style.display = "none"
      }
    })
  } finally {
    isProcessing = false
  }
}

// Cleanup
function cleanup() {
  document.querySelectorAll("[data-model-button]").forEach((el) => el.remove())
  document.querySelectorAll("[data-model-menu]").forEach((el) => el.remove())
}

// Initialize observer
function initializeObserver() {
  cleanup()

  if (observer) observer.disconnect()

  observer = new MutationObserver(() => {
    const targetElement = document.querySelector(".gap-sm.flex")
    const buttonExists = document.querySelector("[data-model-button]")

    if (targetElement && !buttonExists && !isProcessing) {
      createModelSelector()
    } else if (!targetElement && buttonExists) {
      cleanup()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  // Try to create on init
  const targetElement = document.querySelector(".gap-sm.flex")
  if (targetElement) createModelSelector()
}

// Event listeners
window.addEventListener("popstate", () => {
  cleanup()
  setTimeout(initializeObserver, 300)
})

// Initialize
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initializeObserver()
} else {
  window.addEventListener("DOMContentLoaded", initializeObserver)
}
