# v4.1.1-alpha

## Additions
- View state serialization:
  - When switching between tabs, views will save their current state (only applicable to shader editor for now)
- Material file uniform change via inspector
- GPU texture allocation checkup when updating material (removes unused textures)
- F5 hotkey to content browser (refresh files)
- Range input now shows option: revert to original value (after change)

## Reworks
- Skybox pass projection matrix now follows camera projection (except clipping planes)
- Grid rendering order, now it will always be rendering in front of whatever background is being drawn
- Background pass will now be disabled if a skybox material is active
- glTF importer material loading: Now a simple initial PBR material will be initialized (needs compilation)
- Inspector now interacts better with content browser, showing file metadata and other resources like: code if item is a component or material uniforms if is a material etc.

## Bug fixes
- Skybox projection
- Grid not rendering when skybox is active
- Wrong version showing on bottom right corner

