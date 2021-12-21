import { ElementProperty } from "../../../recordTypes/Element";
import { RuleAction } from "../../rules";
import { BasicElement, ElementType,  IElementDefinition } from "../ElementSubTypes";

export const WayFinder: IElementDefinition = {
  element_type: ElementType.wayfinder,
  elementDefaultName: "Wayfinder",
  properties: [
    ...BasicElement.properties,
    ElementProperty.text,
    ElementProperty.color,
    ElementProperty.wayfinder_size
    ],
  defaultOverrides: { 
    [ElementProperty.color]: "rgba(63, 191, 127, 1)"
  },
  events: [ ],
  actions: [ RuleAction.point_to, RuleAction.reset ]
}