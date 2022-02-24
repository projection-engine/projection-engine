import {ENTITY_ACTIONS} from "../../../services/engine/utils/entityReducer";
import PointLightComponent from "../../../services/engine/ecs/components/PointLightComponent";
import Entity from "../../../services/engine/ecs/basic/Entity";
import SkyboxComponent from "../../../services/engine/ecs/components/SkyboxComponent";
import DirectionalLightComponent from "../../../services/engine/ecs/components/DirectionalLightComponent";
import CubeMapComponent from "../../../services/engine/ecs/components/CubeMapComponent";
import SpotLightComponent from "../../../services/engine/ecs/components/SpotLightComponent";
import TerrainComponent from "../../../services/engine/ecs/components/TerrainComponent";


export default function getOptions(executingAnimation, setExecutingAnimation, engine, save) {
    return [
        {
            group: 'a',
            label: 'Save',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>save</span>,
            onClick: () => save()

        },
        {
            group: 'a',
            label: executingAnimation ? 'Stop simulation' : 'Play simulation',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>{executingAnimation ? 'pause' : 'play_arrow'}</span>,
            onClick: () => setExecutingAnimation(prev => !prev)
        },
        {
            group: 'b',
            label: 'Create',
            type: 'dropdown',
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>add_circle_outline</span>,
            options: [
                {
                    group: 'Lights',
                    label: 'New Point light',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>lightbulb</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Point light')
                        actor.components.PointLightComponent = new PointLightComponent()
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                },

                {
                    group: 'Lights',
                    label: 'New Spot light',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>flashlight_on</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Point light')
                        actor.components.DirectionalLightComponent = new PointLightComponent()
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                },
                {
                    group: 'Lights',
                    label: 'New Directional light',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>light_mode</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Directional light')
                        actor.components.DirectionalLightComponent = new DirectionalLightComponent()
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                },
                {
                    group: 'Lights',
                    label: 'New Skybox',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>cloud</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Skybox')
                        actor.components.SkyboxComponent = new SkyboxComponent(undefined, engine.gpu)
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})

                    }
                },
                {
                    group: 'Lights',
                    label: 'New Cubemap',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>panorama_photosphere</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Cubemap')
                        actor.components.CubeMapComponent = new CubeMapComponent()
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                },
                {
                    group: 'Lights',
                    label: 'New Terrain',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>terrain</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'terrain')
                        actor.components.TerrainComponent = new TerrainComponent()
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                    }
                },
            ],
        },
        {
            group: 'b',
            label: 'Scripting',
            type: 'dropdown',
            options: [{
                label: 'New MaterialInstance',
                icon: <span className={'material-icons-round'}
                            style={{fontSize: '1.2rem'}}>public</span>,
                onClick: () => null
            }],
            icon: <span className={'material-icons-round'}
                        style={{fontSize: '1.2rem'}}>account_tree</span>
        }
    ]
}