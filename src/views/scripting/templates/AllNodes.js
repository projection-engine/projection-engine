import styles from "../styles/Available.module.css";
import SetWorldRotation from "../nodes/translation/SetWorldRotation";
import SetWorldTranslation from "../nodes/translation/SetWorldTranslation";
import GetWorldTranslation from "../nodes/translation/GetWorldTranslation";
import GetWorldRotation from "../nodes/translation/GetWorldRotation";
import QuaternionToEuler from "../nodes/QuaternionToEuler";


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
    }
]