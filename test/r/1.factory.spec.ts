import { createRecord, en, r, R, RecordNode, RT, rtp } from "../../src/r";
import { migrations } from "../../src/migrations";
import { expect } from "chai";
import safehands_r101 from "./jsons/safehands.r101.json";
import project_variable_template from "./jsons/project_variable_template.json";
import project_reparenting from "./jsons/project_reparenting.json";
import project_add_element_to_group from "./jsons/project_add_element_to_group.json";
import { ProjectUtils } from "../../src/r/recordFactories/ProjectFactory";
import { SceneProperty } from "../../src/r/recordTypes/Scene";
import { ElementProperty } from "../../src/r/recordTypes/Element";
import { performance } from "perf_hooks";
import project1 from "./jsons/search1.json";
import projectGrp from "./jsons/search2.json";
import project_big from "./jsons/search_big.json";
import projectVar from "./jsons/searchVar.json";
import projectProps from "./jsons/searchPropsElementId.json";
import projectActionbar from "./jsons/searchActionbar.json";
import { jsUtils } from "@gmetrixr/gdash";
import variableCheckJson from "./jsons/variable_check.json";
import menuConsistencyJson from "./jsons/menu_consistency.json";
import { ElementType } from "../../src/r/definitions/elements";
import copyPasteElementSampleJson from "./jsons/copyPasteElementSampleJson.json";
import identicalScenesJson from "./jsons/identicalScenes.json";

const { migrateProjectRJson, createNewProject } = migrations;
const reprentingClone = jsUtils.deepClone(project_reparenting);
const { deepClone } = jsUtils;

describe("r SceneFactory test", () => {
  it("should add a quiz element", () => {
    const projectF = r.project(safehands_r101);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      const quizRecord = projectF.addElementOfTypeToScene({ sceneId: scene1.id, elementType: en.ElementType.quiz }) as R.RecordNode<RT.element>;
      const quizInstructionsKeys = Object.keys(quizRecord);
      expect(quizInstructionsKeys.includes("heading"));
    }
  });
});

describe("r RecordFactory tests", () => {
  it("should check referential equality on getting json", () => {
    expect(r.record<RT.project>(safehands_r101).json() === safehands_r101).to.be.true;
  });

  it("should get property value or default", () => {
    // TODO: Add test case for function to return default value (currently all props are set that's why default won't be returned ever)
    expect(r.record(safehands_r101).getValueOrDefault(rtp.project.zoom_level_fov)).to.equal(75);
  });

  it("should get property value", () => {
    expect(r.record(safehands_r101).get(rtp.project.zoom_level_fov)).to.equal(75);
  });

  it("should get property default", () => {
    expect(r.record(safehands_r101).getDefault(rtp.project.version)).to.equal(0);
  });

  it("should get scenes record (map + order)", () => {
    const scenes = r.record(safehands_r101).getROM(RT.scene);
    expect(scenes === safehands_r101.records.scene).to.equal(true);
  });

  it("should get scenes record order", () => {
    const sceneOrder = r.record(safehands_r101).getRecordOrder(RT.scene);
    expect(sceneOrder === safehands_r101.records.scene.order).to.equal(true);
  });

  it("should get scenes record map for id", () => {
    const sceneMapForId = r.record(safehands_r101).getRecord(RT.variable, -2);
    expect(sceneMapForId === safehands_r101.records.variable.map["-2"]).to.equal(true);
  });

  it("should change record id", () => {
    const record = r.record(safehands_r101).changeRecordId(RT.variable, -2, -202);
    expect(record?.id).to.equal(-202);
  });

  it("should change record name", () => {
    const record = r.record(safehands_r101).changeRecordName(RT.scene, 1584704711152, "New Home");
    expect(record?.name).to.equal("New Home");
  });

  it("should add record", () => {
    const projectF = r.record(safehands_r101);
    projectF.addRecord({ "id": 1, "type": "shopping", "props": { "store_name": "souled_store", "plugin": "souled_store", "endpoint": "http://localhost", "currency_prefix": "$", "show_cart": true }, "records": { "product": { "order": [1615980276584], "map": { "1615980276584": { "id": 1615980276584, "type": "product", "props": { "element_id": 1615888204720, "product_sku": "1234567", "scene_id": 1615888151427 } } } } } } as RecordNode<RT.shopping>);
    expect(projectF.json()?.records !== undefined).to.equal(true);
  });
});

