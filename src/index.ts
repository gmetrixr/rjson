import { migrateProjectRJson, gv, createNewProject } from "./migrations";

import {
  R, r, RF, rUtils,
  RecordNode, ROM, RecordMap, RT, RTP, rtp, createRecord, emptyROM,
  en, sn, vn, rn, CogObjectType, getFactory
} from "./r";

import { FileType, BillboardingTypes } from "./Definitions";

export {
  R, r, RF, rUtils,
  RecordNode, ROM, RecordMap, RT, RTP, rtp, createRecord, emptyROM, getFactory,
  en, sn, vn, rn, CogObjectType,
};

/**
 * pn: Project Namespace
 * sn: Scene Namespace
 * rn: Rule Namespace
 * en: Element Namespace
 * vn: Variable Namespace
 * shn: Shopping Namespace
 * spn: Special Element Namespace
 */
// export {pn, sn, rn, en, vn, tn, shn, spn};

/**
 * rpn: Rule Print Namespace
 */
// export {rpn};

export {
  gv,
  migrateProjectRJson,
  createNewProject
};

export { FileType, BillboardingTypes };
