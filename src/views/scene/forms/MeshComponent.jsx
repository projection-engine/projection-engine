import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {Accordion, AccordionSummary, Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import styles from "../styles/Forms.module.css";
import Mesh from "../../../services/engine/renderer/elements/Mesh";


export default function MeshComponent(props) {

    const [hasPhysics, setHasPhysics] = useState({
        body: props.selected.components.PhysicsComponent !== undefined,
        collider: props.selected.components.SphereCollider !== undefined
    })
    const [currentMesh, setCurrentMesh] = useState()
    useEffect(() => {
        setCurrentMesh(props.quickAccess.meshes.find(mesh => mesh.id === props.selected.components.MeshComponent.meshID))
    }, [props.quickAccess.meshes, props.selected])

    return (
        <>
            <Accordion>
                <AccordionSummary className={styles.summary}>
                    Mesh
                </AccordionSummary>
                <div className={styles.wrapper} style={{display: 'grid', padding: '4px', gap: '4px'}}>
                    <Dropdown
                        disabled={props.quickAccess.meshes.length === 0}
                        className={styles.summary}
                        styles={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px !important',
                            width: '100%'
                        }}
                        variant={'outlined'}
                        justify={'start'} align={'bottom'}>
                        <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>view_in_ar</span>
                        {currentMesh ? currentMesh.name : 'Meshes'}
                        <DropdownOptions>
                            {props.quickAccess.meshes.map((m, i) => (
                                <React.Fragment key={'mesh-' + i}>
                                    <DropdownOption
                                        option={{
                                            label: m.name,
                                            icon: <span style={{fontSize: '1.2rem'}}
                                                        className={'material-icons-round'}>view_in_ar</span>,
                                            onClick: () => props.database.getBlob(m.id).then(b => {
                                                let data = props.engine.meshes.find(mesh => mesh.id === m.id)
                                                if (!data) {
                                                    const objLoaded = JSON.parse(b)
                                                    const newMesh = new Mesh({
                                                        ...objLoaded,
                                                        id: m.id,
                                                        gpu: props.engine.gpu,
                                                        maxBoundingBox: objLoaded.boundingBoxMax,
                                                        minBoundingBox: objLoaded.boundingBoxMin
                                                    })
                                                    props.engine.setMeshes(prev => [...prev, newMesh])
                                                    data = newMesh
                                                }

                                                props.submit(data.id)
                                            })
                                        }}/>
                                </React.Fragment>
                            ))}
                        </DropdownOptions>
                    </Dropdown>
                    {hasPhysics.body ?

                        <Dropdown

                            className={styles.summary}
                            styles={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px !important',
                                width: '100%'
                            }}
                            variant={'outlined'}
                            justify={'start'} align={'bottom'}>
                            <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>view_in_ar</span>
                            Meshes
                            <DropdownOptions>

                                <DropdownOption
                                    option={{
                                        label: 'Sphere collider',
                                        icon: <span style={{fontSize: '1.2rem'}}
                                                    className={'material-icons-round'}>check</span>,
                                        onClick: () => null, // TODO - submit collider
                                    }}/>
                                <DropdownOption
                                    option={{
                                        label: 'AABB collider',
                                        icon: <span
                                            style={{fontSize: '1.2rem'}}
                                            className={'material-icons-round'}>check</span>,
                                        onClick: () => null, // TODO - submit collider
                                    }}/>
                            </DropdownOptions>
                        </Dropdown>

                        :
                        <Button
                            onClick={() => {
                                props.submitPhysics(true)
                                setHasPhysics(prev => {
                                    return {
                                        ...prev,
                                        body: true
                                    }
                                })
                            }}
                            className={styles.button}
                            styles={{background: 'var(--background-2)'}}
                            variant={"outlined"}>
                            <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>add</span>
                            Attach physics body
                        </Button>
                    }
                    {hasPhysics.collider ?
                        <Dropdown
                            className={styles.summary}
                            styles={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px !important',
                                width: '100%'
                            }}
                            variant={'outlined'}
                            justify={'start'} align={'bottom'}>
                            <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>view_in_ar</span>
                            Meshes
                            <DropdownOptions>

                                <DropdownOption
                                    option={{
                                        label: 'Sphere collider',
                                        icon: <span style={{fontSize: '1.2rem'}}
                                                    className={'material-icons-round'}>check</span>,
                                        onClick: () => null, // TODO - submit collider
                                    }}/>
                                <DropdownOption
                                    option={{
                                        label: 'AABB collider',
                                        icon: <span
                                            style={{fontSize: '1.2rem'}}
                                            className={'material-icons-round'}>check</span>,
                                        onClick: () => null, // TODO - submit collider
                                    }}/>
                            </DropdownOptions>
                        </Dropdown>
                        :
                        <Button
                            onClick={() => {
                                props.submitPhysicsCollider(true)
                                setHasPhysics(prev => {
                                    return {
                                        ...prev,
                                        collider: true
                                    }
                                })
                            }}
                            className={styles.button}
                            styles={{background: 'var(--background-2)'}}
                            variant={"outlined"}>
                            <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>add</span>
                            Attach physics collider
                        </Button>
                    }
                </div>
            </Accordion>


        </>
    )
}

MeshComponent.propTypes = {
    quickAccess: PropTypes.object,
    database: PropTypes.object,
    engine: PropTypes.object,

    submitPhysicsCollider: PropTypes.func,
    meshes: PropTypes.array,
    submit: PropTypes.func,
    selected: PropTypes.object,
    submitPhysics: PropTypes.func
}