describe("Test RecordNode addresses", () => {
  const parentAddr = `${safehands_r101.type}:${safehands_r101.id}`;
  const safeHandMigrated = migrateProjectRJson(safehands_r101);
  const recordF = r.record<RT.project>(safeHandMigrated);

  it("should return correct address of the RecordNode", () => {
    const sceneHome = recordF.getRecord(RT.scene, 1584704711152);

    if (sceneHome) {
      const sceneF = r.record(sceneHome);
      const sceneHomeAddr = sceneF.getSelfRecordAddress(parentAddr);
      expect(sceneHomeAddr).to.equal("project:1|scene:1584704711152");

      const videoElement = sceneF.getRecord(RT.element, 1584704979049);
      if (videoElement) {
        const recordF = r.record(videoElement);
        expect(recordF.getSelfRecordAddress(sceneHomeAddr)).to.equal("project:1|scene:1584704711152|element:1584704979049");
      }
    }
  });

  it("should return correct property addresses for a recordnode", () => {
    const sceneHome = recordF.getRecord(RT.scene, 1584704711152);

    if (sceneHome) {
      const sceneF = r.record(sceneHome);
      const sceneAddr = sceneF.getSelfRecordAddress(parentAddr);
      const sceneHomeAddr = sceneF.getPropertyAddress(sceneAddr, SceneProperty.scene_allow_zooming);
      expect(sceneHomeAddr).to.equal("project:1|scene:1584704711152!scene_allow_zooming");

      const videoElement = sceneF.getRecord(RT.element, 1584704979049);
      if (videoElement) {
        const sceneHomeAddr = sceneF.getSelfRecordAddress(parentAddr);
        const recordF = r.record(videoElement);
        const recordAddr = recordF.getSelfRecordAddress(sceneHomeAddr);
        expect(recordF.getPropertyAddress(recordAddr, ElementProperty.opacity)).to.equal("project:1|scene:1584704711152|element:1584704979049!opacity");
      }
    }
  });
  it("gets the correct record node at an address", () => {
    const st = performance.now();
    const elementVideoFlatInSceneLearn = recordF.getRecordAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856");
    const et = performance.now();
    console.log(`Time taken: [getRecordAtAddress]: project:1|scene:1584636875821|element:1584732363809|element:1584638773856`, (et - st) + " ms");
    expect(elementVideoFlatInSceneLearn).not.equal(null);

    const st1 = performance.now();
    const sceneHome = recordF.getRecordAtAddress("project:1|scene:1584704711152");
    const et1 = performance.now();
    console.log(`Time taken: [getRecordAtAddress]: project:1|scene:1584704711152`, (et1 - st1) + " ms");
    expect(sceneHome?.id).to.equal(1584704711152);

    const st2 = performance.now();
    const invalidScene = recordF.getRecordAtAddress("project:1|scene");
    const et2 = performance.now();
    console.log(`Time taken: [getRecordAtAddress]: project:1|scene`, (et2 - st2) + " ms");
    expect(invalidScene).to.be.null;
  });

  it("gets the correct record node and it's parent at an address", () => {
    const elementVideoFlatInSceneLearn = recordF.getRecordAndParentAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856");
    expect(elementVideoFlatInSceneLearn?.c).not.equal(null);
    expect(elementVideoFlatInSceneLearn?.p).not.equal(null);

    const sceneHome = recordF.getRecordAndParentAtAddress("project:1|scene:1584704711152");
    expect(sceneHome?.c.id).to.equal(1584704711152);

    const invalidScene = recordF.getRecordAndParentAtAddress("project:1|scene");
    expect(invalidScene).to.be.null;
  });

  it("should update scene property values at address", () => {
    const st1 = performance.now();
    const updated = recordF.updatePropertyAtAddress("project:1|scene:1584704711152!scene_yaw_start", 140);
    const et1 = performance.now();
    console.log(`Time taken: [updatePropertyAtAddress]: (project:1|scene:1584704711152!scene_yaw_start, 140)`, (et1 - st1) + " ms");
    expect(updated).to.equal(true);
    const sceneHome = recordF.getRecord(RT.scene, 1584704711152);
    expect(sceneHome?.props.scene_yaw_start).to.equal(140);
  });

  it("should test element property(non-indexed) updates at address", () => {
    const st2 = performance.now();
    const elementUpdated = recordF.updatePropertyAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856!opacity", 0.45);
    const et2 = performance.now();
    console.log(`Time taken: [updatePropertyAtAddress]: (project:1|scene:1584636875821|element:1584732363809|element:1584638773856!opacity, 0.45) `, (et2 - st2) + " ms");
    expect(elementUpdated).to.equal(true);

    const updatedElement = recordF.getRecordAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856");
    expect(updatedElement?.props.opacity).to.equal(0.45);
  });

  it("should test element property(indexed) updates at address", () => {
    const st2 = performance.now();
    const elementUpdated = recordF.updatePropertyAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856!placer_3d>3", 999);
    const et2 = performance.now();
    console.log(`Time taken: [updatePropertyAtAddress]: (project:1|scene:1584636875821|element:1584732363809|element:1584638773856!placer_3d>3, 999) `, (et2 - st2) + " ms");
    expect(elementUpdated).to.equal(true);

    const updatedElement = recordF.getRecordAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856");
    expect((updatedElement?.props?.placer_3d as number[])?.[3]).to.equal(999);

    const invalidElementUpdated = recordF.updatePropertyAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856!placer_3d", 999);
    expect(invalidElementUpdated).to.equal(false);
  });
  it("measures performance of 100 calls", () => {
    const st = performance.now();
    for (let i = 0; i < 100; i++) {
      recordF.getRecordAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856");
    }
    const et = performance.now();
    console.log(`Time taken (100x): [getRecordAtAddress]: project:1|scene:1584636875821|element:1584732363809|element:1584638773856`, ((et - st) / 100) + " ms");

    const st1 = performance.now();
    for (let i = 0; i < 1000; i++) {
      recordF.getRecordAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856");
    }
    const et1 = performance.now();
    console.log(`Time taken (1000x): [getRecordAtAddress]: project:1|scene:1584636875821|element:1584732363809|element:1584638773856`, ((et1 - st1) / 1000) + " ms");

    const st2 = performance.now();
    for (let i = 0; i < 100; i++) {
      recordF.updatePropertyAtAddress("project:1|scene:1584636875821|element:1584732363809|element:1584638773856!placer_3d>3", 999);
    }
    const et2 = performance.now();
    console.log(`Time taken (100x): [updatePropertyAtAddress]: (project:1|scene:1584636875821|element:1584732363809|element:1584638773856!placer_3d>3, 999) `, ((et2 - st2) / 100) + " ms");
  });
});

