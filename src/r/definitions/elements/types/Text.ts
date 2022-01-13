import { ElementProperty } from "../../../recordTypes/Element";
import { RuleEvent } from "../../rules";
import { BasicElement, ElementType,  IElementDefinition } from "../ElementSubTypes";

export const Text: IElementDefinition = {
  element_type: ElementType.text,
  elementDefaultName: "Text",
  properties: [
    ...BasicElement.properties,
    ElementProperty.text,
    ElementProperty.opacity,
    ElementProperty.font_color,
    ElementProperty.font_size,
    ElementProperty.font_bold,
    ElementProperty.hidden,
    ElementProperty.locked,
    ElementProperty.no_click_animation,
    ElementProperty.placer_3d,
    ElementProperty.wh,
    ElementProperty.scale,
    ElementProperty.animation,
    ElementProperty.font_family,
    ElementProperty.font_weight,
    ElementProperty.billboarding,
  ],
  defaultOverrides: {
    [ElementProperty.text]: "Welcome to the metaverse",
    [ElementProperty.wh]: [6.5, 4],
    [ElementProperty.font_color]: "rgba(63, 191, 127, 1)",
  },
  events: [
    ...BasicElement.events,
    RuleEvent.on_press, 
    RuleEvent.on_release
  ],
  actions: [...BasicElement.actions ]
}
