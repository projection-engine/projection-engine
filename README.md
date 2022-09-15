commit 5ef36ce1064a95535ce3e9f096d497f9e1eb74b4
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Thu Sep 15 18:14:51 2022 -0300

    - Removing "console.log"

commit d290c5f004ac91efbe5ea87d4f8c9979230e4dda
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Thu Sep 15 18:07:19 2022 -0300

    - Bug fix: Sprite renderer still renders disabled entity
    - Optimization: CameraAPI allocating new array for every update loop
    - Optimization: CameraAPI staticViewMatrix changed from a getter to an actual matrix
    - Bug fix: Fixed material instance when initializing texture error occurs due to it not having required attributes
    - Added timeout to BundlerAPI.packageLights
    - Fixed directional light shadows update
    - ShadowMapPass reworked to integrate with BundlerAPI
    - Range input pointer lock fixed
    - Directional light matrix updates when packaging lights
    - Fixed broken deferred shaders due to point light not being included on array

commit 5aaaaab4eace996f2956bceaf2e72d882047c992
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Thu Sep 15 15:51:59 2022 -0300

    - Fixed hierarchy node hard to select;
    - Improvements to engine store
    - Reworked bundlerAPI to integrate with scripts (ability ton spawn or de-spawn entities)
    - Fixed register physics body
    - Localization for physics components
    - Fixed multi-deletion of entities
    - Fixed color picker auto-submit
    - Fixed material instance initialization
    - Material compilation process changed to improve inspector experience
    - Added color picker to material inspector
    - Material instance now loads with level
    - Changing levels now clears action history and selection

commit 0cb50090b3c2d90d6ee39a81fa47f84cb188c000
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Wed Sep 14 21:51:16 2022 -0300

    - Translation gizmo now shows line for single axis transformation
    - LineAPI changed to support 3 initial directions
        - X - `LineAPI.draw([1, 0, 0])`
        - Y - `LineAPI.draw([0, 1, 0])`
        - Z - `LineAPI.draw([0, 0, 1])`
    - Added line shader to GIZMO.glsl

commit 147678d997efec44dfdf9c7b49db9ed017c32531
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Wed Sep 14 20:01:41 2022 -0300

    - Tweaks to rendering structure
    - SSGI fixed
    - Depth reconstructed normal fixed

commit 78adcb5e8c90d7cc0d2925ed96ad2914f657c615
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Wed Sep 14 16:31:50 2022 -0300

    - Fixed script executing before engine environment change
    - Mouse picking inconsistencies fixed
    - Fixed import error on editor layout
    - Removing "console.log" throughout the code

commit 498b86c4c018b5c592cc44eb23ae1063b197b8ae
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Wed Sep 14 16:00:12 2022 -0300

     - Fixing bugs
     -

commit 96fa6e7de79372f5ab644c4c19f4a484443cd012
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Wed Sep 14 11:17:52 2022 -0300

    - Initializing material instance structure
    - Fixed bugs related to transformation threads
    - Fixing buffer layout shifted by 1 index
    - Fixing shader editor RGB node dividing color by 255
    - Reactivating error logger

commit 2989851443c6eb7d0965f551b8daf5f0317504f0
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Tue Sep 13 18:33:38 2022 -0300

    - Collision element visualization changed

commit 3980558aa5c2b38c3c7f0fc60ef691d557942a0a
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Tue Sep 13 16:26:32 2022 -0300

    - Movement structure reworked
    - Multi-thread support for transformation
    - Rollup configuration extended to support workers and minimized electron backend
    - Enabled SharedArrayBuffer
    - Shared array buffer integrated with Movable element
    - Code better organized now

commit bd83b8f15054b1b5793cac697830d51d146dae2f
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Mon Sep 12 16:32:53 2022 -0300

    - Inspector view for mesh file

commit 76604cedcc7a9f1f7893aa7be610e7ce3aba16da
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Mon Sep 12 15:50:36 2022 -0300

    [MIX] - [Wireframe for collision]

commit 3312dd26e8e82d5a489366ac2b39940d34fe69e6
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Mon Sep 12 11:14:00 2022 -0300

    [MIX] - [Initial AmmoJS physics implementation; Fixes to play/stop states; Fixed removal of components; Reworked colliders]

commit 95c9541ada898fbf5d6dcb9bfc73d2e65bbe4915
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Mon Sep 12 08:31:15 2022 -0300

    [MIX] - [Multiple changes, see commit notes for more info]

commit bd07ad5c9d36917830f2e827d73c868fb592dc1f
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Sat Sep 10 15:58:59 2022 -0300

    [MIX] - [Code refactor; Visual rework for inspector, checkbox and accordion; Adding undo button to array type (inspector of entity component);]

commit 76df94d991a8570778c7f79e757399d044eacb3c
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Sat Sep 10 13:30:57 2022 -0300

    Organizing repository

commit 23abed4bde253122ae305e8c9c6ec5db1737430d
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Fri Sep 9 17:22:20 2022 -0300

    [MIX] - [Color input rework; Initializing physics components; Fixing point light form; Implementing light update for inspector;]

commit 94bb00e91f6dfd6ca047686b24407d091eb124f5
Author: facobackup <gustavomicaelbarbosa@gmail.com>
Date:   Fri Sep 9 14:32:33 2022 -0300

    [MIX] - [Gizmo and 3D cursor transformation in screen space fixed]