describe("test for clipboard operations", () => {
  const projectF = r.project(project_variable_template);
  it("should get all the scenes and variables used in a particular scene", () => {
    const st1 = performance.now();
    const clipboardData = projectF.copyToClipboardObject([1625580045278, -2]);
    const et1 = performance.now();
    console.log(`Time taken: [projectF.copyToClipboardObject]> ids: [1625580045278] `, ((et1 - st1)) + " ms");
    const scoreVariableCopied = clipboardData.nodes.find(r => r.id === -2);
    const numberVariableCopied = clipboardData.nodes.find(r => r.id === 1625580371232);
    const booleanVariableCopied = clipboardData.nodes.find(r => r.id === 1625579870522);
    expect(scoreVariableCopied).not.to.equal(null);
    expect(numberVariableCopied).not.to.equal(null);
    expect(booleanVariableCopied).not.to.equal(null);

    const st2 = performance.now();
    for (let i = 0; i < 100; i++) {
      projectF.copyToClipboardObject([1625580045278]);
    }
    const et2 = performance.now();
    console.log(`Time taken (100x): [projectF.copyToClipboardObject]> ids: [1625580045278] `, ((et2 - st2) / 100) + " ms");
  });
});

describe("Tests re-parenting factory functions", () => {
  /**
   * Example 1:
   * Scene1
   *  Element1 <-------|
   *  Element2         |
   *  Element3 (group) |
   *    Element31 -----|
   *    Element32
   */
  it("should re-parent elements correctly for Example1", () => {
    const projectF = r.record<RT.project>(project_reparenting);
    const destinationPos = 0;
    const destParentAddr = "project:1|scene:1625732430168";
    const sourceRecordAddr: { parentAddr: string; recordAddr: string; }[] = [
      {
        recordAddr: "project:1|scene:1625732430168|element:1625732943565|element:1625732909131",
        parentAddr: "project:1|scene:1625732430168|element:1625732943565"
      }
    ];
    projectF.reParentRecordsWithAddress(destParentAddr, sourceRecordAddr, destinationPos);
    const scene = projectF.getRecord(RT.scene, 1625732430168);
    // check that the element has moved to scene element level
    expect(scene?.records?.element?.order.includes(1625732909131)).to.equal(true);
    expect(scene?.records?.element?.map["1625732909131"]).to.not.equal(null);

    // check that the elment has been removed from the group
    const group = r.record<RT.scene>(scene as RecordNode<RT.scene>).getRecord(RT.element, 1625732943565);
    const gR = r.record<RT.element>(group as RecordNode<RT.element>);
    const childElement = gR.getRecord(RT.element, 1625732909131);
    expect(childElement).to.equal(undefined);
  });

  /**
   * Example 2:
   * Scene1
   *  Element1
   *  Element2
   *  Group1 (group)<-----|
   *    Element11         |
   *    Element12         |
   *  Group2 (group)------|
   *    Element21
   *    Element22
   * Scene2
   *  Element4
   *  Element5
   */
  it("should fail re-pareting groups within groups", () => {
    const projectF = r.project(project_reparenting);
    const destinationPos = 1;
    const destParentAddr = "project:1|scene:1625732430168|element:1625732943565";
    const sourceRecordAddr: { parentAddr: string; recordAddr: string; }[] = [
      {
        recordAddr: "project:1|scene:1625732430168|element:1626174199208",
        parentAddr: "project:1|scene:1625732430168"
      }
    ];
    const [reParentedRecords, failedReParetedRecords] = projectF.reParentRecordsWithAddress(destParentAddr, sourceRecordAddr, destinationPos);
    expect(reParentedRecords.length).to.equal(0);
    expect(failedReParetedRecords[0]?.id).to.equal(1626174199208);
  });
});

