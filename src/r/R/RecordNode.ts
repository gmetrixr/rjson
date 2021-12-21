import { recordTypeDefinitions, RT, RTP } from "./RecordTypes";
import { jsUtils } from "@gmetrixr/gdash";

const { generateId } = jsUtils;

/**
 * Motivation: An experiment to see if a single recursive structure is enough to hold
 * a tree of indefinite depth
 * 
 * Current problems: (BOTH FIXED in r)
 * 1) "order" should be a part of the same structure as the map. Currently element_order, connection_order etc are one level higher
 * 2) Not easy to restrict the property names. Generic are one possible solution - but they break in recursion
 * 
 * (FIXED in r)
 * Should try move element_order, connection_order etc into a key named "order" within elements/connections itself, but such
 * drastic changes can be made only after we completely move out of teaxrcommon, tot, and start using ONLY the t library.
 * 
 * A Node can be anything -  Project/Scene/Element/Variable etc.
 * 
 * At L0, we have project (CONTROLLED THROUGH RecordType.tree)
 * L1,        scene,              vars
 * L2, elements, rules (some of the elements being groups)
 * L3, whenEvents, thenActions (under rules), element's items, groupElements's children ...
 */

/**
 * The DataStructure that can be used to store a recursive shape that has both properties, and maps.
 * The values in these maps are again in the shape of this same data structure.
 */
export interface RecordNode<T extends RT> {
  /** to uniquely identify an id */
  id: number,
  /** 
   * To tell us which factory method can be used to process this json.
   * Allows strings too to directly accept jsons (else jsons give this error: "Type 'string' is not assignable to type 'RecordType.project'")
   */
  type: T | string,
  name?: string,
  /** properties. Ideally don't store id,name,type again inside (note: this type is not element_type) */
  props: Partial<Record<RTP[T], unknown>>
  /** children. A map of named collections */
  records?: Partial<Record<RT, ROM<RT>>>
}

/** RecordOrderedMap */
export interface ROM<T extends RT> {
  /** order of children */
  order: number[]
  /** map containing individual children */
  map: RecordMap<T>
}

export type RecordMap<T extends RT> = Record<string, RecordNode<T>>

/** 
 * generates an empty RecordOrderedMap 
 */
export const emptyROM = <T extends RT>() :ROM<T> => {
  return {order: [], map: {}}
};

/**
 * Creates an object of any of the known record types
 * id is optional - creates an id if not given
 * name is optional - used only in case this rcord type needs a name. In case not given, can also use once from rt definitions.
 */
export const createRecord = <T extends RT>(type: T, id?: number, name?: string) :RecordNode<T> => {
  const node: RecordNode<T> = {
    id: id ?? generateId(),
    type: type,
    //name: name ?? recordTypeDefinitions[type].defaultName, Optional. So we check below if it is even needed.
    props: {},
    //records: {}, //Optional, so don't set here. Automatically set when first record is added.
  }
  //Add name only if this RecordType uses name
  if(recordTypeDefinitions[type].defaultName !== undefined) {
    node.name = name ?? recordTypeDefinitions[type].defaultName;
  }
  return node;
};

/** clipboard contains the strigified version of this */
export interface ClipboardR {
  /** parentType controls where this object can be pasted */
  parentType: RT,
  nodes: RecordNode<RT>[]
}

export type Clipboard = {
  metadata: Record<string, string>,
  content: ClipboardR[]
};