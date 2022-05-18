import { RecordNode, ROM, RecordMap, createRecord, ClipboardR } from "./RecordNode";
import { RT, RTP, recordTypeDefinitions, isRecordType, rtp, isTypeChildOf, isTypeSubChildOf } from "./RecordTypes";
import { jsUtils } from "@gmetrixr/gdash";

const { getSafeName, mapValuesToOrder, deepClone, generateId } = jsUtils;

/**
 * A convenient Factory class to maninpulate a RecordNode object of any type
 * This class can be extended to provide any recordType specific funcitonality
 *
 * Using arrow functions in Classes has a runtime performance cost. The constructor bloats up.
 * Solution: https://www.typescriptlang.org/docs/handbook/2/classes.html#this-parameters
 */
export class RecordFactory<T extends RT> {
  protected readonly _json: RecordNode<T>;
  protected readonly _type: RT;

  constructor(json: RecordNode<T>) {
    this._json = json;
    if (isRecordType(json.type)) {
      this._type = json.type;
    } else {
      throw Error(`json.type is not a known RecordType`);
    }
    return this;
  }

  /**
   * Returns the value of a property, or it default in case the value isn't defined.
   * In case there is no default defined, it returns "undefined"
   */
  getValueOrDefault(this: RecordFactory<T>, property: RTP[T]): unknown {
    //In case actual value exists, return that
    if (this.get(property) !== undefined) {
      return this.get(property);
    } else {
      return this.getDefault(property);
    }
  }

  /**
   * Returns a clone default value of a property. If no default is found, returns undefined
   * Note: the returned object is a cloned value to avoid reuse of references across r objects
   */
  getDefault(this: RecordFactory<T>, property: RTP[T]): unknown {
    const defaultValues = recordTypeDefinitions[this._type].defaultValues;
    if (defaultValues[property] === undefined) return undefined;
    return deepClone(defaultValues[property]);
  }

  json(this: RecordFactory<T>): RecordNode<T> {
    return this._json;
  }

  getId(this: RecordFactory<T>): number {
    return this._json.id;
  }

  getName(this: RecordFactory<T>): string | undefined {
    return this._json.name;
  }

  /** A list of recordNode.props' keys in the json */
  getProps(this: RecordFactory<T>): string[] {
    return Object.keys(this._json.props);
  }

  /** A list of Records this json has (eg: project might have scene, variable, menu) */
  getROMTypes(this: RecordFactory<T>): RT[] {
    return Object.keys(this._json.records ?? {}) as RT[];
  }

  /** A list of props this RecordType is supposed to have */
  getRecordTypeProps(this: RecordFactory<T>): string[] {
    return Object.keys(rtp[this._type]);
  }

  /** In case a property isn't defined in the json, this method returns "undefined" */
  get(this: RecordFactory<T>, property: RTP[T]): unknown {
    return this._json.props[property];
  }

  set(this: RecordFactory<T>, property: RTP[T], value: unknown): RecordFactory<T> {
    this._json.props[property] = value;
    return this;
  }

  delete(this: RecordFactory<T>, property: string): RecordFactory<T> {
    delete (this._json.props)[property as RTP[T]];
    return this;
  }

  /** get RecordOrderedMap for a particular sub record, of the shape {map: {}, order: []} -  */
  getROM<N extends RT>(this: RecordFactory<T>, type: N): ROM<N> | undefined {
    return this._json.records?.[type];
  }

  getRecordMap<N extends RT>(this: RecordFactory<T>, type: N): RecordMap<N> {
    return this._json.records?.[type]?.map ?? {};
  }

  getRecordOrder(this: RecordFactory<T>, type: RT): number[] {
    return this._json.records?.[type]?.order ?? [];
  }

  getRecord<N extends RT>(this: RecordFactory<T>, type: N, id: number): RecordNode<N> | undefined {
    return (this._json.records?.[type]?.map as RecordMap<N>)?.[id];
  }