describe("Simple search function", () => {
  const projectUtils1 = new ProjectUtils();
  const projectUtilsGroup = new ProjectUtils();
  const projectUtilsVar = new ProjectUtils();
  const projectUtilsBig = new ProjectUtils();
  const projectUtilsProps = new ProjectUtils();

  it("Checks if the search dictionaries are properly built", () => {
    projectUtils1.buildRulesDictionary(project1, 1598360479480);

    expect(Object.keys(projectUtils1.elementNamesDict)).to.have.lengthOf(13);
    expect(Object.keys(projectUtils1.variableNamesDict)).to.have.lengthOf(4);
    expect(Object.keys(projectUtils1.ruleNamesDict)).to.have.lengthOf(10);
    expect(Object.keys(projectUtils1.accentColorsDict)).to.have.lengthOf(2);
  });

  it("Tries to search in rules by accent color only", () => {
    const searchResults = projectUtils1.simpleSearchInRules({ searchString: "", accentColor: "#8ED1FC" });
    expect(searchResults).to.have.deep.members([
      1601479016695,
      1600440390818,
      1599713097496,
      1599117158283,
      1598360883265,
      1598361476250,
      1598361296971,
      1598360790208,
      1626946632899,
    ]);
  });

  it("Tries to search in rules by rule name and accent color in different case", () => {
    const searchResults = projectUtils1.simpleSearchInRules({ searchString: "103", accentColor: "#949fA8" });
    expect(searchResults).to.have.deep.members([1598360763103]);
  });

  it("Tries to check whether we can search for elements within group", () => {
    projectUtilsGroup.buildRulesDictionary(projectGrp, 1652633293080);
    const searchResults = projectUtilsGroup.simpleSearchInRules({ searchString: "groupCube" });
    console.log(projectUtilsGroup.elementNamesDict);
    console.log(projectUtilsGroup.ruleNamesDict);
    console.log(projectUtilsGroup.eventsDict);
    expect(searchResults).to.have.deep.members([1654497834116])
  });

  it("Tries to check whether we can search for event names", () => {
    projectUtilsGroup.buildRulesDictionary(projectGrp, 1652633293080);
    const searchResults = projectUtilsGroup.simpleSearchInRules({ searchString: "preload" });
    console.log(projectUtilsGroup.eventsDict);
    expect(searchResults).to.have.deep.members([1654497834116])
  })

  it("Tries to check whether we can search for action names", () => {
    projectUtilsGroup.buildRulesDictionary(projectGrp, 1652633293080);
    const searchResults = projectUtilsGroup.simpleSearchInRules({ searchString: "show" });
    console.log(projectUtilsGroup.actionDict);
    expect(searchResults).to.have.deep.members([1654497834116, 1654497573958])
  })


  it("Tries to check whether we search for variable names in events", () => {
    projectUtilsVar.buildRulesDictionary(projectVar, 1654753854758);
    const searchResults = projectUtilsVar.simpleSearchInRules({ searchString: "firstname" });
    console.log(projectUtilsVar.variableNamesDict);
    expect(searchResults).to.have.deep.members([1654754110739])
  });

  it("Tries to check whether we can search for element_id props", () => {
    projectUtilsProps.buildRulesDictionary(projectProps, 1654753854758);
    const searchResults = projectUtilsProps.simpleSearchInRules({ searchString: "cylinder" });
    expect(searchResults).to.have.deep.members([1654754110739])
  });

  it("Tries to check whether we can search for scene_id props", () => {
    projectUtilsVar.buildRulesDictionary(projectVar, 1654753854758);
    const searchResults = projectUtilsVar.simpleSearchInRules({ searchString: "scene" })
    expect(searchResults).to.have.deep.members([1654754110739, 1654754178869])
  });

  it("Tries to check whether we can search for action_bar elements", () => {
    projectUtilsProps.buildRulesDictionary(projectActionbar, 1654753854758);
    const searchResults = projectUtilsProps.simpleSearchInRules({ searchString: "button" })
    expect(searchResults).to.have.deep.members([1654754178869]);
  })

  it("Builds dictionary from a large scene and checks performance", () => {
    console.time("Time taken:");
    projectUtilsBig.buildRulesDictionary(project_big, 1593610480073);
    console.timeEnd("Time taken:");

    expect(Object.keys(projectUtilsBig.elementNamesDict)).to.have.lengthOf(60);
    expect(Object.keys(projectUtilsBig.variableNamesDict)).to.have.lengthOf(1);
    expect(Object.keys(projectUtilsBig.ruleNamesDict)).to.have.lengthOf(41);
    expect(Object.keys(projectUtilsBig.accentColorsDict)).to.have.lengthOf(2);
  });

  it("Tries to search in rules by rule name only and checks performance", () => {
    console.time("Time taken:");
    const searchResults = projectUtilsBig.simpleSearchInRules({ searchString: "076" });
    console.timeEnd("Time taken:");
    expect(searchResults).to.have.lengthOf(11);
  });

  it("Tries to search in rules by element name only and checks performance", () => {
    console.time("Time taken:");
    const searchResults = projectUtilsBig.simpleSearchInRules({ searchString: "ryzen" });
    console.timeEnd("Time taken:");
    expect(searchResults).to.have.deep.members([
      1593767144487,
      1593713313299,
      1593713136194,
      1593767364731,
      1593712768066,
      1593712933349,
      1593767258933,
      1593713442741
    ]);
  });
});

