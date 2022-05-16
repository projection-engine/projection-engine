import {useMemo} from "react";

export default function useOptions(executingAnimation, setExecutingAnimation, engine, save, openLevelBlueprint, setAlert) {
    return useMemo(() => {
        return  [
            {
                label: 'Save',
                icon: <span className={'material-icons-round'}
                            style={{fontSize: '1.2rem'}}>save</span>,
                onClick: () => save()

            },
            {
                label: executingAnimation ? 'Stop' : 'Play',
                icon: <span className={'material-icons-round'}
                            style={{fontSize: '1.2rem'}}>{executingAnimation ? 'pause' : 'play_arrow'}</span>,
                onClick: () => setExecutingAnimation(prev => !prev)
            },
            {
                group: 'b',
                label: 'Rebuild cubemaps',
                icon: <span className={'material-icons-round'}
                            style={{fontSize: '1.2rem'}}>refresh</span>,
                onClick: async () => {

                    setAlert({message: 'Recompiling cubemaps', type: 'info'})
                    engine.renderer.refreshCubemaps()
                }
            },
            {
                group: 'Edit level blueprint',
                label: 'Edit level blueprint',
                icon: <span className={'material-icons-round'}
                            style={{fontSize: '1.2rem'}}>foundation</span>,
                onClick: async () => openLevelBlueprint()
            }
        ]
    }, [engine.entities, engine.scripts, engine.meshes, engine, executingAnimation])
}