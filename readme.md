# Perplexity Model Selector Extension

A Chrome extension that adds a model selector dropdown to Perplexity AI, allowing quick switching between different AI models directly from the search interface.

## Features

- Quick model switching between:
  - Auto (Best for daily searches)
  - Sonar (Perplexity's latest fast model)
  - GPT-4o (OpenAI's fast model)
  - GPT-4.5 (OpenAI's new advanced model)
  - Claude 3.7 Sonnet (Anthropic's most advanced model)
  - Grok-2 (xAI's latest model)
  - Gemini 2.0 Flash (Google's latest fast model)
- Seamless integration with Perplexity's UI
- Persistent model selection
- Model descriptions and visual indicators

## Installation

1. Clone this repository or download the files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will now be active on Perplexity AI

## Files

### manifest.json

```json
{
  "manifest_version": 3,
  "name": "Perplexity Model Selector",
  "version": "1.0",
  "description": "Adds a model selector dropdown to Perplexity AI",
  "permissions": ["activeTab"],
  "content_scripts": [
    {
      "matches": ["https://www.perplexity.ai/*"],
      "js": ["content.js"]
    }
  ]
}
```

### content.js

Contains the main extension logic:

- Model definitions and configuration
- UI creation and event handling
- API integration with Perplexity
- DOM observation for persistent functionality

## Usage

1. Visit [Perplexity AI](https://www.perplexity.ai)
2. Look for the model selector button in the search interface
3. Click to open the dropdown menu
4. Select your desired model
5. The selection will be saved and used for future searches

## Development

The extension uses vanilla JavaScript and follows Perplexity's design patterns. It maintains itself across page navigations using a MutationObserver.

To modify:

1. Update `models` array in content.js to change available models
2. Adjust UI elements by modifying the className strings
3. Test thoroughly across different Perplexity pages

## License

MIT License

## Note

This is a community-created extension and is not officially affiliated with Perplexity AI.
