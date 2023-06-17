import LocalizationEN from "../../../../../contants/LocalizationEN";
import SettingsStore from "../../../../shared/stores/SettingsStore";
import SHADING_MODELS from "../../../../../engine-core/static/SHADING_MODELS";

export default function getShadingModels(settings) {
    return [
        {divider: true, label: LocalizationEN.MISC},
        {
            icon: "empty",
            label: LocalizationEN.SHADING_DETAIL,
            id: SHADING_MODELS.DETAIL,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DETAIL})
        },
        {
            icon: "empty",
            label: LocalizationEN.LIGHT_QUANTITY,
            id: SHADING_MODELS.LIGHT_QUANTITY,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_QUANTITY})
        },

        {divider: true, label: LocalizationEN.DEBUG_SHADING},
        {
            icon: "empty",
            label: LocalizationEN.SHADING_DEPTH,
            id: SHADING_MODELS.DEPTH,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.DEPTH})
        },
        {
            icon: "empty",
            label: LocalizationEN.SHADING_RANDOM,
            id: SHADING_MODELS.RANDOM,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.RANDOM})
        },
        {
            icon: "empty",
            label: LocalizationEN.LIGHT_COMPLEXITY,
            id: SHADING_MODELS.LIGHT_COMPLEXITY,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_COMPLEXITY})
        },
        {
            icon: "empty",
            label: LocalizationEN.POSITION,
            id: SHADING_MODELS.POSITION,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.POSITION})
        },
        {
            icon: "empty",
            label: LocalizationEN.SHADING_DYNAMIC_AO,
            id: SHADING_MODELS.AO,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.AO})
        },
        {
            icon: "empty",
            label: LocalizationEN.OVERDRAW,
            id: SHADING_MODELS.OVERDRAW,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.OVERDRAW})
        },

        {divider: true, label: LocalizationEN.MATERIAL},
        {
            icon: "empty",
            label: LocalizationEN.SHADING_UNLIT,
            id: SHADING_MODELS.ALBEDO,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ALBEDO})
        },
        {
            icon: "empty",
            label: LocalizationEN.SHADING_ROUGHNESS,
            id: SHADING_MODELS.ROUGHNESS,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.ROUGHNESS})
        },
        {
            icon: "empty",
            label: LocalizationEN.LIGHT_ONLY,
            id: SHADING_MODELS.LIGHT_ONLY,
            onClick: () => SettingsStore.updateStore({...settings, shadingModel: SHADING_MODELS.LIGHT_ONLY})
        }
    ]
}