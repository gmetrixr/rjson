import { r, rn, RT, rUtils } from "../../src/r";
import { expect } from "chai";
import { rulePrintUtils } from "../../src/r/definitions/rules";
import projectSafehands from "./jsons/r3fJsons/projectsMigrated/project_safehands.json";
import projectDealerxr from "./jsons/r3fJsons/projectsMigrated/project_dealerxr.json";
import unnamedRulesProject from "./jsons/unnamedRulesProject.json";
import { migrateProjectRJson } from "../../src/migrations/index";

const { rEventProperties, WhenEventProperty, rEventPropertyDefaults, ThenActionProperty, rActionPropertyDefaults } = rn;


describe("rule event property default logs", () => {
  it("should log default value for duration property", () => { 
    expect(rEventPropertyDefaults[WhenEventProperty.duration]).to.equal(0);
  });

  it("should log default value for phrase property", () => {
      expect(rEventPropertyDefaults[WhenEventProperty.phrase]).to.equal("");
  });
});

describe("rule action property default logs", () => {
  it("should log default value for volume property", () => {
    expect(rActionPropertyDefaults[ThenActionProperty.volume]).to.equal(0);
  });

  it("should log default value for target property", () => {
    expect(rActionPropertyDefaults[ThenActionProperty.target]).to.equal("same_page");
  });

  it("should log default value for actionbar_element_id property", () => {
    expect(rActionPropertyDefaults[ThenActionProperty.actionbar_element_id]).to.equal(0);
  });
});

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
  });

  it ("should add names to all unnamed rules in project", () => {
    const unnamedRules = migrateProjectRJson(unnamedRulesProject);
    const projectF = r.project(unnamedRules);

    const rules = projectF.getAllDeepChildren(RT.rule);
    let rulesWithNames = 0;
    let rulesWithoutNames = 0;
    
    rules.forEach(r => {
      if (r.name?.trim() === "") {
        rulesWithoutNames++;
      } else {
        rulesWithNames++;
      }
    })

    expect(rules.length).to.be.eq(rulesWithNames);
    expect(rulesWithoutNames).to.be.eq(0);
  });
});