describe("Test project factory functions", () => {
  const simpleProject: RecordNode<RT.project> = {
    id: 1,
    type: "project",
    name: "project",
    props: {},
    records: {
      variable: {
        order: [],
        map: {}
      },
      scene: {
        order: [],
        map: {}
      }
    },
  };

  it("should addBlankRecord to check only the boolean show_menu is getting updated", () => {
    const project = createRecord(RT.project);
    project.props.auto_add_new_scene_to_menu = false;
    const projectR = r.project(project);
    projectR.addBlankRecord(RT.scene);
    projectR.addBlankRecord(RT.scene);
    const menus = projectR.getRecords(RT.menu);
    expect(menus.length).to.greaterThan(0);
    expect(menus.length).to.eq(2);
  });

  it("should create new project", () => {
    const project = createNewProject();
    const projectF = r.project(project);
    const records = projectF.getRecords(RT.scene);
    const menus = projectF.getRecords(RT.menu);
    const scenes = projectF.getRecords(RT.scene);
    expect(records.length).to.eq(1);
    expect(menus.length).to.eq(scenes.length);
    expect(menus[0].props.menu_scene_id).to.eq(scenes[0].id);
  });

  it("should duplicate the element inside a group", () => {
    const projectF = r.project(reprentingClone);
    const scene = projectF.getRecord(RT.scene, 1625732430168);
    expect(scene).to.not.eq(undefined);
    if (scene) {
      const sceneF = r.scene(scene);
      const newElement = sceneF.duplicateDeepRecord(RT.element, 1625732909131);
      expect(newElement).to.not.eq(undefined);
      if (newElement) {
        const deepParentAndChild = sceneF.getDeepChildAndParent(RT.element, newElement.id);
        expect(deepParentAndChild).to.not.eq(undefined);
      }
    }
  });

  it("should paste variables into the project", () => {
    const var1: RecordNode<RT.variable> = {
      id: 2,
      name: "var1",
      type: "variable",
      props: {
        var_type: "number"
      }
    };

    const clipboard: R.ClipboardR = {
      parentType: RT.project,
      nodes: [var1]
    };
    const projectF = r.project(simpleProject);
    projectF.pasteFromClipboardObject({ obj: clipboard });
    const vars = projectF.getRecords(RT.variable);
    const insertedVar = projectF.getRecord(RT.variable, 2);
    expect(vars.length).to.eq(1);
    expect(insertedVar).to.not.eq(undefined);
  });

  it("should not insert variable when id and name exists", () => {
    // ! same var was inserted in previous step
    const var2: RecordNode<RT.variable> = {
      id: 2,
      name: "var1",
      type: "variable",
      props: {
        var_type: "number"
      }
    };
    const clipboard: R.ClipboardR = {
      parentType: RT.project,
      nodes: [var2]
    };
    const projectF = r.project(simpleProject);
    projectF.pasteFromClipboardObject({ obj: clipboard });
    const vars = projectF.getRecords(RT.variable);
    expect(vars.length).to.eq(1);
  });

  it("should update the var_ids in all inserted scene's then actions and when events", () => {
    const whenEvent: RecordNode<RT.when_event> = {
      id: 1,
      type: "when_event",
      name: "WhenEvent1",
      props: {
        co_id: 99,
        event: "on_var_change",
        co_type: "number",
        properties: [],
      }
    };

    const thenAction: RecordNode<RT.then_action> = {
      id: 1,
      type: "then_action",
      name: "WhenEvent1",
      props: {
        co_id: 100,
        action: "set_to_number",
        co_type: "number",
        properties: [51],
      }
    };

    // there already exists a var with the name var1
    const var1: RecordNode<RT.variable> = {
      id: 99,
      name: "var1",
      type: "variable",
      props: {
        var_type: "number"
      }
    };

    const var2: RecordNode<RT.variable> = {
      id: 100,
      name: "var11",
      type: "variable",
      props: {
        var_type: "number"
      }
    };

    const scene1: RecordNode<RT.scene> = {
      id: 4,
      type: "scene",
      name: "scene1",
      props: {},
      records: {
        when_event: {
          order: [1],
          map: {
            1: whenEvent
          }
        },
        then_action: {
          order: [1],
          map: {
            1: thenAction
          }
        }
      }
    };

    const clipboard: R.ClipboardR = {
      parentType: RT.project,
      nodes: [var1, var2, scene1]
    };

    const projectF = r.project(simpleProject);
    projectF.pasteFromClipboardObject({ obj: clipboard });
    const vars = projectF.getRecords(RT.variable);
    // 2 vars should exist
    // 1. id = 2 and 2. id = 100
    expect(vars.length).to.eq(2);
    expect(vars[0]?.id).to.eq(2);
    expect(vars[1]?.id).to.eq(100);

    const whenEventAfterUpdate = projectF.getDeepChildAndParent(RT.when_event, 1);
    const thenActionAfterUpdate = projectF.getDeepChildAndParent(RT.then_action, 1);

    expect(whenEventAfterUpdate?.c.props.co_id).to.eq(2);
    expect(thenActionAfterUpdate?.c.props.co_id).to.eq(100);
  });

  it("should sync menu with scenes", () => {
    //Scene ids: 1635504394652
    //Menu ids: 1635421553804 with menu_scene_id: 1635421453804
    //Expected outcome: 1) menu entry. With menu entry for scene id 1635504394652
    const projectF = r.project(menuConsistencyJson);
    projectF.syncMenuWithScenes();

    const menus = projectF.getRecords(RT.menu)
    expect(menus.length).to.be.eq(1);
    //Only 1 entry
    const menu = menus[0];
    expect(menu.props.menu_scene_id).to.be.equal(1635504394652);
  });
});

