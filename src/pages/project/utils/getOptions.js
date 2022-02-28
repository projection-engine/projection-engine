import {ENTITY_ACTIONS} from "../../../services/utils/entityReducer";
import PointLightComponent from "../../../services/engine/ecs/components/PointLightComponent";
import Entity from "../../../services/engine/ecs/basic/Entity";
import SkyboxComponent from "../../../services/engine/ecs/components/SkyboxComponent";
import DirectionalLightComponent from "../../../services/engine/ecs/components/DirectionalLightComponent";
import CubeMapComponent from "../../../services/engine/ecs/components/CubeMapComponent";
import TerrainComponent from "../../../services/engine/ecs/components/TerrainComponent";


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