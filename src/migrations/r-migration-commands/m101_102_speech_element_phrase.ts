import { R, r, en, RecordNode, rtp, RT } from "../../r";
import { } from "../../r/R";
import { IOrder } from "../IOrder";

/**
 * Changes the phrases property in speech element into items
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.getAllDeepChildren(RT.element).forEach(e => {
      if(e.props.element_type === en.ElementType.speech) {

        // phrases is a map
        const phrases = (e.props as any).phrases as any;
        let i = 0;
        for(const phraseItem of Object.values(phrases)) {
          i = i + 1;
          //Need the id to be deterministic for test cases
          const item = R.createRecord(RT.item, e.id + 100002 + i);
          item.props.phrase_id = (phraseItem as any).phrase_id
          item.props.phrase = (phraseItem as any).phrase;
          item.props.aliases = (phraseItem as any).aliases;
          r.element(e).addRecord(item);
        }
        delete (e.props as any).phrases;
      }
    });
    projectF.set(rtp.project.version, 102);
  }
}

const migration = new Migration();
export default migration;


//REFERENCE:
// export interface Phrase {
//   phrase: string,
//   aliases: string[],
//   phrase_id: number
// }
