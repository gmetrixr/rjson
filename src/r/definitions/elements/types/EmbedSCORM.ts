import { ElementProperty } from "../../../recordTypes/Element";
import { RuleAction } from "../../rules";
import { RuleEvent } from "../../rules";
import { BasicElement, ElementType,  IElementDefinition } from "../ElementSubTypes";

export const EmbedScorm: IElementDefinition = {
  element_type: ElementType.embed_scorm,
  elementDefaultName: "SCORM",
  properties: [
    ...BasicElement.properties,
    ElementProperty.embed_scorm_url
  ],
  defaultOverrides: {},
  events: [ RuleEvent.on_scorm_finish, RuleEvent.on_scorm_initialize, RuleEvent.on_scorm_set_score, RuleEvent.on_close],
  actions: [ RuleAction.show, RuleAction.hide ]
}
