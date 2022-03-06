import ProjectLoader from "../../../services/workers/ProjectLoader";
import EVENTS from "../../../services/utils/misc/EVENTS";

export default function getOptions(executingAnimation, setExecutingAnimation, engine, save, fileSystem, load) {
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
                engine.setMaterials(await ProjectLoader.loadMaterials(engine.materials.map(m => m.id), fileSystem, engine.gpu))
                load.finishEvent(EVENTS.LOADING_MATERIAL)
            }

        },
    ]
}