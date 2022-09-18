commit 03142e07d37be9e00cd20a05e441328f4063232e
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Sat Sep 17 20:53:07 2022 -0300

    - Release v5.1.0-alpha

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
