import { ElementProperty } from "../../../recordTypes/Element";
import { BasicElement, ElementType,  IElementDefinition } from "../ElementDefinition";

export const Group: IElementDefinition = {
  element_type: ElementType.group,
  elementDefaultName: "Group",
  properties: [
    ...BasicElement.properties,
    ElementProperty.hidden,
    ElementProperty.locked,
    ElementProperty.placer_3d,
    ElementProperty.scale,
    ElementProperty.billboarding,
  ],
  defaultOverrides: {
    [ElementProperty.placer_3d]: [0, 0, 0, 0, 0, 0, 1, 1, 1]
  },
  events: [],
  actions: []
}
