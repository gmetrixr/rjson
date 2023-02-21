import { expect } from "chai";
import {r, migrations, en, RT, RecordNode, rtp} from "../../src";
import { migrateElement } from "../../src/migrations/project/r-migration-commands/m099_100_initial_r_migration";
import fs from "fs";
import safehands_r0 from "./jsons/safehands.r0.json";
import safehands_r100 from "./jsons/safehands.r100.json";
import safehands_r101 from "./jsons/safehands.r101.json";
import platformVarMigrationJson from "./jsons/platform_var_migration.json";
import colliderBoxJson from "./jsons/scenesWithColliderBoxElements.json";
import projectJsonCorruptionTest from "./jsons/project_json_corruption_test.json";

import actionbar_json         from "./jsons/r3fJsons/elements/actionbar.json";
import ar_json                from "./jsons/r3fJsons/elements/ar.json";
import audio_json             from "./jsons/r3fJsons/elements/audio.json";
import captureInput_json      from "./jsons/r3fJsons/elements/captureInput.json";
import cone_json              from "./jsons/r3fJsons/elements/cone.json";
import cube_json              from "./jsons/r3fJsons/elements/cube.json";
import cylinder_json          from "./jsons/r3fJsons/elements/cylinder.json";
import embedHtml_json         from "./jsons/r3fJsons/elements/embedHtml.json";
import gif_json               from "./jsons/r3fJsons/elements/gif.json";
import imageFlat_json         from "./jsons/r3fJsons/elements/imageFlat.json";
import imageFlat1_json        from "./jsons/r3fJsons/elements/imageFlat1.json";
import instructions_json      from "./jsons/r3fJsons/elements/instructions.json";
import pano_json              from "./jsons/r3fJsons/elements/pano.json";
import pano2_json             from "./jsons/r3fJsons/elements/pano2.json";
import panoVideo_json         from "./jsons/r3fJsons/elements/panoVideo.json";
import popup_json             from "./jsons/r3fJsons/elements/popup.json";
import productCard_json       from "./jsons/r3fJsons/elements/productCard.json";
import qrMatcher_json         from "./jsons/r3fJsons/elements/qrMatcher.json";
import qrReader_json          from "./jsons/r3fJsons/elements/qrReader.json";
import quizJson_json          from "./jsons/r3fJsons/elements/quizJson.json";
import share_json             from "./jsons/r3fJsons/elements/share.json";
import sphere_json            from "./jsons/r3fJsons/elements/sphere.json";
import text_json              from "./jsons/r3fJsons/elements/text.json";
import timer_json             from "./jsons/r3fJsons/elements/timer.json";
import torus_json             from "./jsons/r3fJsons/elements/torus.json";
import videoFlat_json         from "./jsons/r3fJsons/elements/videoFlat.json";
import { VarCategory } from "../../src/r/definitions/variables";

const { migrateProjectRJson, createNewProject, migrateDeployment, runHealthCheckMigrations, confirmNoCorruption} = migrations;

