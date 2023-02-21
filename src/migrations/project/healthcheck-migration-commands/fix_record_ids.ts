import { RecordNode, r, RT } from "../../../r";
import { symmetricDifference } from "ramda";

/**
 * WIP
 * Migration to check and fix record integrity
 * Redundancies in rjson that can cause inconsistencies:
 * NODE:
 * id: 223344
 * type: project
 * props: <key|value>
 * records: {
 *    TypeA: {
 *      map: {
 *        id1: {id: id1, type: TypeA, props, records} // I. id, type in subnode can differer from the map key
 *        id2: {id: id2, type: TypeA, props, records}
 *      },
 *      order: [id1, id2] // II. ids can differ from map keys
 *    }
 *    TypeB: {
 *      map: {
 *        id1: {id: id3, type: TypeB, props, records}
 *        id2: {id: id4, type: TypeB, props, records}
 *      },
 *      order: [id3, id4]
 *    }
 * }
 */
class HealthcheckMigration {
  execute(projectJson: unknown): {corrections: string[]} {
    const pJson = projectJson as RecordNode<RT.project>;
    const corrections: string[] = [];
    this.fixRecord(pJson, corrections);
    // for(const correction of corrections) {
    //   console.log(correction);
    // }
    //Note: The refernce of pJson and projectJson are the same. This function mutates the orginal input.
    return {corrections};
  }

  fixRecord(json: RecordNode<RT>, corrections: string[]) {
    const rf = r.record(json);
    const subRecordTypes = rf.getROMTypes();
    for(const subRecordType of subRecordTypes) {
      if(json === undefined) continue;
      if(json.records === undefined) continue;
      if(json.records[subRecordType] === undefined) continue;
      const ROM = rf.getROM(subRecordType);
      const map = ROM?.map;
      //Solving issue II from above (check function comments)
      const newOrder = ROM?.order ?? []; //set blank in case undefined
      if(ROM !== undefined && map !== undefined) {
        const idsInMap = Object.keys(map).map(i => Number(i));
        //Add items not in order but present in map
        for(const id of idsInMap) {
          if(!newOrder.includes(id)) {
            corrections.push(`id ${id} present in map but not in order. Adding ${id} to order array.`);
            newOrder.push(id);
          }
        }
        //Remove extra items in order
        const filteredOrder = newOrder.filter(val => idsInMap.includes(val));
        ROM.order = filteredOrder;

        //Solving issue I from above (check function comments)
        //For each item in map, ensure the id matches that of map key, and type is the same is subRecordType
        for(const [key, value] of Object.entries(map)) {
          if(value.id !== Number(key)) {
            corrections.push(`Record id ${key} has a different record.id in its value. Overwriting the internal id ${value.id} with ${key}`);
            value.id = Number(key)
          }
          if(value.type !== subRecordType) {
            corrections.push(`Record id ${key} has a different record.type in its value. Overwriting the internal type ${value.type} with ${subRecordType}`);
            value.type = subRecordType;
          }
        }
      }

      const records = rf.getRecords(subRecordType);
      for(const record of records) {
        this.fixRecord(record, corrections);
      }
    }
  }
}

const healthCheckMigration = new HealthcheckMigration();

const confirmNoCorruption = (json: RecordNode<RT>): boolean => {
  const rf = r.record(json);
  const subRecordTypes = rf.getROMTypes();
  for(const subRecordType of subRecordTypes) {
    if(json === undefined) continue;
    if(json.records === undefined) continue;
    if(json.records[subRecordType] === undefined) continue;
    const ROM = rf.getROM(subRecordType);
    const map = ROM?.map;
    //Check issue II from above (check function comments)
    const order = ROM?.order;
    if(map === undefined || order === undefined ) {
      console.log(`Failed check because map or order is undefined.`, map, order)
      return false; //map or order can't be undefined
    }
    const idsInMap = Object.keys(map).map(i => Number(i));

    //Check for array equivalence of order and idsInMap
    // https://stackoverflow.com/a/55593548
    if(order.length !== idsInMap.length || symmetricDifference(order, idsInMap).length !== 0) {
      console.log(`Failed check because of difference in order and idsInMap.`, order, idsInMap);
      return false;
    }

    //Solving issue I from above (check function comments)
    //For each item in map, ensure the id matches that of map key, and type is the same is subRecordType
    for(const [key, value] of Object.entries(map)) {
      if(value.id !== Number(key)) {
        console.log(`Failed test because record id ${key} has a different record.id ${value.id} in its value.`);
        return false;
      }
      if(value.type !== subRecordType) {
        console.log(`Faile check because record id ${key} has a different record.type ${value.type} in its value.`);
        return false;
      }
    }

    const records = rf.getRecords(subRecordType);
    for(const record of records) {
      if(!confirmNoCorruption(record)) {
        console.log(`Failed check in sub record id ${record.id}`);
        return false;
      }
    }
  }
  return true;
}

export { healthCheckMigration, confirmNoCorruption };
