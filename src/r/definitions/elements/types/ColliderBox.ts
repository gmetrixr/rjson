import { ElementProperty } from "../../../recordTypes/Element";
import { BasicElement, ElementType,  IElementDefinition } from "../ElementDefinition";

export const ColliderBox: IElementDefinition = {
  element_type: ElementType.collider_box,
  elementDefaultName: "ColliderVolume",
  properties: [
    ...BasicElement.properties,
    ElementProperty.hidden,
    ElementProperty.locked,
    ElementProperty.volume_type,
    ElementProperty.mouse_jump,
    ElementProperty.placer_3d,
    ElementProperty.whd,
    ElementProperty.scale,
  ],
  defaultOverrides: {},
  events: [],
  actions: []
}
