export default function getOptions(executingAnimation, setExecutingAnimation, engine, save,openLevelBlueprint) {
    return [
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
            onClick: async () => engine.renderer.recompiled = false
        },
        {
            group: 'Edit level blueprint',
            label: 'Edit level blueprint',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>foundation</span>,
            onClick: async () => openLevelBlueprint()
        }
    ]
}