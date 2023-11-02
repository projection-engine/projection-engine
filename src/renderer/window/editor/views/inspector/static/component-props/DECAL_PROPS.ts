import MATERIAL_RENDERING_TYPES from "@engine-core/static/MATERIAL_RENDERING_TYPES"
import {boolean, group, imageTexture, number, options} from "./prop-types";
import DecalComponent from "@engine-core/lib/components/DecalComponent";

export default [
	group("RENDERING_MODE", [
		options("renderingMode", [
			{
				label:"Isotropic",
				value: MATERIAL_RENDERING_TYPES.ISOTROPIC
			},
			{
				label:"Anisotropic",
				value: MATERIAL_RENDERING_TYPES.ANISOTROPIC
			},
			{
				label:"Sheen",
				value: MATERIAL_RENDERING_TYPES.SHEEN
			},
			{
				label: "Clear-coat",
				value: MATERIAL_RENDERING_TYPES.CLEAR_COAT
			}
		]),
	]),

	group("SHEEN_PARAMS", [
		number("SHEEN", "sheen"),
		number("TINT", "sheenTint"),
	], comp => (<DecalComponent>comp).renderingMode !== MATERIAL_RENDERING_TYPES.SHEEN),

	group("CLEAR_COAT_PARAMS", [
		number("CLEAR_COAT", "clearCoat"),
	], comp => (<DecalComponent>comp).renderingMode !== MATERIAL_RENDERING_TYPES.CLEAR_COAT),

	group("ANISOTROPIC_PARAMS", [
		number("ROTATION", "anisotropicRotation"),
		number("ANISOTROPY", "anisotropy", 1, 0)
	], comp => (<DecalComponent>comp).renderingMode !== MATERIAL_RENDERING_TYPES.ANISOTROPIC),

	group("ALBEDO", [
		imageTexture("ALBEDO", "albedoID"),
	]),
	group("METALLIC", [
		imageTexture("METALLIC", "metallicID"),
	]),
	group("ROUGHNESS", [
		imageTexture("ROUGHNESS", "roughnessID"),
	]),
	group("AO", [
		imageTexture("AO", "occlusionID"),
	]),
	group("NORMAL", [
		imageTexture("NORMAL", "normalID"),
	]),
	group("SSR", [
		boolean("ENABLED", "useSSR"),
	]),

]
