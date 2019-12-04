## Overview

This project is a forms builder, wherein user can:
* Design form layouts using the Layout Designer
    * Drag and drop controls from the toolbox
    * Resize controls by dragging the resizer at bottom right corner
    * Move controls by dragging to an empty space
    * Save the layout
* Create and save entries based on the saved layouts
* Search/retrieve saved entries

## Design
The Layout designer is inspired by the React-Grid-Layout, however the implementation is totally different.
CSS Grid is used as the backbone of the layout.

For resizing, it is manually implemented by manipluating the width and height of the DOM element based on the mouse movement.

For adding new controls via Drag and Drop from the toolbox, React-DnD is used.

For moving of controls, currently React-DnD is used but


## Roadmap

#### Overall
- [x] Navigation Bar
- [x] Splitter
- [x] Accordion

#### Designer
- [x] Toolbox
- [x] Drag from Toolbox
- [x] Resize Controls
- [ ] Move Controls
...Partial implementation only (needs to reimplement)
- [ ] Delete Controls
- [ ] Change Properties
- [ ] Save Layout

#### List Page
- [ ] Retrieve List of Saved forms
- [ ] Create/Edit/Delete form
- [ ] Open existing form
- [ ] Scrollspy-like feature

## Todo Items
[ ] Moving of controls - Reimplement
...Current limitations:
        * If the control is big, the internal landing pads do not show up while dragging so there is no way for the user to move the control by 1 cell, for example.
        * The drag image in Chrome is translucent
[ ] Make it touch compatible
