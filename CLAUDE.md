# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PrevYou is a Chrome extension that allows YouTube content creators to preview how their video thumbnails and titles will appear on YouTube's home page and subscription feed before publishing.

## Development Commands

### Install Dependencies
```bash
npm install
```

### Linting
```bash
npm run lint  # Run ESLint and automatically fix issues
```

### Package for Distribution
```bash
npm run package  # Creates prevyou.zip from HEAD
```

### Test Installation
1. Clone the repo
2. Go to chrome://extensions
3. Enable Developer mode
4. Click "Load unpacked" 
5. Select the repo's root directory

## Architecture

### Extension Structure (Manifest V3)

The extension operates with three main components:

1. **popup-wrapper.js**: Entry point when clicking the extension icon
   - Checks if user is on YouTube
   - Injects content script and CSS if not already loaded
   - Toggles the popup overlay

2. **content.js**: Injected into YouTube pages
   - Creates overlay with embedded iframe showing popup.html
   - Handles communication between popup and YouTube page
   - Finds and modifies YouTube video cards with preview data
   - Targets different card types: ytd-rich-grid-media, ytd-grid-video-renderer, ytd-compact-video-renderer

3. **popup.js**: Main UI logic
   - Handles dark/light mode with localStorage persistence
   - Manages form inputs for title, thumbnail, channel name, and channel avatar
   - Stores preview data in chrome.storage.local
   - Supports drag-and-drop for images (partially implemented)
   - Random shuffle feature for card selection

### Data Flow
1. User inputs preview data in popup.html
2. Data stored in chrome.storage.local under 'thumbnailProperties'
3. Content script retrieves data and modifies DOM elements on YouTube
4. Preview can target random positions (1-12) or first card

### Code Style (ESLint Configuration)
- No semicolons (enforced)
- Single quotes for strings
- 4-space indentation
- No unused variables allowed
- Browser environment with ES2021 features

## Key Implementation Notes

- Uses chrome.scripting API for script injection (Manifest V3)
- Popup displayed as embedded object element overlaying YouTube
- Channel thumbnails fallback to logged-in user's avatar if not provided
- Dark mode CSS variables managed through document.documentElement
- Preview targets active screen's video cards, filtering out ads