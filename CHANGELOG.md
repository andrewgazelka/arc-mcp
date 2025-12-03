# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-03

### Breaking Changes

This is a complete rewrite with Playwright-style semantic APIs. The old CSS-selector based tools have been removed.

#### Removed Tools
- `click_element` - Replaced by `click` with semantic locators
- `get_dom_tree` - Replaced by `get_page_structure` with better semantic structure
- `get_page_content` - Removed (use `get_page_structure` for structured content)

#### Migration Guide

**Before (v1.x):**
```json
{
  "tool": "click_element",
  "arguments": {
    "selector": "div.gb_Kd.gb_Nd"
  }
}
```

**After (v2.0):**
```json
{
  "tool": "click",
  "arguments": {
    "role": { "role": "button", "name": "Search" }
  }
}
```

Or use CSS as fallback:
```json
{
  "tool": "click",
  "arguments": {
    "css": "div.gb_Kd.gb_Nd"
  }
}
```

### Added

#### New Semantic Action Tools
- `click` - Click elements using semantic locators (role, label, text, placeholder, or CSS fallback)
- `fill` - Fast fill inputs (replaces entire value, triggers events)
- `type` - Character-by-character typing (triggers autocomplete and keyboard events)
- `select_option` - Select dropdown options by text or value

#### Semantic Locator Strategies
- **By Role** - Find by ARIA role (button, link, textbox, combobox, etc.) with optional accessible name
- **By Label** - Find inputs by associated label text
- **By Text** - Find elements containing visible text
- **By Placeholder** - Find inputs by placeholder attribute
- **By CSS** - Fallback to CSS selectors for edge cases

#### Improved DOM Representation
- `get_page_structure` - Returns structured tree with semantic types (button, link, textbox, etc.)
- Interactive elements are automatically identified and numbered with IDs
- Clean JSON structure matching Google Flights example format
- Only includes relevant interactive elements (no clutter)

### Changed

- **Architecture** - Modular structure with separate browser and server code
- **TypeScript** - Strict type checking enabled across entire codebase
- **Build System** - Browser code is bundled separately and injected at runtime
- **CI** - Type checking enforced in CI pipeline

### Unchanged

All navigation and tab management tools remain the same:
- `open_url`
- `get_current_tab`
- `list_tabs`
- `close_tab`
- `switch_to_tab`
- `reload_tab`
- `go_back`
- `go_forward`
- `execute_javascript`

## [0.1.0] - 2024-11-XX

Initial release with basic Arc browser control via AppleScript.
