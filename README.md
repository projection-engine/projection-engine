# v3.2.0-alpha
## Additions
- Dual axis gizmos for scaling and translation
- New conversion method (world to screen space) for Conversion API
- GPU class structure with frame-buffer/mesh/shader and instancing controller
- Cube/Sphere/Plane and cylinder embedded meshes
- Integration of embedded resources with selector
- Save hot-key for project (previously present but was removed on the newest version due to some bug)
- Automatic entity locking (First entity)
- Editor error logging (Enabled by default)

## Reworks
- Transformation structure for entities
- Engine backend completely rewritten to be much faster
  - Quad instance reworked to be a singleton
  - Instancing now is a dedicated class with better tracking for buffer refresh
  - GPU class to control all instances related to context
  - Essential services are now static classes instead of instances (reduces object navigation for many resources)
- Board scroll on shader editor
- Gizmo structure
  - Singletons for all gizmos.
  - Gizmo manipulation now occurs in screen space (translation and scaling) instead of static X axis movement
  - Transformation tooltip now works better.
  - Manipulation grid now affects dual and triple axis gizmos

## Bug fixes
- Gizmo translation makes 3D cursor to move
- Image loading not working
- Screen-space gizmos not working as intended