import { ElementProperty } from "../../../recordTypes/Element";
import { BasicElement, ElementType, IElementDefinition } from "../ElementDefinition";

export const Screenshare3D: IElementDefinition = {
  element_type: ElementType.screenshare_3d,
  elementDefaultName: "3D Screenshare",
  properties: [
    ...BasicElement.properties,
    ElementProperty.opacity,
    ElementProperty.hidden,
    ElementProperty.locked,
    ElementProperty.hover_animation,
    ElementProperty.placer_3d,
    ElementProperty.wh,
    ElementProperty.scale,
    ElementProperty.billboarding,
  ],
  defaultOverrides: {
    [ElementProperty.opacity]: 1,
  },
  events: [],
  actions: []
}
