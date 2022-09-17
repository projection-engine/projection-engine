commit 4ea346c94922423c670744279a4332405d938fda
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Sat Sep 17 20:39:52 2022 -0300

    - Added inertia to rigid body
    - Fixed physics not updating state when starting play
    - Fixed negative values for collision component
    - Fixed box collider not rotating with entity
    - Fixed new project error initializing
    - CameraAPI is now integrated with a worker, all transformations are done there
    - Fixed rotation gizmo
    - Removed rotation/scaling locking
    - Fixed content browser scroll not re-setting when changing directories
    - Fixed renaming entity not updating hierarchy or inspector

commit b074c0c9ea36308cad31e592baa367700dabfcdf
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Sat Sep 17 17:12:44 2022 -0300

    - Reworked InputEventsAPI
    - Fixed physics pass not updating on time
    - Reworked UI component styles
    - Fixed multiple bugs related to play/stop state
    - Fixed bugs related to UI rendering

commit 06f64bca3d73f4b931466dbe8f29cfe7b138e508
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Fri Sep 16 22:47:55 2022 -0300

    - Fixed deletion hotkey
    - Fixed EditorLayout not removing click event listeners from viewport
    - Added UI header with some new options
    - Added UI context menu

commit 1c291d15d46000f74d739b4613394d9d29fb8988
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Fri Sep 16 15:03:55 2022 -0300

    - Completely new structure for managing components and entities with the BundlerAPI
      - Fixes component addition not affecting renderer
      - Fixed removal also not affecting renderer
    - Added new view for UI editing
    - Removed old UI entities structure and integrated with main engine entities as a component
    - UI component form
    - Added UI canvas interaction with hover and click
    - Fixed lockedEntity form not showing on inspector
    - Integrated inspector with UI layout file types
    - Added Label to code preview on inspector
    - Integration of the [Monaco Editor](https://github.com/microsoft/monaco-editor)
    - Fixed activation or deactivation of entity not causing engine to update component information (ex: lights not being included on shaders)
    - Deactivated entities will not be included on UI rendering
    - Added initialization state to CameraTracker
    - Fixed gizmo tooltip not showing