  getRecords<N extends RT>(this: RecordFactory<T>, type: N): RecordNode<N>[] {
    return mapValuesToOrder(<RecordMap<N>>this._json.records?.[type]?.map, this._json.records?.[type]?.order);
  }

  changeRecordId<N extends RT>(this: RecordFactory<T>, type: N, id: number, newId?: number): RecordNode<N> | undefined {
    const record = this.getRecord(type, id);
    if (record === undefined) return undefined;
    if (newId === undefined) newId = generateId();
    //Need to update at three places. 1) within record. 2) in the RecordOrderedMap.map's key 3) In the RecordOrderedMap.order array
    //1) Within record
    record.id = newId;
    //2) in the RecordOrderedMap.map's key
    const recordOrderedMap = <ROM<RT>>this.getROM(type);
    recordOrderedMap.map[newId] = recordOrderedMap.map[id];
    delete recordOrderedMap.map[id];
    //3) In the RecordOrderedMap.order array
    const index = recordOrderedMap.order.indexOf(id);
    recordOrderedMap.order[index] = newId;
    return record;
  }

  changeRecordName<N extends RT>(this: RecordFactory<T>, type: N, id: number, newName?: string): RecordNode<N> | undefined {
    const record = this.getRecord(type, id);
    if (record === undefined) {
      return undefined;
    }
    const defaultName = recordTypeDefinitions[type].defaultName;
    if (defaultName === undefined) {
      //This means that this type doesn't use name
      return undefined;
    }
    if (newName === undefined) {
      newName = defaultName;
    }
    const existingNames = <Array<string>>this.getRecords(type)
      .filter(r => r.id !== id) //remove the same record itself
      .map(n => n.name) //convert records to names
      .filter(name => name !== undefined); //remove undefined names

    if (existingNames.includes(newName)) {
      record.name = getSafeName(newName, existingNames);
    } else {
      record.name = newName;
    }
    return record;
  }

  changeDeepRecordName<N extends RT>(this: RecordFactory<T>, type: N, id: number, newName?: string): RecordNode<N> | undefined {
    const deepCAndP = this.getDeepChildAndParent(type, id);
    if(deepCAndP === undefined) {
      return undefined;
    }
    const parentF = new RecordFactory(deepCAndP.p);
    return parentF.changeRecordName(type, id, newName);
  }

  changePropertyName(this: RecordFactory<T>, propertyName: string, newPropertyName: string): RecordFactory<T> {
    //@ts-ignore
    if (this._json.props[propertyName] !== undefined) {
      //@ts-ignore
      this._json.props[newPropertyName] = this._json.props[propertyName];
      //@ts-ignore
      delete this._json.props[propertyName];
    }
    return this;
  }

  deleteProperty(this: RecordFactory<T>, propertyName: string): RecordFactory<T> {
    //@ts-ignore
    if (this._json.props[propertyName]) {
      //@ts-ignore
      delete this._json.props[propertyName];
    }
    return this;
  }

  addBlankRecord<N extends RT>(this: RecordFactory<T>, type: N, position?: number): RecordNode<N> {
    const record = createRecord(type);
    this.addRecord(record, position);
    return record;
  }