const simpleGroupJson: RecordNode<RT.element> = {
  name: "Group 1",
  id: 2,
  props: { element_type: "group" },
  type: "element",
  records: {
    element: {
      order: [31, 32, 33],
      map: {
        31: {
          id: 31,
          name: "Group Element 1",
          type: "element",
          props: { element_type: "image_flat" },
        },
        32: {
          id: 32,
          name: "Group Element 2",
          type: "element",
          props: { element_type: "video_flat" },
        },
        33: {
          id: 33,
          name: "Group 2",
          type: "element",
          props: { element_type: "group" },
          records: {
            element: {
              order: [31, 32],
              map: {
                31: {
                  id: 31,
                  name: "Group Element 1",
                  type: "element",
                  props: { element_type: "image_flat" },
                },
                32: {
                  id: 32,
                  name: "Group Element 2",
                  type: "element",
                  props: { element_type: "video_flat" },
                }
              }
            }
          }
        }
      }
    }
  }
};

const simpleSceneJson: RecordNode<RT.scene> = {
  id: 1,
  type: "scene",
  name: "group testing",
  props: {},
  records: {
    element: {
      order: [2],
      map: {
        2: simpleGroupJson
      }
    }
  }
};

it("should copy element from root and paste into group with different element id", () => {
  const sceneF = r.scene(copyPasteElementSampleJson);
  const clipboard = sceneF.copyToClipboardObject([1639028973948]);
  const groupElement = sceneF.getRecord(RT.element, 1639648138090);
  if (groupElement) {
    const sourceElement = deepClone(sceneF.getRecord(RT.element, 1639028973948));
    const groupElementF = r.element(groupElement);
    clipboard.parentType = RT.element;
    groupElementF.pasteFromClipboardObject({ obj: clipboard });

    const allGroupElementAfterCopy = groupElementF.getRecords(RT.element);
    // element should be added to group element
    expect(allGroupElementAfterCopy.length).to.be.eq(3);
    if (sourceElement) {
      // source element id should not be changed
      expect(sourceElement.id).to.be.eq(1639028973948);
      // source element id should different then destination element
      expect(groupElementF.getRecord(RT.element, sourceElement.id)).to.be.eq(undefined);
    }
  }
});

