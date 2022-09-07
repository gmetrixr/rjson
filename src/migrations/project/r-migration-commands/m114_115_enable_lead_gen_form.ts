import { R, RecordNode, r, rtp, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * For older projects, there was no enable_lead_gen form.
 * So we deduce the value of this var by seeing if any lead gen field exists. (Only in case this field isn't explicitly defined)
 * 
 * Also, removing the "enabled" property in lead_gen_fields.
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);
    const leadGenFields = projectF.getRecords(RT.lead_gen_field);
    
    //In the older interface, once any leadGenField gets added or removed, show_lead_gen gets set to true and false
    // const currentShowLeadGen = projectF.get(rtp.project.show_lead_gen);
    // if(currentShowLeadGen === undefined && leadGenFields.length > 0) {
    //   let newShowLeadGen = false;
    //   for(const leadGenField of leadGenFields) {
    //     newShowLeadGen = true;
    //   }
    //   projectF.set(rtp.project.show_lead_gen, newShowLeadGen);
    // }

    for(const leadGenField of leadGenFields) {
      delete (leadGenField.props as any)["enabled"]; //Older field, not used anymore
    }
    projectF.set(rtp.project.version, 115);
  }
}

const migration = new Migration();
export default migration;
