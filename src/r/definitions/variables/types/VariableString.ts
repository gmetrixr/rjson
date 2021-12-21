import { RuleAction } from "../../rules/RuleAction";
import { RuleEvent } from "../../rules/RuleEvent";
import { IVariableDefinition, VariableType } from "../VariableSubTypes";

export const VariableString: IVariableDefinition = {
  variable_type: VariableType.string,
  varDefaultName: "New String Variable",
  varDefaultValue: "Hi there!",
  events: [
    RuleEvent.on_var_change,
    RuleEvent.on_set_eq,
    RuleEvent.on_is_in_list,
    RuleEvent.on_is_not_in_list,
  ],
  actions: [
    RuleAction.var_reset,
    RuleAction.set_to_input,
    RuleAction.set_to_string,
    RuleAction.append_input,
  ]
}
