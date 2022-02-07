import {ENTITY_ACTIONS} from "../../../services/engine/ecs/utils/entityReducer";
import PointLightComponent from "../../../services/engine/ecs/components/PointLightComponent";
import Entity from "../../../services/engine/ecs/basic/Entity";
import SkyboxComponent from "../../../services/engine/ecs/components/SkyboxComponent";
import DirectionalLightComponent from "../../../services/engine/ecs/components/DirectionalLightComponent";
import CubeMapComponent from "../../../services/engine/ecs/components/CubeMapComponent";
import SpotLightComponent from "../../../services/engine/ecs/components/SpotLightComponent";


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
            onClick: () => setExecutingAnimation(!executingAnimation)
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
                        const lightActor = new Entity(undefined, 'Point light entity')
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: lightActor})
                        engine.dispatchEntities({
                            type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                                entityID: lightActor.id,
                                data: new PointLightComponent()
                            }
                        })

                    }
                },

                {
                    group: 'Lights',
                    label: 'New Spot light',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>flashlight_on</span>,
                    onClick: () => {
                        const lightActor = new Entity(undefined, 'Point light entity')
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: lightActor})
                        engine.dispatchEntities({
                            type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                                entityID: lightActor.id,
                                data: new SpotLightComponent()
                            }
                        })
                    }
                },
                {
                    group: 'Lights',
                    label: 'New Directional light',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>light_mode</span>,
                    onClick: () => {
                        const lightActor = new Entity(undefined, 'Directional light entity')
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: lightActor})
                        engine.dispatchEntities({
                            type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                                entityID: lightActor.id,
                                data: new DirectionalLightComponent()
                            }
                        })
                    }
                },
                {
                    group: 'Lights',
                    label: 'New Skybox',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>cloud</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Skybox')
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                        engine.dispatchEntities({
                            type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                                entityID: actor.id,
                                data: new SkyboxComponent(undefined, engine.gpu)
                            }
                        })
                    }
                },
                {
                    group: 'Lights',
                    label: 'New Cubemap',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>panorama_photosphere</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'New Cubemap')
                        engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                        engine.dispatchEntities({
                            type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                                entityID: actor.id,
                                data: new CubeMapComponent()
                            }
                        })
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