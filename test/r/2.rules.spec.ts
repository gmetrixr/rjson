import { r, RecordNode, RT, rtp } from "../../src/r";
import { expect } from "chai";
import { rulePrintUtils } from "../../src/r/definitions/rules";
import projectSafehands from "./jsons/r3fJsons/projectsMigrated/project_safehands.json";
import projectDealerxr from "./jsons/r3fJsons/projectsMigrated/project_dealerxr.json";

describe("r RecordFactory tests", () => {
  it("Should print rules", () => {
    const projectF = r.project(projectSafehands);
    const scenes = projectF.getRecords(RT.scene);
    const varDefROM = projectF.getROM(RT.variable);
    console.log();
    console.log("Project Safehands Console rules:");
    for(const sceneJson of scenes) {
      rulePrintUtils.generateRuleTextsAndPrint(sceneJson, varDefROM);
    }
    console.log();
    console.log("Project Safehands Friendly rules:");
    rulePrintUtils.generateFriendlyRuleTextsAndPrint(projectSafehands, r.project(projectSafehands).getRecordOrder(RT.scene));
    console.log();
    console.log("Project Dealerxr Friendly rules:");
    const sceneIds = r.project(projectDealerxr).getRecordOrder(RT.scene);
    const sceneIdsToPrint = [sceneIds[0], sceneIds[1], sceneIds[2]];
    rulePrintUtils.generateFriendlyRuleTextsAndPrint(projectDealerxr, sceneIdsToPrint);
  })
})
