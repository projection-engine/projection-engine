import ProjectLoader from "../../../services/workers/ProjectLoader";
import EVENTS from "../../../services/utils/misc/EVENTS";

export default function getOptions(executingAnimation, setExecutingAnimation, engine, save, fileSystem, load, setAlert) {
    return [
        {
            label: 'Save',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>save</span>,
            onClick: () => save()

        },
        {
            label: executingAnimation ? 'Stop simulation' : 'Play simulation',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>{executingAnimation ? 'pause' : 'play_arrow'}</span>,
            onClick: () => setExecutingAnimation(prev => !prev)
        },
        {
            group: 'b',
            label: 'Reload materials',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>refresh</span>,
            onClick: async () => {
                load.pushEvent(EVENTS.LOADING_MATERIAL)
                await ProjectLoader.loadMaterials(engine.materials.map(m => m.id), fileSystem, engine.gpu, engine.materials)
                load.finishEvent(EVENTS.LOADING_MATERIAL)
            }

        },
        {
            group: 'b',
            label: 'Reload Scripts',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>refresh</span>,
            onClick: async () => {
                engine.setScripts(await ProjectLoader.loadScripts(engine.scripts.map(m => m.id), fileSystem, engine.gpu, engine.scripts))
                setAlert({message: 'Scripts reloaded', type: 'success'})
            }

        },
        {
            group: 'b',
            label: 'Rebuild cubemaps',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>refresh</span>,
            onClick: async () => engine.renderer.recompiled = false
        }
    ]
}