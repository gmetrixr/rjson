import { ElementProperty } from "../../../recordTypes/Element";
import { IElementDefinition, ElementType, BasicElement } from "../ElementSubTypes";

export const Hotspot: IElementDefinition = {
  element_type: ElementType.hotspot,
  elementDefaultName: "Hotspot",
  properties: [
    ...BasicElement.properties,
    ElementProperty.icon_name,
    ElementProperty.heading,
    ElementProperty.description,
    ElementProperty.always_open,
    ElementProperty.source,
    ElementProperty.placer_3d,
    ElementProperty.scale,
    ElementProperty.opacity,
    ElementProperty.target_scene_id
  ],
  defaultOverrides: {},
  events: [],
  actions: []
}