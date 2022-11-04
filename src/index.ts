import { 
  migrateProjectRJson, createNewProject, getHighestProjectVersion,
  migrateDeployment, createNewDeployment, getHighestDeploymentVersion,
  gv
} from "./migrations";

import {
  R, r, RF, rUtils,
  RecordNode, ROM, RecordMap, RT, RTP, rtp, createRecord, emptyROM,
  en, sn, vn, rn, pn, fn, CogObjectType, getFactory
} from "./r";

import { FileType, Source } from "./r/definitions/files";

export {
  R, r, RF, rUtils,
  RecordNode, ROM, RecordMap, RT, RTP, rtp, createRecord, emptyROM, getFactory,
  en, sn, vn, rn, pn, fn, CogObjectType,
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
  migrateProjectRJson,
  createNewProject,
  getHighestProjectVersion,
  migrateDeployment,
  createNewDeployment,
  getHighestDeploymentVersion,
  gv,
};

export { FileType, Source };
