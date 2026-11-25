QUIET KEYS — FREE INPUT PROMPTS v1.0
By ailora will | 2026-10-26

12 keyboard prompts, each with idle and pressed states. A neutral off-white / charcoal style for tutorials, control menus and small game HUDs.

CONTENTS
24 editable SVG files (64 x 64 viewBox, paths/shapes only; no fonts).
72 transparent RGBA PNG files: the same 24 states at 32, 64 and 256 px.
3 PNG previews. README in English/Japanese, license, manifest and checksums.
Keys: W, A, S, D; up, left, down, right; E, Space, Enter, Esc.
These are 12 distinct keys, NOT 96 unique designs. No engine project included.

QUICK START
1. Select png/32 or png/64 for native-size UI; use png/256 for larger layouts.
2. Start with e-idle.png. Swap to e-pressed.png while the associated input is held, then swap back on release. Implement that behavior in your own project.
3. Both states have identical square canvases. Keep their pivot/anchor and dimensions the same to avoid unwanted layout movement. The key face intentionally moves down by 5/64 of the image height when pressed.
4. Keep aspect ratio 1:1. For the sharpest small UI use the exact-size PNG, rather than shrinking a 256 px texture at runtime. Configure filtering and import settings for your own engine.
5. Add your own localized action text beside the image (for example: [E] Interact / [Space] Jump). These files describe physical key labels, not fixed actions. Remapping, keyboard layout detection and accessibility descriptions are your application's responsibility.
6. Edit the SVG paths or fills in a vector editor for other colors. No font installation required.

PREVIEWS
contact-sheet.png: six keys per row, idle above pressed; first row W/A/S/D/up/left, second row down/right/E/Space/Enter/Esc.
actual-size-32-64.png: each key in the same listed order; left panel idle on white, right panel pressed on charcoal. Within each panel: actual 32 px then 64 px. View at 100%, not fit-to-window, to assess small sizes.
example-platformer-ui.png: illustrative static mockup only. E above a door, Space below the player, left/right below the scene. No playable game or action labels included.

LICENSE & DISCLOSURE
Free for personal and commercial projects under LICENSE-EN-JA.txt. Modification allowed; attribution appreciated, not required. Do not redistribute/resell as standalone assets or as an asset pack. This is a custom asset license, NOT CC0 or an open-source license.
AI-assisted design and code. Original programmatically drawn vector paths; no third-party icons, downloaded artwork or font files are included. No generative image model was used. Formats were rendered and checked locally; integration in specific game engines has not been tested.
