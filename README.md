# 1.0 alpha
This release will mark the start of a new release schedule, new builds will come out weakly from now on.

This version is focused primarily on establishing a good and more optimized code structure for future releases.

With version 1.0 alpha many things were completely reworked and optimized, you can read through the list here:

## Reworks
### Scripting
  - Removed support for node based scripting due to increased complexity and poor performance on execution
  - JS scripting will now receive full attention, with APIs for working with network, transformation and other functionalities.
### Hotkeys
  - Under the hood everything was reworked to be much faster and efficient.
  - Mouse position context now works as intended
### Context menu
  - Better mouse capture
  - Reworked structure to be more efficient and fast
### Rendering loop
  - Reworked call structure and order to be faster and more reliable.
  - Transformations done on scripts will now apply on same frame instead of being spread across multiple
### Hierarchy 
  - Complete rewrite of hierarchy component, sorting and parenting is now done on separate thread.
  - DOM Element culling added to list to prevent slow-downs with multiple entities
  - Child entities and parent entity are now accessible from current entity instead of an ID reference.
### Entities and data structure
  - After benchmarks and multiple tests all entities are now stored on a `map` instead of an array.
  - All entities are available to be accessed from anywhere via `window.renderer.entities` or `window.renderer.entitiesMap`.
  - Meshes moved to a map too.
  - Due to this change less re-renders will occur on the editor increasing the performance in general
  - Light packaging completely changed to use a typed array, now every refresh will no longer re-allocate a buffer and will use the current one if available
### Skybox
  - Removed old skybox structure
  - Skybox focused material will be added on following versions
  - Added background to editor (following versions will add support to color change)
 
## Additions
### VIEWS:

Views will add support for hot-swap and creation of views on the editor, this functionality was inspired by blender and adds a new layer of flexibility to the editor.

### Tabs:

Tabs add support for serialization of your layout of views.

### Global illumination:

***Specular reflections*** via screen space reflections were added ( this feature is not working 100% as intended and will receive more updates ).

***Diffuse illumination*** are now possible via ***SSGI***. this is a scene independent method of capturing the bounce of light in screen space and works really well for colorful and vibrant scenes.

### Console 

Console window is now available as a view and adds support for `console.log` inside scripts.
