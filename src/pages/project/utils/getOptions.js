export default function getOptions(executingAnimation, setExecutingAnimation, engine, save) {
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

    ]
}