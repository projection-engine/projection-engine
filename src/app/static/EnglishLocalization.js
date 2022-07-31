export default class EnglishLocalization {
    static HOME = {
        HOME: {
            DELETE: "Deleting project",
            RENAME: "Project renamed",
            RENAME_ERROR: "Error renaming project",
            LOADING: "Loading projects",
            TITLE: "Projection Engine",
            PROJECTS: "Your projects",
            CREATE: "New project",
            EMPTY: "No projects found",
            SEARCH: "Search",
            PROJECT_CREATED: "Project created"
        },

        CARD: {
            NEW_NAME: "New name",
            DELETE: "Delete",
            SHOW_IN_EXPLORER: "Show in explorer",
            NEVER: "Never",
            PROJECT: "Project",
            LAST_MODIFIED: "Last modified",
            CREATION: "Creation date",
            RECENT: "Recent"
        },

    }
    static HELP = {
        MAIN: {
            TITLE: "Projection Engine",
            CLOSE: "Close",
            BODY: `
            <strong>
            	v1.1.0 Alpha
			</strong>
			<br>
            <div>2022 | Gustavo Roque</div>
            `
        }
    }
    static SETTINGS = {
        MAIN: {
            TITLE: "Preferences"
        }
    }
    static PROJECT = {
        VIEWPORT: {
            ADD: "Add",
            ADD_DETAILS: "Add entity",
            CAMERA: "Camera",
            TITLE: "Viewport",
            ACTIVE_ENTITY: "Active Entity",
            DELETE_VIEW: "Delete view",
            NEW_TAB: "New Tab",
            POINT_LIGHT: "Point Light",
            DIRECTIONAL_LIGHT: "Directional Light",
            SPOT_LIGHT: "SpotLight",
            SPECULAR_PROBE: "Specular Probe",
            DIFFUSE_PROBE: "Diffuse Probe",
            UTILS: "Utils",
            AMBIENT: "Ambient",
            LIGHTS: "Lights",
            TOP: "Top",
            LEFT: "Left",
            RIGHT: "Right",
            BOTTOM: "Bottom",
            FRONT: "Front",
            BACK: "Back",
            SWITCH_PROJECTION: "Switch between last Ortho/Perspective",
            DRAG_X_ZOOM: "Drag X to zoom in/out",
            DRAG_X_DIR: "- Drag X to move forward/backwards",
            DRAG_Y_DIR: "- Drag Y to move up/down",
            DOUBLE_CLICK: "- Double click to center",
            VISIBLE: "Visible",
            GRID: "Grid",
            ICONS: "Icons",
            FPS: "Frames per second",
            CAM_ANIM: "Camera Animations",
            ICON_SIZE: "Icon size",
            SHADING_LIGHT: "Light only",
            SHADING_UNLIT: "Unlit",
            SHADING_NORMAL: "Normals",
            SHADING_DEPTH: "Scene Depth",
            SHADING_AO: "Ambient Occlusion",
            SHADING_DETAIL: "Details",
            SHADING_SWITCH: "Switching to details shading model",
            FAR: "Far plane",
            NEAR: "Near plane",
            FOV: "Field Of View",
            ZOOM: "Zoom",
            TRANSLATION_GRID: "Translation grid",
            SCALE_GRID: "Scale grid",
            ROTATION_GRID: "Rotation Grid",
            SELECTION: "Selection",
            CURSOR: "3D Cursor",
            T_GIZMO: "Translation gizmo",
            R_GIZMO: "Rotation gizmo",
            S_GIZMO: "Scale gizmo",
            BACKGROUND: "Background",
            INTENSITY:"Intensity",
            INTENSITY_COLOR: "Intensity & color"
        },
        HIERARCHY: {
            TITLE: "Hierarchy",
            NEW_FOLDER: "New Folder",
            SEARCH: "Search"
        },
        CONSOLE: {
            TITLE: "Console",
            CLEAR: "Clear"
        },
        SHADER_EDITOR: {
            ADD: "Add",
            COLOR: "Color",
            TITLE: "Shader Editor",
            SAVE: "Save",
            COMPILE: "Compile",
            SELECT: "Select",
            ALL: "All",
            NONE: "None",
            INVERT: "Invert",
            GRID: "Toggle movement grid",
            NAME: "Name",
            INFORMATION: "Information",
            NEEDS_COMPILATION: "Please compile the shader.",
            ERRORS: "Errors",
            NO_ERRORS: "No errors were found.",
            NODE: "Node",
            STATUS: "Status",
            SOURCE: "Source code",
            COMPILING: "Compiling shaders",
            NOT_APPLIED: "Mesh doesn't seem to be applied to a mesh.",
            SAVED: "Saved",
            ERROR: "Some error occurred"
        },
        COMPONENT_EDITOR: {
            ENABLED: "Enabled",
            RENDERING: "Rendering features",
            POST_PROCESSING: "Editor post-processing",
            TITLE: "Component editor",
            SCRIPTS: "Scripts",
            ORTHO_PROJECTION: "Orthographic projection",
            PROJECTION_SIZE: "Orthographic size",
            FOV: "Field Of View",
            VIEW_PLANES: "View Planes",
            FAR: "Far",
            NEAR: "Near",
            ENTITY_NAME: "Entity Name",
            STOP_SIMULATION: "Stop the simulation to change attributes.",
            TRANSLATION: "Translation",
            ROTATION: "Rotation",
            SCALING: "Scaling",
            RECOMPUTE_PROBES: "Probe re-computation needed",
            RESOLUTION: "Resolution",
            AA: "FXAA Anti-aliasing",
            SSR: "Screen space reflections",
            AO: "Ambient occlusion",
            STRENGTH: "Strength",
            STEP_SIZE: "Step size",
            STEPS: "Steps",
            SSGI: "Global illumination",
            SHADOWS: "Shadows",
            LIGHTS: "Lights",
            SMOOTHING_SAMPLES: "Smoothing samples",
            SAMPLES: "Samples",
            RADIUS: "Radius",
            FALLOFF: "Falloff",
            AREA: "Area",
            BASE: "Base",
            ATTENUATION: "Attenuation",
            CASTS_SHADOWS: "Casts shadows",
            SIZE: "Size",

        },
        FILES: {
            SEARCH: "Search",
            SELECT: "Select",
            TITLE: "Content Browser",
            EMPTY: "Empty folder",
            SELECT_ALL: "Select all",
            SELECT_NONE: "Select none",
            SELECT_INVERT: "Invert selection",
            BACK: "Back",
            DELETE: "Delete",

            CUT: "Cut",
            PASTE: "Paste",
            RENAME: "Rename",
            NEW_FOLDER: "New Folder",
            OPEN_WITH_EXPLORER: "Open with explorer",
            FORWARD: "Forward",
            REFRESH: "Refresh",
            REFRESHING: "Refreshing content-browser",
            GO_TO_PARENT: "Go to parent",
            NEW_SCRIPT: "New Script",
            NEW_MATERIAL: "New Material",

            ASSETS: "Assets",
            BOOKMARKS: "Bookmarks",
            IMPORT: "Import",
            SIDE_BAR: "Sidebar",
            OPTIONS: "Navigation options",
            VIEW: "View",
            BACK_DIR: "Action: Go back",
            FORWARD_DIR: "Action: Go forward",
            PARENT_DIR: "Action: Go to parent",
            CREATE_FOLDER: "Create folder",
            ADD_BOOKMARK: "Add folder to bookmarks",
            FILTER_TYPE: "Filter by file type"
        }
    }
    static COMPONENTS = {
        COLOR_PICKER: {
            CANCEL: "Cancel",
            ACCEPT: "Ok"
        },
        SEARCH: {
            SEARCH: "Search"
        },
        SELECTOR: {
            EMPTY: "Empty",
            NOTHING: "Nothing found",
            DEFAULT_MATERIAL: "Default material",
            REMOVE_SCRIPT: "Remove script",
            SEARCH: "Search"
        },
        VIEWS: {
            CLOSE: "Close",
            HIERARCHY: "Hierarchy",
            COMP_EDITOR: "Component Editor",
            CONTENT_BROWSER: "Content Browser",
            SHADER_EDITOR: "Shader Editor",
            CONSOLE: "Console"
        }
    }

}