  addRecord<N extends RT>(this: RecordFactory<T>, record: RecordNode<N>, position?: number): RecordNode<N> | undefined {
    if (!isRecordType(record.type)) {
      console.error(`Unable to add record because record type ${record.type} isn't a known record type`);
      return undefined;
    }
    const recordOrderedMap = this._json.records?.[record.type];
    if (recordOrderedMap === undefined) {
      //Check if this type of sub-record is supposed to exist in this type
      if (!isTypeChildOf(this._type, record.type)) {
        console.log(`The type ${this._json.type} doesn't allow addition of ${record.type} records`);
        return undefined;
      }
      if (this._json.records === undefined) {
        this._json.records = {};
      }
      this._json.records[record.type] = {
        order: [record.id],
        map: {
          [record.id]: record
        }
      };
    } else {
      const defaultName = recordTypeDefinitions[record.type].defaultName;
      if (defaultName !== undefined) { //This means that this type uses name
        const existingNames = <Array<string>>Object.values(recordOrderedMap.map).map(n => n.name).filter(name => name !== undefined);
        //If this name is already used, overwite the name with a new one
        const potentialName = record.name ?? defaultName;
        if (existingNames.includes(potentialName)) {
          record.name = getSafeName(potentialName, existingNames);
        }
      }

      //If a RecordNode with the same id already exists, overwrite the id of the incoming object with a new one
      if (recordOrderedMap.map[record.id] !== undefined) {
        record.id = generateId();
      }
      position = position !== undefined ? position : recordOrderedMap.order.length;
      recordOrderedMap.order.splice(position, 0, record.id);
      recordOrderedMap.map[record.id] = record;
    }
    return record;
  }

  duplicateRecord<N extends RT>(this: RecordFactory<T>, type: N, id: number): RecordNode<N> | undefined {
    const recordOrderedMap = <ROM<N>>this._json.records?.[type];
    if (recordOrderedMap === undefined) return undefined;
    const orig = recordOrderedMap.map[id];
    if (orig === undefined) return undefined;
    let origPosition = recordOrderedMap.order.indexOf(id);
    if (origPosition === -1) {
      origPosition = recordOrderedMap.order.length - 1;
    }
    const clonedJson = deepClone(orig);
    //addRecord makes sure that the id of the record itself isn't duplicate amongst its siblings
    return this.addRecord<N>(clonedJson, origPosition + 1);
  }

  duplicateDeepRecord<N extends RT>(this: RecordFactory<T>, type: N, id: number): RecordNode<N> | undefined {
    const deepCAndP = this.getDeepChildAndParent(type, id);
    if(deepCAndP === undefined) {
      return undefined;
    }
    const parentF = new RecordFactory(deepCAndP.p);
    return parentF.duplicateRecord(type, id);
  }

  deleteRecord<N extends RT>(this: RecordFactory<T>, type: N, id: number): RecordNode<N> | undefined {
    const recordOrderedMap = <ROM<N>>this._json.records?.[type];
    if (recordOrderedMap === undefined) {
      return undefined;
    }
    const nodeIndex = recordOrderedMap.order.indexOf(id);
    if (nodeIndex >= 0) {
      recordOrderedMap.order.splice(nodeIndex, 1);
    }
    const deletedRecord = recordOrderedMap.map[id];
    delete recordOrderedMap.map[id];
    return deletedRecord;
  }

  deleteDeepRecord<N extends RT>(this: RecordFactory<T>, type: N, id: number): RecordNode<N> | undefined {
    const deepCAndP = this.getDeepChildAndParent(type, id);
    if (deepCAndP === undefined) {
      return undefined;
    }
    const parentF = new RecordFactory(deepCAndP.p);
    return parentF.deleteRecord(type, id);
  }

  /**
   * Used in drag-drop operations
   * Allows moving multiple items at the same time
   * Changes order in place
   *
   * Input: [1, 2, 3, 4, 5, 6]
   * Operation: nodeIds: [2,4], position: 5
   * Output: [1, 3, 5, 6, 2, 4]
   */
  transposeRecords(this: RecordFactory<T>, type: RT, ids: number[], position: number): undefined {
    const recordOrderedMap = this._json.records?.[type];
    if (recordOrderedMap === undefined) {
      return undefined;
    }
    if (ids.length === 0) {
      return;
    }
    const order = recordOrderedMap.order;
    for (let i = 0; i < ids.length; i++) {
      const nodeId = ids[i];
      const currentIndex = order.indexOf(nodeId);
      // delete node from position
      const deletedRecords = order.splice(currentIndex, 1);
      // if element's current index is > destinationPos, then we need to insert in increasing order
      if (currentIndex > position) {
        position += i;
      }
      // insert into correct place
      order.splice(position, 0, deletedRecords[0]);
    }
  }

