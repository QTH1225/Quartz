---
title: Architectural Drawing Notes
draft: false
author: Tianhao Qin
authorLink: https://github.com/QTH1225
lang: en-US
tags:
  - CAD drawings
translations:
  zh: "/03construction/architectural-drawing-notes"
---

## Architectural Drawing

### Drawing Reading and Standards

#### Line Requirements

Solid lines:

Thick lines, with line width b, are used for outlines of building elements cut by a section. Medium-thick lines use 0.75 b. Medium lines use 0.5 b. Thin lines use 0.25 b and are used for furniture lines.

Dash-dot lines:

Thick dash-dot lines use line width b. Medium dash-dot lines use 0.5 b. Thin dash-dot lines use 0.25 b and are used for positioning axes.

Here the third line-width group is used, namely $d=0.7$.

| Line Width Ratio | Line Width Group |  |  |  |
| :--: | :--: | :--: | :--: | :--: |
| b | 1.4 | 1.0 | 0.7 | 0.5 |
| 0.7 b | 1.0 | 0.7 | 0.5 | 0.35 |
| 0.5 b | 0.7 | 0.5 | 0.35 | 0.25 |
| 0.25 b | 0.35 | 0.25 | 0.18 | 0.13 |

#### Text Requirements

In the same drawing, no more than two font types should generally be used:

Long Fang Song, used for Chinese annotation and explanation text, title blocks, and schedules; Songti, Kaiti, and Heiti, used for project names, headings, drawing titles, and similar items.

The text size is 3.5 mm for letters and numbers and 5 mm for Chinese characters.

The text line width should generally be 0.25 mm to 0.35 mm.

### Drawing Axes

Use construction lines to draw positioning axes. The shortcut is `xl`. First use the `la` shortcut to create the positioning-axis layer.

In this step, the linetype and line width should be changed to $0.25b$.

Use the `o` shortcut for offset.

After drawing the axes, use the `tr` shortcut for trimming. Select `c` for crossing selection and drag a window from right to left.

Because points and lines are dense, modify the linetype scale factor using the `lts` shortcut.

Use `tr` to trim redundant axes.

### Drawing Walls and Door/Window Openings

#### Drawing Walls

Use the multiline command to draw walls. The shortcut is `ml`. Set the justification type to none.

After drawing the corresponding walls, openings need to be connected. Double-click with the left mouse button to use multiline editing, and choose the *T-shaped open* or *cross open* option.

After the openings are connected, use the `x` shortcut to explode the wall.

Use the `ex` shortcut to extend according to wall positions, and use the `j` shortcut to join.

Extend the axes outward with `len + space + de + space`.

#### Drawing Door and Window Openings

The offset and trim commands are mainly used for trimming. Construction lines `xl` and multilines `ml` can also be used for trimming.

When door and window openings are the same, they can be copied. `shift + right click` can snap to the midpoint.

### Drawing Columns, Doors/Windows, and Balconies

#### Drawing Columns

Create the column layer. Use the rectangle command `rec`, and directly specify the dimensions.

Use the `h` shortcut for hatch filling.

After filling, use the `bl` shortcut to create a block. Pick the geometric center of the column as the insertion point.

#### Drawing Doors and Windows

- Create the window layer.

WINDOWS uses multiline styles for drawing. Use the `mlstyle` shortcut to set the multiline style format.

Change the offset of elements in the multiline style. Set the offset to the distance from the center. After setting it, change the multiline command scale to 1.

Then use the multiline command to draw windows.

- Create the door layer.

Because doors and door swing lines have different line widths, doors and door lines are drawn separately.

Use the `rec` rectangle command to draw doors according to dimensions.

- Draw door swing lines with thin solid lines. First create the door-line layer.

Use the arc command to draw the line. The shortcut is `a`. After specifying the start point, choose `e` to specify the end point.

Important: the arc command draws in the *counterclockwise* direction, so the start point and end point should be determined carefully.

#### Drawing Balconies

Create the balcony layer.

Use the polyline command `pl` for drawing.

### Border, Stairs, and Door/Window Numbers

When the drawing border size does not meet requirements, use the `sc` shortcut to scale it up.

For the scale factor, prefer common ratios. If they do not fit, use an available ratio, and remember to leave space for dimensions and axis labels.

- Create the stair layer.

Use `rec` to draw the platform part.

Select the platform line, use `co + space`, choose array `A`, and choose to fill the length. Delete extra lines at the stair starting point.

Use the polyline command `pl` to draw arrows, and change the start and end widths.

For text above and below, create a text style with `st + space`. Create a new font, choose the SHX font Long Fang Song `gbenor.shx`, use the big font `gbcbig.shx`, set the height to 5, and make it current. Also note that the text line width is 0.25.

- Door and window numbers.

Switch to the window layer. The font size should be 3.5 mm. For vertical text, use the `ro` shortcut to rotate it.

Important: door and window numbers use two separate layers.

### Dimensioning and Room Name Settings

#### Dimension Settings

First set the dimension style correctly. Use the `D` shortcut, select ISO-25, and create a new style. Change the baseline spacing to 7, extension beyond dimension lines to 2, and offset from origin to 2. Check fixed-length extension lines and set the length to 10. Change arrows to architectural ticks.

Before changing dimension text, create a text style. Set height to 0 and text height to 3.5.

In the adjustment options, set the text to always stay between extension lines, and change the global scale to the drawing-border enlargement factor. If this is not changed, dimension text may appear too small.

In primary units, change the decimal separator to a period, set the style as current, and close.

- Create the dimension layer.

Draw the innermost dimensions first. Use `dli` to start linear dimensioning. You can press `space` to repeat the previous command. Use the `dco` shortcut for continuous dimensioning.

For middle dimensions, use `dba` to start baseline dimensioning, or use quick dimension `qdim` and select the axes. External dimensions still use linear dimensioning.

If overlapping dimensions need to be set, use the `dco` shortcut.

- Draw axis bubbles.

First create the axis-label layer. The circle diameter should generally be 8 to 10 mm. Numbers inside the circles use 3.5 mm Long Fang Song. Remember to modify the text line width to 0.25.

#### Room Name Settings

Create the room-name layer and change the text style to 5 mm Long Fang Song.

### Elevations, Drawing Titles, and Printing

Create the elevation layer. Set the elevation line width to 0.18. The angle of the elevation symbol is 45 degrees, and its height is about 3 mm. Change the text style to 3.5 mm Long Fang Song and set the line width to default.

Create the drawing-title layer. Use the `st` shortcut to create a Songti text style. Uncheck the use of big font, set the height to 5, and make it current. Use `pl` and change the width to draw the bottom line.

The drawing scale uses 3.5 mm Long Fang Song.

The drawing print shortcut is `ctrl + p`. Set the printer name, paper size, print range as window, and drawing orientation. For the plot style table, use `acad.ctb` for color printing and `monochrome.ctb` for black-and-white printing.

If white margins appear in printing, click Properties, modify the standard paper size, find the corresponding paper size below, click Modify, and change the margins.
