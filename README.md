# v4.0.0-alpha

## Additions
- Sprites:
  - Can be created by adding a sprite component or by dragging a texture file to the viewport/inspector
  - The renderer supports view locking and static viewport size
- Textures:
  - Can be configured with multiple combinations of OpenGL attributes (wrapping, filtering and more)
  - Integrated with inspector
  - Single instance on engine, causing less memory being wasted by replicating same image texture on the GPU
  - Real time update for settings change
  - glTF loader integrated with new texture format
- Hierarchy improvements:
  - There will always be a locked entity (except when there is no entity present on level)
  - Quick access button to locked entity will appear on top-level parent, by clicking it the hierarchy will be open to highlight entity
  - Tooltip and visual indicator for children being selected
- Drag and drop:
  - Custom drag-drop structure now supports dynamic drag-images and realtime integration with targets, allows more information during drag over elements
- Global selector
  - Selection now works globally, If you select an entity and after a file the selection target will change.
  - Allows integration of inspector and content browser, in the future inspector and shader editor.


## Reworks
- Viewport visuals:
  - Gizmo options now are located on top together with View and add options
  - Added selection options as a dropdown
- Editor camera:
  - The camera now allows more flexible movement with position and radius control
  - By holding **ctrl** you can move the camera center position.
  - The current camera position during movement will be displayed in the same place the translation and scale gizmos show their current transformation
  - Clicking **home** will center camera on current active entity
- Shader editor interactions:
  - Pointer locked removed when dragging board
  - Multi selection added again by holding **ctrl** key
  - Multi drag now works by simply moving any selected node
  - Hot keys: essential hotkeys were added
- Tooltips:
  - Backend structure is now more efficient, only generating a single mounting point instead of multiple render targets
  - Faster transition between tooltip content
- Content browser layout:
  - Visual rework to layout allowing more dynamic visualization options
- Renderer backend:
  - Gizmos are now more stable to work with
  - Render loop structure is now complete with static resources that can be easily accessed via the GPU controller
  - Textures are now single instance based.
  - Materials also are now controlled by GPU controller
- Viewport picking
  - Due to changes in render structure and buffer layouts picking is faster and more reliable


## Bug fixes
- Viewport picking not working most of the time
- Home key not moving camera correctly
- Shader editor compiler not working in some cases
- Selector showing deleted files
- When saving material the instance is not updated
- Linking mesh to component causes error

## Other
- Visual refinements to themes and buttons/inputs
- Selector visual simplified