  getDeepChildAndParent<N extends RT>(this: RecordFactory<T>, type: N, id: number): { c: RecordNode<N>, p: RecordNode<RT> } | undefined {
    if (this._json.records === undefined) {
      return;
    }

    // getRecords runs over records map, if it is not present, we've hit a leaf node.
    const child = this.getRecord(type, id);
    if (child !== undefined) {
      return { c: child, p: this._json };
    }
    //Search in all records
    for (const recordType of (Object.keys(this._json.records) as RT[])) {
      if (!isTypeSubChildOf(this._type, type)) {
        continue;
      }
      for (const record of this.getRecords(recordType)) {
        const recordF = new RecordFactory(record);
        const deepCAndP = recordF.getDeepChildAndParent(type, id);
        if (deepCAndP !== undefined) {
          return deepCAndP;
        }
      }
    }
  }

  getAllDeepChildrenIds<N extends RT>(this: RecordFactory<T>, type: N): number[] {
    const idsToReturn: number[] = [];
    if (this._json.records === undefined) {
      return idsToReturn;
    }
    for (const recordType of (Object.keys(this._json.records) as RT[])) {
      if (recordType === type) {
        idsToReturn.push(...this.getRecordOrder(type));
      }
      if (!isTypeSubChildOf(this._type, type)) {
        continue;
      }
      for (const record of this.getRecords(recordType)) { //Go a level deeper if available
        const recordDeepChildrenIds = new RecordFactory(record).getAllDeepChildrenIds(type);
        idsToReturn.push(...recordDeepChildrenIds);
      }
    }
    return idsToReturn;
  }

  getAllDeepChildren<N extends RT>(this: RecordFactory<T>, type: N): RecordNode<N>[] {
    const recordsToReturn: RecordNode<N>[] = [];
    if (this._json.records === undefined) {
      return recordsToReturn;
    }
    for (const recordType of (Object.keys(this._json.records) as RT[])) {
      if (recordType === type) {
        recordsToReturn.push(...this.getRecords(type));
      }
      if (!isTypeSubChildOf(this._type, type)) {
        continue;
      }
      for (const record of this.getRecords(recordType)) { //Go a level deeper if available
        const recordDeepChildren = new RecordFactory(record).getAllDeepChildren(type);
        recordsToReturn.push(...recordDeepChildren);
      }
    }
    return recordsToReturn;
  }

  /**
   * Documentation for filter predicate: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#description
   */
  getAllDeepChildrenIdsWithFilter<N extends RT>(this: RecordFactory<T>, type: N, predicate: (value: RecordNode<N>, index?: number, array?: RecordNode<N>[]) => boolean): number[] {
    const idsToReturn: number[] = [];
    if (this._json.records === undefined) return idsToReturn;
    for (const recordType of (Object.keys(this._json.records) as RT[])) {
      if (recordType === type) {
        idsToReturn.push(...this.getRecords(recordType).filter(predicate).map(r => r.id));
      }
      if (!isTypeSubChildOf(this._type, type)) {
        continue;
      }
      for (const record of this.getRecords(recordType)) { //Go a level deeper if available
        const recordDeepChildrenIds = new RecordFactory(record).getAllDeepChildrenIdsWithFilter(type, predicate);
        idsToReturn.push(...recordDeepChildrenIds);
      }
    }
    return idsToReturn;
  }

