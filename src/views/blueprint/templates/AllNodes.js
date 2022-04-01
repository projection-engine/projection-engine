import SetWorldRotation from "../nodes/transformation/SetWorldRotation";
import SetWorldTranslation from "../nodes/transformation/SetWorldTranslation";
import GetWorldTranslation from "../nodes/transformation/GetWorldTranslation";
import GetWorldRotation from "../nodes/transformation/GetWorldRotation";
import QuaternionToEuler from "../nodes/transformation/QuaternionToEuler";
import Add from "../nodes/operators/math/Add";
import Subtract from "../nodes/operators/math/Subtract";
import Multiply from "../nodes/operators/math/Multiply";
import Divide from "../nodes/operators/math/Divide";
import ToVector from "../nodes/operators/conversions/ToVector";
import FromVector from "../nodes/operators/conversions/FromVector";
import SetLocalRotation from "../nodes/transformation/SetLocalRotation";
import SetTransformationRelativeOrigin from "../nodes/transformation/SetTransformationRelativeOrigin";
import Print from "../nodes/utils/Print";
import Xor from "../nodes/operators/boolean/Xor";
import Or from "../nodes/operators/boolean/Or";
import NotEqual from "../nodes/operators/boolean/NotEqual";
import Not from "../nodes/operators/boolean/Not";
import Nor from "../nodes/operators/boolean/Nor";
import Nand from "../nodes/operators/boolean/Nand";
import LessEqual from "../nodes/operators/boolean/LessEqual";
import Less from "../nodes/operators/boolean/Less";
import GreaterEqual from "../nodes/operators/boolean/GreaterEqual";
import Greater from "../nodes/operators/boolean/Greater";
import Equal from "../nodes/operators/boolean/Equal";
import And from "../nodes/operators/boolean/And";
import Branch from "../nodes/operators/boolean/Branch";
import EventTick from "../nodes/events/EventTick";
import RandomFloat from "../nodes/utils/RandomFloat";
import RandomInt from "../nodes/utils/RandomInt";
import MousePosition from "../nodes/events/MousePosition";
import MouseY from "../nodes/events/MouseY";
import MouseX from "../nodes/events/MouseX";
import Cos from "../nodes/operators/math/Cos";
import Sin from "../nodes/operators/math/Sin";
import ACos from "../nodes/operators/math/ACos";
import ASin from "../nodes/operators/math/ASin";
import Tan from "../nodes/operators/math/Tan";
import ATan from "../nodes/operators/math/ATan";
import Mod from "../nodes/operators/math/Mod";
import Abs from "../nodes/operators/math/Abs";
import KeyPress from "../nodes/events/KeyPress";


export const allNodes = [
    {
        label: 'Event Tick',
        dataTransfer: 'EventTick',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new EventTick()
    },

    {
        label: 'Get world rotation',
        dataTransfer: 'GetWorldRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GetWorldRotation()
    },
    {
        label: 'Get world translation',
        dataTransfer: 'GetWorldTranslation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GetWorldTranslation()
    },
    {
        label: 'Set world rotation',
        dataTransfer: 'SetWorldRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetWorldRotation()
    },
    {
        label: 'Set world translation',
        dataTransfer: 'SetWorldTranslation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetWorldTranslation()
    },
    {
        label: 'Quaternion to Euler',
        dataTransfer: 'QuaternionToEuler',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new QuaternionToEuler()
    },
    {
        label: 'Add',
        dataTransfer: 'Add',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Add()
    }
    ,
    {
        label: 'Subtract',
        dataTransfer: 'Subtract',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Subtract()
    },
    {
        label: 'Multiply',
        dataTransfer: 'Multiply',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Multiply()
    },
    {
        label: 'Divide',
        dataTransfer: 'Divide',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Divide()
    } ,


    {
        label: 'ToVector',
        dataTransfer: 'ToVector',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new ToVector()
    },
    {
        label: 'FromVector',
        dataTransfer: 'FromVector',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new FromVector()
    },
    {
        label: 'SetLocalRotation',
        dataTransfer: 'SetLocalRotation',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetLocalRotation()
    },
    {
        label: 'SetTransformationRelativeOrigin',
        dataTransfer: 'SetTransformationRelativeOrigin',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new SetTransformationRelativeOrigin()
    },
    {
        label: 'Print',
        dataTransfer: 'Print',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Print()
    },



    {
        label: 'Branch',
        dataTransfer: 'Branch',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Branch()
    },
    {
        label: 'And',
        dataTransfer: 'And',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new And()
    },
    {
        label: 'Equal',
        dataTransfer: 'Equal',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Equal()
    },
    {
        label: 'Greater',
        dataTransfer: 'Greater',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Greater()
    },
    {
        label: 'GreaterEqual',
        dataTransfer: 'GreaterEqual',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new GreaterEqual()
    },
    {
        label: 'Less',
        dataTransfer: 'Less',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Less()
    },
    {
        label: 'LessEqual',
        dataTransfer: 'LessEqual',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new LessEqual()
    },
    {
        label: 'Nand',
        dataTransfer: 'Nand',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Nand()
    },
    {
        label: 'Nor',
        dataTransfer: 'Nor',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Nor()
    },

    {
        label: 'Not',
        dataTransfer: 'Not',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Not()
    },
    {
        label: 'NotEqual',
        dataTransfer: 'NotEqual',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new NotEqual()
    },
    {
        label: 'Or',
        dataTransfer: 'Or',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Or()
    },
    {
        label: 'Xor',
        dataTransfer: 'Xor',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Xor()
    },

    {
        label: 'Random Float',
        dataTransfer: 'RandomFloat',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new RandomFloat()
    },

    {
        label: 'Random Int',
        dataTransfer: 'RandomInt',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new RandomInt()
    },


    {
        label: 'Mouse X',
        dataTransfer: 'MouseX',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new MouseX()
    },

    {
        label: 'Mouse Y',
        dataTransfer: 'MouseY',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new MouseY()
    },

    {
        label: 'Mouse Position',
        dataTransfer: 'MousePosition',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new MousePosition()
    },



    {
        label: 'Cosine',
        dataTransfer: 'Cos',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Cos()
    },
    {
        label: 'Sine',
        dataTransfer: 'Sin',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Sin()
    },
    {
        label: 'Arc Cosine',
        dataTransfer: 'ACos',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new ACos()
    },
    {
        label: 'Arc Sine',
        dataTransfer: 'ASin',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new ASin()
    },
    {
        label: 'Tangent',
        dataTransfer: 'Tan',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Tan()
    },
    {
        label: 'Arc Tangent',
        dataTransfer: 'ATan',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new ATan()
    },
    {
        label: 'Modulo',
        dataTransfer: 'Mod',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Mod()
    },   {
        label: 'Absolute',
        dataTransfer: 'Abs',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new Abs()
    },
    {
        label: 'Key Press',
        dataTransfer: 'KeyPress',
        tooltip: 'TODO',
        icon: <span className={'material-icons-round'}>functions</span>,
        getNewInstance: () => new KeyPress()
    },
]
