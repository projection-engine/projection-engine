import styles from "../styles/Available.module.css";
import SetWorldRotation from "../nodes/transformation/SetWorldRotation";
import SetWorldTranslation from "../nodes/transformation/SetWorldTranslation";
import GetWorldTranslation from "../nodes/transformation/GetWorldTranslation";
import GetWorldRotation from "../nodes/transformation/GetWorldRotation";
import QuaternionToEuler from "../nodes/QuaternionToEuler";
import Add from "../nodes/basic/Add";
import Subtract from "../nodes/basic/Subtract";
import Multiply from "../nodes/basic/Multiply";
import Divide from "../nodes/basic/Divide";
import ToVector from "../nodes/basic/ToVector";
import FromVector from "../nodes/basic/FromVector";
import SetLocalRotation from "../nodes/transformation/SetLocalRotation";
import SetTransformationRelativeOrigin from "../nodes/transformation/SetTransformationRelativeOrigin";


export const allNodes = [
    {
        label: <label className={styles.label}>Get world rotation</label>,
        dataTransfer: 'GetWorldRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GetWorldRotation()
    },
    {
        label: <label className={styles.label}>Get world translation</label>,
        dataTransfer: 'GetWorldTranslation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GetWorldTranslation()
    },
    {
        label: <label className={styles.label}>Set world rotation</label>,
        dataTransfer: 'SetWorldRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetWorldRotation()
    },
    {
        label: <label className={styles.label}>Set world translation</label>,
        dataTransfer: 'SetWorldTranslation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetWorldTranslation()
    },
    {
        label: <label className={styles.label}>Quaternion to Euler</label>,
        dataTransfer: 'QuaternionToEuler',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new QuaternionToEuler()
    },
    {
        label: <label className={styles.label}>Add</label>,
        dataTransfer: 'Add',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Add()
    }
    ,
    {
        label: <label className={styles.label}>Subtract</label>,
        dataTransfer: 'Subtract',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Subtract()
    },
    {
        label: <label className={styles.label}>Multiply</label>,
        dataTransfer: 'Multiply',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Multiply()
    },
    {
        label: <label className={styles.label}>Divide</label>,
        dataTransfer: 'Divide',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Divide()
    } ,


    {
        label: <label className={styles.label}>ToVector</label>,
        dataTransfer: 'ToVector',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new ToVector()
    },
    {
        label: <label className={styles.label}>FromVector</label>,
        dataTransfer: 'FromVector',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new FromVector()
    },
    {
        label: <label className={styles.label}>SetLocalRotation</label>,
        dataTransfer: 'SetLocalRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetLocalRotation()
    },
    {
        label: <label className={styles.label}>SetTransformationRelativeOrigin</label>,
        dataTransfer: 'SetTransformationRelativeOrigin',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetTransformationRelativeOrigin()
    }
]