  getAllDeepChildrenWithFilter<N extends RT>(this: RecordFactory<T>, type: N, predicate: (value: RecordNode<N>, index?: number, array?: RecordNode<N>[]) => boolean): RecordNode<N>[] {
    const recordsToReturn: RecordNode<N>[] = [];
    if (this._json.records === undefined) return recordsToReturn;
    for (const recordType of (Object.keys(this._json.records) as RT[])) {
      if (recordType === type) {
        recordsToReturn.push(...this.getRecords(recordType).filter(predicate));
      }
      if (!isTypeSubChildOf(this._type, type)) {
        continue;
      }
      for (const record of this.getRecords(recordType)) {
        const recordDeepChildren = new RecordFactory(record).getAllDeepChildrenWithFilter(type, predicate);
        recordsToReturn.push(...recordDeepChildren);
      }
    }
    return recordsToReturn;
  }

  /** 
   * Returns the object that needs to be stringified before sending to clipboard
   * Needs to be overriden at Project/Scene level to ensure that 
   * 1) Vars are copied correctly (in case of scene copy). Vars pasting will be a bit different - no point changing ids.
   * 2) element ids don't conflict at any depth while pasting
   * 3) To ensure Ctrl+V of scene works even within another scene (ie project's paste gets used)
   *
   * * For clipboard operation, this function can only be called at the parent level
   * * For scene copy, call to r.project()
   * * For element copy, call to r.scene()
   *
   * Scene copy logic:
   * In scene rules, vars can be referenced via ids or via variable names (in templates used in elements)
   * Copy all variables referenced.
   * 
   * Scene paste logic:
   * For EACH variable which was copied
   * - If the variable id and name doesn't exist - paste it
   * - If the variable id exists, but name doesn't - ignore it. (To make this work, we need to go to each string template used in rules
   * and elements in the new scene, and change the templates to use the new name)
   * - If the variable id doesn't exist, but name does - replace the variable id in the new scene being pasted (in all rules)
   * with the new variable id
   * - If both the variable id and name exist - ignore it
   */
  copyToClipboardObject(this: RecordFactory<T>, ids: number[]): ClipboardR {
    //Keep searching for children until we get the same id
    const romTypes = this.getROMTypes();
    const foundRecordNodes: RecordNode<RT>[] = [];
    for(const romType of romTypes) {
      foundRecordNodes.push(...this.getAllDeepChildrenWithFilter(romType, (value => ids.includes(value.id))));
    }
    return {
      parentType: this._type,
      nodes: foundRecordNodes,
    }
  }
  
  /** 
   * Once the clipboard has been converted into ClipboardR, this function can be used to merge into parent RecordNode 
   */
  pasteFromClipboardObject(this: RecordFactory<T>, { obj, position }: {obj: ClipboardR, position?: number}): void {
    if(obj.parentType !== this._type) {
      console.error(`Can't paste this object into a RecordNode of type of ${this._type}`);
      return;
    }
    for(const rn of obj.nodes) {
      // * if position is passed, then keep incrementing to insert in order, else add at the end of the list
      this.addRecord(rn, position? position++: position);
    }
  }

  /**
   * Add moveRecords in RecordFactory. ProjectFactory will override this to add rules logic.
   * moveRecords(selectIds: [{id: , path: [recordId, parentRecordId, parent2RecordId....]}], destiation: {id: ,path: []}, destinationPosition)
   */

  /**
   * RFC: https://docs.google.com/document/d/1DVM_i_Go5iX5-EShV5FikfI29k8YEC9cAjzeAY49blc/edit#
   * get the address of the RecordNode. In case parentAddr is not passed (root levels) then self address is returned
   */
  getAddress(this: RecordFactory<T>, parentAddr?: string): string {
    const selfAddress = `${this._type}:${this.getId()}`;
    return parentAddr? `${parentAddr}|${selfAddress}`: selfAddress;
  }

  /**
   * get the address of a reacord node property. incase when index is passed, return address to indexed property
   * 1. project:1|scene:1|element:2!opacity
   * 2. project:1|scene:1|element:2!wh>1
   */
  getPropertyAddress(this: RecordFactory<T>, parentAddr: string, property: RTP[T], index?: number): string {
    const recordAddress = this.getAddress(parentAddr);
    const recordPropertyAddress = `${recordAddress}!${property}`;
    return index? `${recordPropertyAddress}>${index}`: recordPropertyAddress;
  }

