import { RecordNode, r, RT } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * WIP
 * Migration to check and fix record integrity
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    this.fixRecord(pJson);
  }

  fixRecord(json: RecordNode<RT>) {
    const rf = r.record(json);
    const subRecordTypes = rf.getROMTypes();
    for(const subRecordType of subRecordTypes) {
      if(json === undefined) continue;
      if(json.records === undefined) continue;
      if(json.records[subRecordType] === undefined) continue;
      const ROM = rf.getROM(subRecordType);
      const map = ROM?.map;
      const order = ROM?.order ?? []; //set blank in case undefined
      if(ROM !== undefined && map !== undefined) {
        const idsInMap = Object.keys(map).map(i => Number(i));
        //Add items not in order but present in map
        for(const id of idsInMap) {
          if(!order.includes(id)) {
            console.log(`id ${id} present in map but not in order. Adding.`);
            order.push(id);
          }
        }
        //Remove extra items in order
        const filteredOrder = order.filter(val => !idsInMap.includes(val));
        ROM.order = filteredOrder;

        //For each item in map, ensure the id matches that of map key, and type is the same is subRecordType
        for(const [key, value] of Object.entries(map)) {
          if(value.id !== Number(key)) {
            console.log(`Record id ${key} has a different record.id in its value. Overwriting the internal id ${value.id} with ${key}`);
            value.id = Number(key)
          }
          if(value.type !== subRecordType) {
            console.log(`Record id ${key} has a different record.type in its value. Overwriting the internal type ${value.type} with ${subRecordType}`);
            value.type = subRecordType;
          }
        }
      }

      const records = rf.getRecords(subRecordType);
      for(const record of records) {
        this.fixRecord(record);
      }
    }
  }
}

const migration = new Migration();
export default migration;
