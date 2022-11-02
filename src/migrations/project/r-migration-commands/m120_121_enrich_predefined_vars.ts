import { R, RecordNode, r, rtp, RT } from "../../../r";
import { predefinedVariableIdToName, VarCategory } from "../../../r/definitions/variables/VariableSubTypes";
import { IOrder } from "../../IOrder";
import { ProjectUtils } from "../../../r/recordFactories/ProjectFactory";
import { ElementType } from "../../../r/definitions/elements";

class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);
    const variables = projectF.getRecords(RT.variable);
    for(const v of variables) {
      // * If a variable is a predefined var, set it's var_category = predefined
      if(Number(v["id"]) in predefinedVariableIdToName) {
        v.props.var_category = VarCategory.predefined;

        // * update few names of the variables so that their templating can be done correctly only when this is a predefined var
        if(v["name"] === "platform_var") {
          v["name"] = "device_var";
        }
      }
    }

    // * also fix any templating issues with platform_var -> device_var name change
    const allTemplatableRecords = ProjectUtils.getAllTemplatedRecords(pJson);
    const regex = /{{platform_var}}/g; // /g to match all instances
    for(const record of allTemplatableRecords) {
      if(record.type === RT.element) {
        switch(record.props.element_type) {
          case ElementType.text: {
            const recordF = r.element(record);
            const value = recordF.getValueOrDefault(rtp.element.text) as string;
            recordF.set(rtp.element.text, value.replace(regex, "{{device_var}}"));
            break;
          }
          case ElementType.embed_html: {
            const recordF = r.element(record);
            const value = recordF.getValueOrDefault(rtp.element.embed_string) as string;
            recordF.set(rtp.element.embed_string, value.replace(regex, "{{device_var}}"));
            break;
          }
        }
      } else if(record.type === RT.then_action) {
        const recordF = r.record(record);
        const properties = recordF.getValueOrDefault(rtp.then_action.properties) as string[];
        if(properties.length > 0) {
          properties[0] = properties[0].replace(regex, "{{device_var}}");
          recordF.set(rtp.then_action.properties, properties);
        }
      }
    }
    projectF.set(rtp.project.version, 121);
  }
}

const migration = new Migration();
export default migration;