  /**
   * Find the record at a given address. Searches only in child record nodes.
   * Assumes that 1st entry in addr is self
   *
   * examples for ref
   * 1. project:1|scene:1
   * 2. project:1|scene:1|element:2
   * 3. project:1|scene:1|element:2!opacity
   * 4. project:1|scene:1|element:2!wh>1
   *
   */
  getRecordAtAddress(this: RecordFactory<T>, addr: string): RecordNode<RT> | null {
    // * sanitize and remove and unwanted cases when addr contains strings for property lookup
    // * replace everything after a ! with a blank string
    const recordsArray = addr.replace(/!.*/, "").split("|"); // [project:1, scene:1, element:2]
    if(recordsArray.length === 0 || this._json.records === undefined) {
      return null;
    }

    //* If the length of the address = 1 and the type matches, return self else return null
    if(recordsArray.length === 1) {
      const rootRecord = recordsArray[0].split(":");// [project, 1] -> RT[T], id
      return rootRecord[0] === this._type? this._json: null;
    }

    /**
     * We start the loop from the 2nd entry with index = 1
     * Loop through the whole address array to find the correct RecordNode.
     * At any point if a child record node is not found, return null (cases when addr is not in-sync with json structure)
     *
     * This uses a for loop to find all child entries instead of a recursive loop to avoid recomputing the addr passed in the recursive call.
     * The for loop runs in O(n) and lookups using recordF.getRecord are O(1). Total complexity is O(n) [of address and not records].
     */
    let currentRecord: RecordNode<RT> = this._json;

    for (let i = 1; i < recordsArray.length; i++) {
      const record = recordsArray[i];
      const [type, id] = record.split(":"); // [scene, 1]
      const recordF = new RecordFactory(currentRecord);
      // Number(undefined) = NaN, so this will work. Complexity of checking isNaN and hashmap lookup are same.
      const child = recordF.getRecord(type as RT, Number(id));

      if(!child) {
        return null;
      }
      currentRecord = child;
    }

    return currentRecord;
  }

  /**
   * Find the record at a given address. Searches only in child record nodes.
   * Returns both self and parent
   * Assumes that 1st entry in addr is self
   *
   * examples for ref
   * 1. project:1|scene:1
   * 2. project:1|scene:1|element:2
   * 3. project:1|scene:1|element:2!opacity
   * 4. project:1|scene:1|element:2!wh>1
   *
   */
  getRecordAndParentAtAddress(this: RecordFactory<T>, addr: string): {p?: RecordNode<RT>, c: RecordNode<RT>} | null {
    // * sanitize and remove and unwanted cases when addr contains strings for property lookup
    // * replace everything after a ! with a blank string
    const recordsArray = addr.replace(/!.*/, "").split("|"); // [project:1, scene:1, element:2]
    if(recordsArray.length === 0 || this._json.records === undefined) {
      return null;
    }

    //* If the length of the address = 1 and the type matches, return self else return null
    if(recordsArray.length === 1) {
      const rootRecord = recordsArray[0].split(":");// [project, 1] -> RT[T], id
      return rootRecord[0] === this._type? { c: this._json }: null;
    }

    /**
     * We start the loop from the 2nd entry with index = 1
     * Loop through the whole address array to find the correct RecordNode.
     * At any point if a child record node is not found, return null (cases when addr is not in-sync with json structure)
     *
     * This uses a for loop to find all child entries instead of a recursive loop to avoid recomputing the addr passed in the recursive call.
     * The for loop runs in O(n) and lookups using recordF.getRecord are O(1). Total complexity is O(n) [of address and not records].
     */
    let currentRecord: RecordNode<RT> = this._json;
    let parentRecord:  RecordNode<RT> | undefined = undefined;

    for (let i = 1; i < recordsArray.length; i++) {
      const record = recordsArray[i];
      const [type, id] = record.split(":"); // [scene, 1]
      const recordF = new RecordFactory(currentRecord);
      // Number(undefined) = NaN, so this will work. Complexity of checking isNaN and hashmap lookup are same.
      const child = recordF.getRecord(type as RT, Number(id));
      if(!child) {
        return null;
      }
      parentRecord = currentRecord;
      currentRecord = child;
    }

    return {c: currentRecord, p: parentRecord};
  }