describe("r Migrations", () => {
  xit("should test r migration", () => {
    const r100 = migrateProjectRJson(safehands_r0, 100);
    // const r101 = migrateProjectRJson(safehands_r0, 101);
    // const r107 = migrateProjectRJson(accenture_r0);
    // const emptyProject = migrateProjectRJson({});
    // // fs.writeFileSync("./test/r/jsons/accenture.json",JSON.stringify(r107));

    // // const r102 = migrateProjectRJson(safehands_r0, 102);
    // // const rfinal = migrateProjectRJson(safehands_r0);
    // // fs.writeFileSync("./test/t/jsons/safehands.r100.json",JSON.stringify(r100));
    // // fs.writeFileSync("./test/t/jsons/safehands.r101.json",JSON.stringify(r101));
    // expect(emptyProject?.records?.scene?.map[100111]?.id).to.deep.equal(100111);
    expect(r100).to.deep.equal(safehands_r100);
    expect(r100).to.deep.equal(safehands_r100);
    // expect(r101).to.deep.equal(safehands_r101);
    // expect(r107).to.deep.equal(accenture_r);
  });

  xit("migrate elements", () => { //One time only, to create the json initially. No need to make part of test suite.
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/actionbar.json",     JSON.stringify(migrateElement(actionbar_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/ar.json",            JSON.stringify(migrateElement(ar_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/audio.json",         JSON.stringify(migrateElement(audio_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/captureInput.json",  JSON.stringify(migrateElement(captureInput_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/cone.json",          JSON.stringify(migrateElement(cone_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/cube.json",          JSON.stringify(migrateElement(cube_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/cylinder.json",      JSON.stringify(migrateElement(cylinder_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/embedHtml.json",     JSON.stringify(migrateElement(embedHtml_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/gif.json",           JSON.stringify(migrateElement(gif_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/imageFlat.json",     JSON.stringify(migrateElement(imageFlat_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/imageFlat1.json",    JSON.stringify(migrateElement(imageFlat1_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/instructions.json",  JSON.stringify(migrateElement(instructions_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/pano.json",          JSON.stringify(migrateElement(pano_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/pano2.json",         JSON.stringify(migrateElement(pano2_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/panoVideo.json",     JSON.stringify(migrateElement(panoVideo_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/popup.json",         JSON.stringify(migrateElement(popup_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/productCard.json",   JSON.stringify(migrateElement(productCard_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/qrMatcher.json",     JSON.stringify(migrateElement(qrMatcher_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/qrReader.json",      JSON.stringify(migrateElement(qrReader_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/quizJson.json",      JSON.stringify(migrateElement(quizJson_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/share.json",         JSON.stringify(migrateElement(share_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/sphere.json",        JSON.stringify(migrateElement(sphere_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/text.json",          JSON.stringify(migrateElement(text_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/timer.json",         JSON.stringify(migrateElement(timer_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/torus.json",         JSON.stringify(migrateElement(torus_json)));
    fs.writeFileSync("./test/r/jsons/r3fJsons/elementsMigrated/videoFlat.json",     JSON.stringify(migrateElement(videoFlat_json)));
    expect(true).to.be.true;
  });

  it("should test migrations on a new project", () => {
    const newProject = createNewProject();
    const projectF = r.project(newProject);
    const initialSceneId = projectF.getInitialSceneId();
    // 100111 is the default id injected when migrating from a t -> r project json
    expect(initialSceneId).to.not.eq(100111);
    const scene = projectF.getRecord(RT.scene, initialSceneId);
    if(scene) {
      const sceneF = r.scene(scene);
      const panoImage = sceneF.getAllDeepChildrenWithFilter(RT.element, (e) => e.props.element_type === en.ElementType.pano_image)?.[0];
      expect(panoImage).to.not.eq(undefined);
    }
  });

  it("should test new migrations on vars and templates", () => {
    const newProject = migrateProjectRJson(platformVarMigrationJson);
    const projectF = r.project(newProject);
    const deviceVar = projectF.getRecord(RT.variable, -9);
    expect(deviceVar?.props.var_category).to.eq(VarCategory.predefined);

    const childAndParentElement = projectF.getDeepChildAndParent(RT.element, 1632739254816);
    if(childAndParentElement) {
      expect(childAndParentElement.c.props.text).to.eq("#Welcome to the {{device_var}}  Metaverse! {{device_var}} hi there!");
    }

    const childAndParentThenAction = projectF.getDeepChildAndParent(RT.then_action, 1632738888029);
    if(childAndParentThenAction) {
      const properties = childAndParentThenAction.c.props.properties as string[];
      expect(properties[0]).to.eq("https://gmetri.com?{{device_var}}&test");
    }

    // also test for text version migration
    const scene = projectF.getRecord(RT.scene, 1632739370141) as RecordNode<RT.scene>;
    const textElement = r.scene(scene).getRecord(RT.element, 1632739254816) as RecordNode<RT.element>;

    expect(textElement.props.text_version).to.eq("v1");
  });

  it ("should test migration on deployment settings json", () => {
    const deploymentSettings = {
      room_instance_count: 5,
      enable_multiplayer_mode: false,
      room_instance_member_limit: 20
    }
    
    const newDeploymentJson = migrateDeployment(deploymentSettings);
    expect(newDeploymentJson.props.deployment_version).to.not.be.eq(undefined);
  })

  it ("should test migration to add default volume type to collider box element", () => {
    const project = migrateProjectRJson(colliderBoxJson);
    const projectF = r.project(project);

    const allColliderBoxElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.collider_volume);

    for (const el of allColliderBoxElements) {
      console.log('=============> ', el);
      const elementF = r.element(el);
      expect(elementF.get(rtp.element.volume_type)).to.be.eq(en.VolumeTypes.cube);
    }
  })

  it ("should test if json corruption issue get resolved", () => {
    expect(confirmNoCorruption(projectJsonCorruptionTest)).to.be.false;

    const {projectJson: fixedProject, corrections} = runHealthCheckMigrations(projectJsonCorruptionTest);
    console.log(corrections);
    expect(confirmNoCorruption(fixedProject)).to.be.true;
  })
});
