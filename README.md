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
The Layout designer is inspired by the React-Grid-Layout, however the implementation is totally different.\
CSS Grid is used as the backbone of the layout.

For resizing, it is manually implemented by manipluating the width and height of the DOM element based on the mouse movement.

For adding new controls via Drag and Drop from the toolbox, React-DnD is used.

For moving of controls, currently React-DnD is used but.

## Reasons for creating this project
* Practice React/HTML/Javascript and CSS Grid
* React-grid-layout is an awesome awesome library. It is performant, has nice animations and many features.\
However, as of today (Nov 2019), if I'm not mistaken, there is no support for auto-sizing the grid cell when the content grows.\
For example, if the child content is a tagged combobox/multiselect combobox, as the user selects more items, there is no way for the cell to grow.\
It does not look nice to show a scrollbar for this kind of control.\
Also, I found some overlap issues when useCSSTransforms is set to true (e.g. dropdown of combobox shows up behind a sibling control).\
Setting useCSSTransforms to false leads to some buggy behaviour when Dragging a new item from the toolbox.\
* This project does not aim to implement all the features in reat-grid-layout. It's more of a proof-of-concept that a layout designer can be built on top of CSS Grid.\

## Roadmap

#### Overall
- [x] Navigation Bar
- [x] Splitter
- [x] Accordion

#### Designer
- [x] Toolbox
- [x] Drag from Toolbox
- [x] Resize Controls
- [x] Move Controls
- [x] Delete Controls
- [x] Change Properties (partial implementation)
- [ ] Save Layout
- [ ] Undo/Redo
- [ ] Preview (Hide grid lines & empty controls)
- [ ] Insert Row

#### List Page
- [ ] Retrieve List of Saved forms
- [ ] Create/Edit/Delete form
- [ ] Open existing form
- [ ] Scrollspy-like feature

## Todo Items
- [x] Moving of controls - Add implementation to show internal landing pads
- [x] Responsive support (make it 1 column only, and remove empty cells if window is narrow)
- [x] Make it touch compatible
- [ ] Landing pads: align height with external controls

## Limitations
### Edge Cases
* Table (or any control that can have a huge width): if the space/span allocated by the user is too small,\
  => E.g. table has 20 columns, but user only allocated 3 colspans in the designer form.
  => Considered as user problem, but we handle gracefully as much as possible.
  => Horizontal scrollbar will appear inside the control. 
  => Overall, the aim is for the whole page to never show a horizontal scrollbar.
  => This is because of the reporting / save as PDF requirement. We want to be able to print nicely for MAJORITY of control.
  => If we allow scrollbar on the entire page because of 1 "misbehaving" control, it might affect printability of all controls.
* Table: colspan set by the user (internally, trasnfored to column width %) will only take effect if there is ample space.
  This is the default behaviour of HTML table

## Issues
- [ ] Dropping controls into the grid gap causes issues

## Current bugs
- [ ] If table only has few columns, collapsing the left pane causes the table to not stretch out and fill 100% width
- [ ] The new gauge control does not handle resizing @web view, when splitter window is shrunk (overlap, horz alignment)
- [ ] Pie chart overlaps when splitter window is shrunk