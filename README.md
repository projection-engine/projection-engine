# Projection engine

The **Projection Engine** is a 3D graphics engine designed and written from ground up to be multi-platform and easy to use.

## 1. Screenshots

|                                                  Simple scene                                                  |                                                  Material editor                                                   |
|:--------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------:|
| <img src="https://github.com/projection-engine/.github/blob/main/SCENE 2.png?raw=true" alt="Editor material"/> | <img src="https://github.com/projection-engine/.github/blob/main/Material v2.png?raw=true" alt="Editor material"/> |

|                                    Parallax occlusion mapping                               |                            Light propagation volumes global illumination (dev)                             |
|:--------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------:|
|  <img src="https://github.com/projection-engine/.github/blob/main/True parallax.png?raw=true"  title="Parallax occlusion mapping" alt="demo"/> | <img src="https://github.com/projection-engine/.github/blob/main/EEE.png?raw=true" alt="Editor material"/> |

|                                    Directional and omnidirectional shadows                                     |                            Node-based Scripting                        |
|:--------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------:|
| <img src="https://github.com/projection-engine/.github/blob/main/OMNI.png?raw=true" alt="Editor material"/> | <img src="https://github.com/projection-engine/.github/blob/main/scripting.png?raw=true" alt="Editor material"/> |

## 2. History

This engine started as a solo project on my vacation, but it quickly grew to something bigger. I was initially inspired by blender and already
had some experience with Unreal Engine 4 and Unity, so I decided to invest some time creating my own game engine where I could build my projects on, so, december
last year the Projection Engine was born, since then many big features came into existence and many more are coming.

### 2.1 Internal goals
- Learn more about UI/UX
- Better myself with code optimization
- Learn deeply openGL/WebGL
- Apply the mathematical theory I learned in college
- Create something usable for more people

### 2.2 Current goals
- Ability to craft and distribute scenes and interactive experiences on the Web or as an application.
- Build a community around development with this tool and for it.
- Fast way to prototype and test scenes.
- Take in consideration what isn't as good or easy to work with in other tools and make it better if possible.


## 3. Features

Multiple features are already implemented or on the way to the editor, here is a list of some of those features:

### 3.1 Viewport

- **Manipulation**:
    - Transformation gizmos:
        - Rotation
        - Translation
        - Scaling
    - Entity picking
    - Hot keys
    - Multi select
    - Transformation for multiple entities
    - Individual manipulation grid for rotation, scaling and translation
    - Hierarchical transformation
- **Visualization**
    - Rendering modes for debug and ease of use
    - Entity highlight
    - Icons
    - World grid

### 3.2 Rendering
- **Post processing**
    - FXAA
    - Film grain
    - Chromatic aberration
    - Multi-step bloom
    - Lens distortion
- **Materials and PBR rendering**
    - Unlit
    - Forward and deferred renderers
    - Directional and omnidirectional shadows with PCF filtering
- **GI**
    - Light probes
    - Light propagation volumes (under development)
    - CubeMap specular reflections
- **Other**
    - SSAO with depth reconstruction for both forward a deferred shaded materials
    - Fully physically based pipeline with metallic workflow

### 3.3 Editor
- **File system**
    - Folders and files management
    - Bookmarks
    - Navigation shortcuts
    - Search
- **Scene structure**
    - Entity-component-system with hierarchical structure
    - Custom material uniforms editable via form
    - Folders and multi-select
    - Transformations and component attribute manipulation
- **Multi-tab system**
- **Shared GPU context for fast tab switching**
- **Parallel processing (IPC and workers)**
    - Project loading
    - glTF import
    - File system refreshes
    - Image processing

### 3.4 Blueprints
- **Scripts**
    - Multiple nodes for custom scripts
    - Compiled down to native language
- **Groups**
    - Color customization
    - Label
- **Materials**
    - Custom material/shader creation with nodes
    - Multiple pre-crafted functions
    - Compiled down to glsl
    - Custom program generator
    - Multiple rendering methods.
- **Custom scripts written in JS**

### 3.5 Under development
- **UI creation with raw html and css with visual scripting and JS scripting**
- **Performance optimizations**
  - Mesh culling
  - Light culling
  - Frustum culling
- **Physics with bullet**
- **Dynamic file streaming in production env**
- **GI methods**
  - LVP 
  - Pre-calculated irradiance probes
  - DSSDO (Deferred screen space direct occlusion)
- **Dynamic material vertex shader**
- **Ability to create custom system level implementations**
  - FrameBuffers
  - CubeMaps
  - Textures
  - Meshes
  - Shaders
  
### 4.5. Licence
The Projection Engine and all its modules are licenced under an MIT licence.

### 5. Community
- **Bugs - Feature request - Help**: [GitHub issues](https://github.com/projection-engine/editor/issues)
- **My personal discord**: morshu_non_rtx#8805
