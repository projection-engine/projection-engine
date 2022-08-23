## v3.0.0-Alpha

### Additions:
- UI hierarchy/store and render loop
- Level system
- UI Renderer and preview tab for UI
- QueryAPI for UI elements and engine entities
- ViewportEventsAPI for controlling event listeners related to the viewport
- CSS and HTML (.ui) files for UI layouts
- CameraAPI was created to be a singleton reference for the engine camera and provides utility methods for camera movement.
- Added component filter for entity hierarchy

### Reworks:
- Backend of file system was completely rewritten
- Mesh, materials and FBOs now tracks active resources to prevent unnecessary API calls
- Gizmos are now better structured  
- Entities and UI elements are now stored inside level file instead of separate folder (/logic)
- Camera system was rewritten to be a singleton.
- Window frame is now more minimal and a new control bar was added bellow it. 

### Fixes:
- Hierarchy search not working
- Camera icon not showing on hierarchy