  /**
   * Update the value of a property at an address
   * examples for ref
   * 1. project:1|scene:1|element:2!opacity
   * 2. project:1|scene:1|element:2!wh>1
   *
   * First find the RecordNode using getRecordAtAddress method
   * if the property address contains an index, check if the property is an array type
   *  1. if yes, udpate the value at index
   *  2. else return false
   * else update property value directly in the RecordNode
   *
   */
  updatePropertyAtAddress(this: RecordFactory<T>, addr: string, value: unknown): boolean {
    const recordAtAddress = this.getRecordAtAddress(addr);
    // find the matching property value string and then remove the ! from the lead
    const propertyAddr = addr.match(/!.*/)?.[0]?.replace("!", ""); // ex: !scene_yaw_correction

    if(!recordAtAddress || !propertyAddr) {
      return false;
    }
    const recordF = new RecordFactory(recordAtAddress);
    const [property, index] = propertyAddr.split(">");
    // check that the property actually exists in the RecordNode before updating
    if(!recordF.getProps().includes(property)) {
      return false;
    }

    const propertyValue = recordF.getValueOrDefault(property as RTP[T]);
    // Only update indexed properties if index value is defined in the address
    if(Array.isArray(propertyValue)) { // isArray of undefined is false, so for undefined data this will work too
      if(index !== null && index !== undefined) {
        propertyValue[Number(index)] = value;
        recordF.set(property as RTP[T], propertyValue);
      } else {
        return false;
      }
    } else {
      recordF.set(property as RTP[T], value);
    }
    return true;
  }

  /**
   * This allows re-parenting records between different depths inside a tree using their addresses.
   * This needs to be called for the record where both sourceParentRecord and destParentRecord are child records of a common super parent record
   * For almost all operations, we will use a top down approach here for re-parenting, i.e re-parenting process needs to start from the top most parent
   * in this case, it is almost always project
   * Example1: moving elements from within a group to 1 level above.
   *
   * Scene1
   *  Element1 <-------|
   *  Element2         |
   *  Element3 (group) |
   *    Element31 -----|
   *    Element32
   *
   * In above scenario we want to move Element31 below Element1
   * sourceRecordAddr = [{parentAddr: Scene:1|Element:3, recordAddr: Scene:1|Element:3|Element:31}]
   * destParentAddr = Scene:1
   * destPosition = 0 (we insert at x+1 index)
   *
   * Example2: moving elements from one scene to another
   *
   * Scene1
   *  Element1
   *  Element2
   *  Element3 (group)
   *    Element31
   *    Element32  <-|
   * Scene2          |
   *  Element4 ------|
   *  Element5
   *
   * In above scenario we want to move Element4 from Scene2 to Element3(Group)
   * sourceRecordAddr = [{parentAddr: Scene:2, recordAddr: Scene:2|Element:4}]
   * destParentAddr = Scene:1|Element:3
   * destPosition = 1 (we insert at x+1 index)
   *
   */
  reParentRecordsWithAddress(destParentAddr: string, sourceRecordAddr: {parentAddr: string, recordAddr: string}[], destPosition?: number): [RecordNode<RT>[], RecordNode<RT>[]] {
    const destParentRecord = this.getRecordAtAddress(destParentAddr);
    const reParentedRecords: RecordNode<RT>[] = [];
    const failedReParentedRecords: RecordNode<RT>[] = [];
    if(destParentRecord === null) {
      console.error(`[reParentRecordsWithAddress]: Error in re-parenting. destParentAddr: ${destParentAddr}`);
      return [reParentedRecords, failedReParentedRecords];
    }

    const destinationParentRecordF = new RecordFactory(destParentRecord);
    for(const s of sourceRecordAddr) {
      const sourceRecord = this.getRecordAtAddress(s.recordAddr);
      const sourceParentRecord = this.getRecordAtAddress(s.parentAddr);
      if(sourceRecord === null || sourceParentRecord === null) {
        console.error(`[delete-sourceRecordAddresses]: can't find record/parent for : recordAddr: ${s.recordAddr} parentAddr: ${s.recordAddr}`);
        continue;
      }

      /**
       * The order of operations here is very important
       * 1. add the record in the new parent
       * 2. delete the record from older parent
       *
       * We do this in this order and not reverse since there can be records that don't qualify to be child of a parent
       * for ex: a scene can't be a child of a group
       * in this case, we don't re-parent the record at all and addRecord function returns undefined.
       * A better UX for this would be to restrict the user to be able to do that at all in the UI
       */

      // * Add to destination parent
      // * addRecord takes care of name clashes and id clashes
      const addedRecord = destinationParentRecordF.addRecord(sourceRecord, destPosition);
      // * Record was added correctly to the appropriate parent
      if(addedRecord !== undefined) {
        // * delete the record from resp parents
        const sourceParentRecordF = new RecordFactory(sourceParentRecord);
        sourceParentRecordF.deleteRecord(sourceRecord.type as RT, sourceRecord.id);
        reParentedRecords.push(addedRecord);
      } else {
        failedReParentedRecords.push(sourceRecord);
      }
    }
    return [reParentedRecords, failedReParentedRecords];
  }

