import { RuleAction } from "../../rules/RuleAction";
import { ISpecialDefinition, SpecialType } from "../SpecialSubTypes";

export const SpecialAllVariables: ISpecialDefinition = {
  special_type: SpecialType.all_variables,
  events: [],
  actions: [
    RuleAction.var_reset,
  ],
}
