import { RecordNode, r, rtp, RT, createRecord } from "../../../r";
import { IOrder } from "../../IOrder";

/** @deprecated */
interface OldLanguage {
  name: string,
  /** Used as the value in the auto variable insted of name, if present */
  override_value?: string
}

/**
 * Convert languages options from a project property to a record type
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const languages = (pJson.props as any).languages as OldLanguage[];
    if(languages !== undefined) {
      delete (pJson.props as any).languages;
      let id = 5000;
      for(const language of languages) {
        //Making id deterministic for test cases
        const langRecord = createRecord(RT.language, id++, language.name);
        if(language.override_value !== undefined) {
          langRecord.props.override_value = language.override_value;
        }
        projectF.addRecord(langRecord);
      }
    }
    projectF.set(rtp.project.version, 106);
  }
}

const migration = new Migration();
export default migration;