describe("Test SceneFactory methods", () => {
  it("should create new ids for children of duplicated groups ", () => {
    const sceneF = r.scene(simpleSceneJson);
    const duplicatedElement = sceneF.duplicateDeepRecord(RT.element, 2);
    expect(duplicatedElement?.records?.element?.order[0]).to.not.eq(31);
    expect(duplicatedElement?.records?.element?.order[0]).to.not.eq(32);
  });
  it("should return all children in path", () => {
    const sceneF = r.scene(simpleSceneJson);
    const breadcrumbs = sceneF.getBreadcrumbs(31, RT.element);
    expect(breadcrumbs.length).to.be.eq(3);
    expect(breadcrumbs[0]?.id).to.be.eq(1);
    expect(breadcrumbs[1]?.id).to.be.eq(2);
    expect(breadcrumbs[2]?.id).to.be.eq(31);
  });
  it("should return address from breadcrumbs", () => {
    const sceneF = r.scene(simpleSceneJson);
    const address = sceneF.getDeepRecordAddress({ id: 31, type: RT.element});
    expect(address).to.be.eq("scene:1|element:2|element:31");
  });
  it("should return address from correct scene", () => {
    const projectF = r.project(identicalScenesJson);
    const address = projectF.getDeepChildRecordAddress({ id: 1659959164940, type: RT.element, sceneId: 1659959948577, parentAddr: projectF.getSelfRecordAddress() });
    expect(address).to.be.eq("project:1659944805083|scene:1659959948577|element:1659959164940");
  })
  it("should return record + parent address ", () => {
    const sceneF = r.scene(simpleSceneJson);
    const address = sceneF.getDeepChildAndParentAddress(31, RT.element);
    expect(address).to.not.eq(undefined);
    expect(address?.[0]).to.be.eq("scene:1|element:2|element:31");
    expect(address?.[1]).to.be.eq("scene:1|element:2");
  });
  it("should return record + parent address for non group element", () => {
    const sceneF = r.scene(simpleSceneJson);
    const address = sceneF.getDeepChildAndParentAddress(2, RT.element);
    expect(address).to.not.eq(undefined);
    expect(address?.[0]).to.be.eq("scene:1|element:2");
    expect(address?.[1]).to.be.eq("scene:1");
  });
});