  /**
   * This returns all the nodes in the path from a parent to a leaf
   */
  getBreadcrumbs(this: RecordFactory<T>, id: number, type: RT): RecordNode<RT>[] {
    const recordsToReturn: RecordNode<RT>[] = [];
    const deepCAndP = this.getDeepChildAndParent(type, id);
    if(deepCAndP === undefined) {
      recordsToReturn.push(this.json());
      return recordsToReturn;
    }

    // we've reached the parent
    if(deepCAndP.p.id === this.getId() && deepCAndP.p.type === this._type) {
      recordsToReturn.push(deepCAndP.p);
      recordsToReturn.push(deepCAndP.c);
    } else {
      // this is a different parent, lets find it's parent
      recordsToReturn.push(...this.getBreadcrumbs(deepCAndP.p.id, deepCAndP.p.type as RT));
      recordsToReturn.push(deepCAndP.c);
    }

    return recordsToReturn;
  }

  /**
   * Get address for a deep record
   */
  getDeepRecordAddress(this: RecordFactory<T>, id: number, type: RT): string {
    const breadcrumbs = this.getBreadcrumbs(id, type);
    let address = "";
    for (let i = 0; i < breadcrumbs.length; i++) {
      const b = breadcrumbs[i];
      address += `${b.type}:${b.id}`;
      // if this isnt the last entry, then append `|`
      if (i !== breadcrumbs.length - 1) {
        address += "|";
      }
    }
    return address;
  }

  /**
   * Get record + parent address for a given record
   */
  getDeepChildAndParentAddress(this: RecordFactory<T>, id: number, type: RT): string[] | undefined {
    const deepChildAndParent = this.getDeepChildAndParent(type, id);
    if(deepChildAndParent === undefined) {
      return undefined;
    }
    const recordAddress = this.getDeepRecordAddress(id, type);
    const parentAddress = this.getDeepRecordAddress(deepChildAndParent.p.id, deepChildAndParent.p.type as RT);

    return [recordAddress, parentAddress];
  }
}

export class RecordUtils {
  static getDefaultValues = <T extends RT>(type: T): Record<string, unknown> => recordTypeDefinitions[type].defaultValues;
}