describe("Record Factory Change Record Name Tests", () => {
  it("should change record name for lead gen field linked variable to {{Lead Gen Name}}_var", () => {
    r.project(variableCheckJson).changeRecordName(RT.lead_gen_field, 1635938339941, "EmailORAddress");
    expect(r.project(variableCheckJson).getRecord(RT.variable, 1635938561940)?.name).to.equal("EmailORAddress_var");
  });

  it("should change variable name for media upload to {{Element Name}}_var", () => {
    r.project(variableCheckJson).changeSceneSubRecordName(1635504394652, RT.element, 1635938857913, "PhotoOrAudio");
    expect(r.project(variableCheckJson).getRecord(RT.variable, 1635938869688)?.name).to.equal("PhotoOrAudio_var");
    //Check an element that used this variable name a template
    //Original text: "The Media Upload path is {{Media Upload Var}}"
    expect(r.project(variableCheckJson).getDeepChildAndParent(RT.element, 1635931357115)?.c?.props.text).to.equal("The Media Upload path is {{PhotoOrAudio_var}}");
  });
});

describe("Test ElementFactory methods", () => {
  it("should add a new child to the group ", () => {
    const elementF = r.element(simpleGroupJson);
    const addedElement = elementF.addElementOfType(ElementType.polygon, 2);
    const elementOrder = elementF.getRecordOrder(RT.element);
    expect(elementOrder.indexOf(addedElement.id)).to.eq(2);
  });
  it("should return all children in path", () => {
    const elementF = r.element(simpleGroupJson);
    const breadcrumbs = elementF.getBreadcrumbs(32, RT.element);
    expect(breadcrumbs.length).to.be.eq(2);
    expect(breadcrumbs[0]?.id).to.be.eq(2);
    expect(breadcrumbs[1]?.id).to.be.eq(32);
  });
});

describe("Test adding an element to group", () => {
  it("should add an element to a scene, reparent (move) it to the specified group", () => {
    const projectF = r.project(project_add_element_to_group);
    const destinationPos = 0;

    const addedRecord = projectF.addElementOfTypeToScene({ sceneId: 1625732430168, elementType: en.ElementType.cylinder, position: destinationPos, groupElementId: 1625732943565 }) as R.RecordNode<RT.element>;
    //* get the group where you wanted to add the element to
    const scene = projectF.getRecord(RT.scene, 1625732430168) as RecordNode<RT.scene>;
    const sceneF = r.scene(scene);
    const group = sceneF.getRecord(RT.element, 1625732943565) as RecordNode<RT.element>;

    //* added record should be visible here now after reparenting
    expect(group?.records?.element?.order.includes(addedRecord.id)).to.equal(true);
  });
});
