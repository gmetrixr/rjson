import { en, fn, r, R, RecordNode, RT, rtp, sn, pn } from "../../src/r";
import { migrations } from "../../src/migrations";
import { expect } from "chai";
import oneSceneWithGroup from "./jsons/oneSceneWithGroup.json";
import simpleSceneWithPano from "./jsons/simpleSceneWithPano.json";
import { ClipboardR } from "../../src/r/R";
import scormElementJson from "./jsons/r3fJsons/clipboardEntries/scormElement.json";
import mediaUploadJson from "./jsons/r3fJsons/clipboardEntries/mediaUploadElement.json";
import sceneContainingGroupInGroup from "./jsons/r3fJsons/clipboardEntries/sceneContainingGroupInGroup.json";
import sceneWithElementJson from "./jsons/r3fJsons/clipboardEntries/sceneWithElement.json";
import sceneContainingScorm from "./jsons/r3fJsons/clipboardEntries/sceneContainingScorm.json";
import scormElementsInsideGroup from "./jsons/r3fJsons/clipboardEntries/scormElementsInsideGroup.json";
import twoScenesWithScorm from "./jsons/twoScenesWithScorm.json";
import twoScenesWithProductCard from "./jsons/twoScenesWithProductCard.json";
import { ElementType } from "../../src/r/definitions/elements";
import unnamedRules from "./jsons/unnamedRulesProject.json";
import thumbnailJson from "./jsons/thumbnail.json";
import br from "./jsons/br.json";
import { jsUtils } from "@gmetrixr/gdash";

const { createNewProject, migrateProjectRJson } = migrations;
describe("r ProjectFactory tests", () => {
  /** 
   * Current JSON => Scene => { PanoImage, Group => { ImageFlat } }
   */
  it ("should add media upload element at root", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      projectF.addElementOfTypeToScene({ sceneId: scene1.id, elementType: en.ElementType.media_upload }) as R.RecordNode<RT.element>;
      const sceneF = r.scene(scene1);
      const elements = sceneF.getRecords(RT.element);
      expect(elements.length).to.be.eq(3);
    }
  });

  /** 
   * Current JSON => Scene => { PanoImage, Group => { ImageFlat }, MediaUpload }
   */
  it ("should add image element at root with position 0", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      projectF.addElementOfTypeToScene({ sceneId: scene1.id, elementType: en.ElementType.image_flat, position: 0 }) as R.RecordNode<RT.element>;
      const sceneF = r.scene(scene1);
      const elements = sceneF.getRecords(RT.element);
      expect(elements.length).to.be.eq(4);
      expect(elements[0].props.element_type === en.ElementType.image_flat);
    }
  });

  /** 
   * Current JSON => Scene => { ImageFlat, PanoImage, Group => { ImageFlat }, MediaUpload }
   */
  it ("should add media upload element in group", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      projectF.addElementOfTypeToScene({ sceneId: scene1.id, elementType: en.ElementType.media_upload, groupElementId: 1648469473750 }) as R.RecordNode<RT.element>;
      const sceneF = r.scene(scene1);
      const group = sceneF.getRecord(RT.element, 1648469473750);
      const groupF = r.element(group as RecordNode<RT.element>);
      const groupElements = groupF.getRecords(RT.element);
      expect(groupElements.length).to.be.eq(2);
    }
  });

  /** 
   * Current JSON => Scene => { ImageFlat, PanoImage, Group => { ImageFlat, MediaUpload }, MediaUpload }
   */
  it ("should add video element in group at position 0", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      projectF.addElementOfTypeToScene({ sceneId: scene1.id, elementType: en.ElementType.video_flat, position: 0, groupElementId: 1648469473750 }) as R.RecordNode<RT.element>;
      const sceneF = r.scene(scene1);
      const group = sceneF.getRecord(RT.element, 1648469473750);
      const groupF = r.element(group as RecordNode<RT.element>);
      const groupElements = groupF.getRecords(RT.element);
      expect(groupElements.length).to.be.eq(3);
      expect(groupElements[0].props.element_type === en.ElementType.video_flat);
    }
  });

  /** 
   * Current JSON => Scene => { ImageFlat, PanoImage, Group => { VideoFlat, ImageFlat, MediaUpload }, MediaUpload }
   */
  it ("should add scorm element with variables at root", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if(scene1) {
      const embedScormRecord = projectF.addElementOfTypeToScene({ sceneId: scene1.id, elementType: en.ElementType.embed_scorm }) as R.RecordNode<RT.element>;
      const scormKeys = Object.keys(embedScormRecord);
      expect(scormKeys.includes("embed_scorm_score_var_id"));
      expect(scormKeys.includes("embed_scorm_suspend_data_var_id"));
      expect(scormKeys.includes("embed_scorm_progress_var_id"));

      const variables = projectF.getRecords(RT.variable);

      const variableIds = variables.map(v => v.id);
      expect(variableIds.includes(embedScormRecord.props.embed_scorm_score_var_id as number));
      expect(variableIds.includes(embedScormRecord.props.embed_scorm_suspend_data_var_id as number));
      expect(variableIds.includes(embedScormRecord.props.embed_scorm_progress_var_id as number));
    }
  });

  /** 
   * Current JSON => Scene => { ImageFlat, PanoImage, Group => { VideoFlat, ImageFlat, MediaUpload }, MediaUpload, SCORM }
   */
  it ("should delete media upload element from root", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      const sceneF = r.scene(scene1);
      const mediaUploadElement = sceneF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.media_upload);
      const deletedRecord = projectF.deleteSceneDeepRecord(scene1.id, RT.element, mediaUploadElement[0].id);
      const variables = projectF.getRecords(RT.variable);
      const variableIds = variables.map(v => v.id);
      expect(variableIds.includes((deletedRecord as RecordNode<RT.element>).props.media_upload_var_id as number)).to.be.eq(false);
    }
  });

  /** 
   * Current JSON => Scene => { ImageFlat, PanoImage, Group => { VideoFlat, ImageFlat, MediaUpload }, SCORM }
   */
  it ("should delete media upload element from group", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      const sceneF = r.scene(scene1);
      const mediaUploadElement = sceneF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.media_upload);
      const deletedRecord = projectF.deleteSceneDeepRecord(scene1.id, RT.element, mediaUploadElement[0].id);
      const variables = projectF.getRecords(RT.variable);
      const variableIds = variables.map(v => v.id);
      expect(variableIds.includes((deletedRecord as RecordNode<RT.element>).props.media_upload_var_id as number)).to.be.eq(false);
    }
  });

  /** 
   * Current JSON => Scene => { ImageFlat, PanoImage, Group => { VideoFlat, ImageFlat }, SCORM }
   */
  it ("should duplicate scorm element from root", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      const sceneF = r.scene(scene1);
      const scormElements = sceneF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.embed_scorm);
      const duplicatedScormElement = projectF.duplicateSceneDeepRecord(scene1.id, RT.element, scormElements[0].id);
      const variables = projectF.getRecords(RT.variable);
      const variableIds = variables.map(v => v.id);
      const elements = sceneF.getRecords(RT.element);
      const elementIds = elements.map(el => el.id);

      expect(elementIds.includes((duplicatedScormElement as RecordNode<RT.element>).id));
      expect(variableIds.includes((duplicatedScormElement as RecordNode<RT.element>).props.embed_scorm_score_var_id as number));
      expect(variableIds.includes((duplicatedScormElement as RecordNode<RT.element>).props.embed_scorm_suspend_data_var_id as number));
      expect(variableIds.includes((duplicatedScormElement as RecordNode<RT.element>).props.embed_scorm_progress_var_id as number));
      expect(scormElements[0].props.embed_scorm_score_var_id).to.not.be.eq((duplicatedScormElement as RecordNode<RT.element>).props.embed_scorm_score_var_id);
      expect(scormElements[0].props.embed_scorm_suspend_data_var_id).to.not.be.eq((duplicatedScormElement as RecordNode<RT.element>).props.embed_scorm_suspend_data_var_id);
      expect(scormElements[0].props.embed_scorm_progress_var_id).to.not.be.eq((duplicatedScormElement as RecordNode<RT.element>).props.embed_scorm_progress_var_id);
    }
  });

  /** 
   * Current JSON => Scene1 => { ImageFlat, PanoImage, Group => { VideoFlat, ImageFlat }, SCORM, SCORM }
   */
  it ("should delete unnecessary elements", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];

    if (scene1) {
      const sceneF = r.scene(scene1);
      const imageFlatElements = sceneF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.image_flat);
      imageFlatElements.forEach(el => {
        projectF.deleteSceneDeepRecord(scene1.id, RT.element, (el as RecordNode<RT.element>).id);
      });

      const scormElements = sceneF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.embed_scorm);
      projectF.deleteSceneDeepRecord(scene1.id, RT.element, (scormElements[0] as RecordNode<RT.element>).id);

      const elements = sceneF.getRecords(RT.element);
      const allElements = sceneF.getAllDeepChildren(RT.element);
      expect(elements.length).to.be.eq(3);
      expect(allElements.length).to.be.eq(4);
    }
  });

  /** 
   * Current JSON => Scene1 => { PanoImage, Group => { VideoFlat }, SCORM }
   */
  it ("should duplicate scene", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const scene1 = scenes?.[0];
    const initialVariables = projectF.getRecords(RT.variable);

    if (scene1) {
      const duplicatedScene = projectF.duplicateDeepRecord(RT.scene, scene1.id);
      const duplicatedSceneF = r.scene(duplicatedScene as RecordNode<RT.scene>);
      const duplicatedSceneRootElements = duplicatedSceneF.getRecords(RT.element);
      const duplicatedSceneAllElements = duplicatedSceneF.getAllDeepChildren(RT.element);
      const finalVariables = projectF.getRecords(RT.variable);

      const sceneF = r.scene(scene1);
      const sceneRootElements = sceneF.getRecords(RT.element);
      const sceneAllElements = sceneF.getAllDeepChildren(RT.element);
      const menuRecords = projectF.getRecords(RT.menu);

      expect(scene1.id).to.not.be.eq((duplicatedScene as RecordNode<RT.scene>).id);
      expect(sceneRootElements.length).to.be.eq(duplicatedSceneRootElements.length);
      expect(sceneAllElements.length).to.be.eq(duplicatedSceneAllElements.length);
      expect(initialVariables.length).to.not.be.eq(finalVariables.length);
      expect(menuRecords[1].props.menu_show).to.be.eq(true);
    }
  });

  /** 
   * Current JSON => Scene1 => { PanoImage, Group => { VideoFlat }, SCORM }
   *                 Scene2 => { PanoImage, Group => { VideoFlat }, SCORM }
   */
  it ("should paste scorm element from clipboard at root level of scene 1", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const sceneF = r.scene(scenes[0] as RecordNode<RT.scene>);
    const elementsBeforePasting = sceneF.getRecords(RT.element);
    const variablesBeforePasting = projectF.getRecords(RT.variable);

    projectF.pasteFromClipboardObject({ obj: (scormElementJson as ClipboardR), sceneId: scenes[0].id });

    const elementsAfterPasting = sceneF.getRecords(RT.element);
    const variablesAfterPasting = projectF.getRecords(RT.variable);

    expect(elementsBeforePasting.length + 1).to.be.eq(elementsAfterPasting.length);
    expect(variablesBeforePasting.length + 3).to.be.eq(variablesAfterPasting.length);
  });

  /** 
   * Current JSON => Scene1 => { PanoImage, Group => { VideoFlat }, SCORM }
   *                 Scene2 => { PanoImage, Group => { VideoFlat }, SCORM }
   */
  it ("should error out for trying to add element to project", () => {
    const projectF = r.project(oneSceneWithGroup);
    projectF.pasteFromClipboardObject({ obj: (mediaUploadJson as ClipboardR) });
    console.log("[Error test]: Expected error because sending a media upload element without any SceneId and an element cannot be added at project level.");
  });

  /** 
   * Current JSON => Scene1 => { PanoImage, Group => { VideoFlat }, SCORM, MediaUpload }
   *                 Scene2 => { PanoImage, Group => { VideoFlat }, SCORM }
   */
  it ("should paste media upload element from clipboard in group of scene 1", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const sceneF = r.scene(scenes[0] as RecordNode<RT.scene>);
    const group = sceneF.getRecord(RT.element, 1648469473750);
    const groupF = r.element(group as RecordNode<RT.element>);
    const elementsBeforePasting = groupF.getRecords(RT.element);
    const variablesBeforePasting = projectF.getRecords(RT.variable);

    projectF.pasteFromClipboardObject({ obj: (mediaUploadJson as ClipboardR), sceneId: scenes[0].id, groupElementId: 1648469473750 });

    const elementsAfterPasting = groupF.getRecords(RT.element);
    const variablesAfterPasting = projectF.getRecords(RT.variable);

    expect(elementsBeforePasting.length + 1).to.be.eq(elementsAfterPasting.length);
    expect(variablesBeforePasting.length + 1).to.be.eq(variablesAfterPasting.length);
  });

  /** 
   * Current JSON => Scene1 => { PanoImage, Group => { VideoFlat, MediaUpload }, SCORM, MediaUpload }
   *                 Scene2 => { PanoImage, Group => { VideoFlat }, SCORM }
   */
  it ("should create group and paste media upload element from clipboard in group in group of scene 1", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenes = projectF.getRecords(RT.scene);
    const sceneF = r.scene(scenes[0] as RecordNode<RT.scene>);
    const groupInGroup = projectF.addElementOfTypeToScene({ sceneId: scenes[0].id, elementType: en.ElementType.quiz, groupElementId: 1648469473750 });
    const groupInGroupF = r.element(groupInGroup as RecordNode<RT.element>);
    const elementsBeforePasting = groupInGroupF.getRecords(RT.element);
    const variablesBeforePasting = projectF.getRecords(RT.variable);

    projectF.pasteFromClipboardObject({ obj: (mediaUploadJson as ClipboardR), sceneId: scenes[0].id, groupElementId: (groupInGroup as RecordNode<RT.element>).id });

    const elementsAfterPasting = groupInGroupF.getRecords(RT.element);
    const variablesAfterPasting = projectF.getRecords(RT.variable);

    expect(elementsBeforePasting.length + 1).to.be.eq(elementsAfterPasting.length);
    expect(variablesBeforePasting.length + 1).to.be.eq(variablesAfterPasting.length);
  });

  /** 
   * Current JSON => Scene1 => { PanoImage, Group => { VideoFlat, MediaUpload, Group => { MediaUpload } }, SCORM, MediaUpload }
   *                 Scene2 => { PanoImage, Group => { VideoFlat }, SCORM }
   */
  it ("should paste scene containing scorm element from clipboard", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenesBeforePasting = projectF.getRecords(RT.scene);
    const variablesBeforePasting = projectF.getRecords(RT.variable);

    projectF.pasteFromClipboardObject({ obj: (sceneContainingScorm as ClipboardR) });

    const scenesAfterPasting = projectF.getRecords(RT.scene);
    const variablesAfterPasting = projectF.getRecords(RT.variable);

    expect(scenesBeforePasting.length + 1).to.be.eq(scenesAfterPasting.length);
    expect(variablesBeforePasting.length + 3).to.be.eq(variablesAfterPasting.length);
  });

  it ("should add a scene with group inside a group in the scene", () => {
    const projectF = r.project(oneSceneWithGroup);
    const scenesBeforePasting = projectF.getRecords(RT.scene);
    const variablesBeforePasting = projectF.getRecords(RT.variable);

    projectF.pasteFromClipboardObject({ obj: (sceneContainingGroupInGroup as ClipboardR) });

    const scenesAfterPasting = projectF.getRecords(RT.scene);
    const variablesAfterPasting = projectF.getRecords(RT.variable);

    expect(scenesBeforePasting.length + 1).to.be.eq(scenesAfterPasting.length);
    expect(variablesBeforePasting.length + 2).to.be.eq(variablesAfterPasting.length);
  });

  it ("should add element and a scene from clipboard", () => {
    const projectF = r.project(simpleSceneWithPano);
    const variablesBeforePasting = projectF.getRecords(RT.variable);
    const scenesBeforePasting = projectF.getRecords(RT.scene);
    const sceneF = r.scene(scenesBeforePasting[0] as RecordNode<RT.scene>);
    const childrenBeforePasting = sceneF.getAllDeepChildren(RT.element);

    if (Array.isArray(sceneWithElementJson)) {
      for (let i = 0; i < sceneWithElementJson.length; i++) {
        const clipboardEntry = sceneWithElementJson[i] as ClipboardR;
        projectF.pasteFromClipboardObject({ obj: clipboardEntry, groupElementId: 1648469473750, sceneId: 1648469213286 });
      }
    }

    const scenesAfterPasting = projectF.getRecords(RT.scene);
    const childrenAfterPasting = sceneF.getAllDeepChildren(RT.element);
    const variablesAfterPasting = projectF.getRecords(RT.variable);

    expect(scenesBeforePasting.length + 1).to.be.eq(scenesAfterPasting.length);
    expect(childrenBeforePasting.length + 2).to.be.eq(childrenAfterPasting.length);
    expect(variablesBeforePasting.length + 4).to.be.eq(variablesAfterPasting.length);
  });

  it ("should delete second scene", () => {
    const projectF = r.project(twoScenesWithScorm);
    const variablesBeforeDeleting = projectF.getRecords(RT.variable);
    const scenesBeforeDeleting = projectF.getRecords(RT.scene);

    projectF.deleteRecord(RT.scene, scenesBeforeDeleting[1].id);

    const variablesAfterDeleting = projectF.getRecords(RT.variable);
    const scenesAfterDeleting = projectF.getRecords(RT.scene);

    expect(scenesBeforeDeleting.length - 1).to.be.eq(scenesAfterDeleting.length);
    expect(variablesBeforeDeleting.length - 3).to.be.eq(variablesAfterDeleting.length);
  });

  it ("should paste 2 scorm elements inside a group", () => {
    const projectF = r.project(simpleSceneWithPano);
    const variablesBeforePasting = projectF.getRecords(RT.variable);
    const scenes = projectF.getRecords(RT.scene);

    projectF.pasteFromClipboardObject({ obj: (scormElementsInsideGroup as ClipboardR), sceneId: scenes[0].id });

    const variablesAfterPasting = projectF.getRecords(RT.variable);
    expect(variablesBeforePasting.length + 12).to.be.eq(variablesAfterPasting.length);
  });

  it ("should delete group with scorm element", () => {
    const projectF = r.project(simpleSceneWithPano);
    const variablesBeforeDeleting = projectF.getRecords(RT.variable);
    const scenes = projectF.getRecords(RT.scene);

    const sceneF = r.scene(scenes[0]);
    const records = sceneF.getRecords(RT.element);

    projectF.deleteSceneDeepRecord(scenes[0].id, RT.element, records[2].id);

    const variablesAfterDeleting = projectF.getRecords(RT.variable);
    expect(variablesBeforeDeleting.length - 12).to.be.eq(variablesAfterDeleting.length);
  });

  it ("should add an environment elements and test defaults", () => {
    const projectF = r.project(simpleSceneWithPano);
    const scene = projectF.addBlankRecord(RT.scene);
    scene.props.scene_type = sn.SceneType.six_dof;
    const environment = projectF.addElementOfTypeToScene({ sceneId: scene.id, elementType: ElementType.environment });
    if(environment) {
      const elementF = r.element(environment);
      expect((elementF.getValueOrDefault(rtp.element.source) as fn.Source)?.file_urls?.o).to.eq("https://s.vrgmetri.com/gb-web/z5-edge/6DOF/environments/Event/eventModel_v10.glb");
      expect((elementF.getValueOrDefault(rtp.element.placer_3d) as number[]).length).to.eq(9);
    }
  });

  it ("should flatten product card CTA button properties", () => {
    const twoProductCards = migrateProjectRJson(twoScenesWithProductCard);
    const projectF = r.project(twoProductCards);

    const scenes = projectF.getRecords(RT.scene);
    projectF.addElementOfTypeToScene({ sceneId: scenes[0].id, elementType: en.ElementType.product_card });

    const productCards = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.product_card);

    for (const card of productCards) {
      expect(card.props.show_add_to_cart_button).to.not.be.eq(undefined);
      expect(card.props.add_to_cart_button_link).to.not.be.eq(undefined);
      expect(card.props.add_to_cart_button_text).to.not.be.eq(undefined);
    }
  });

  it ("should update billboarding from boolean to string", () => {
    const unnamedRulesProject = migrateProjectRJson(unnamedRules);
    const projectF = r.project(unnamedRulesProject);

    const billboardingElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.billboarding !== undefined);

    for (const el of billboardingElements) {
      expect(typeof el.props.billboarding).to.not.be.eq("boolean");
    }
  });

  it ("should not calculate project thumbnail if project_thumbnail prop has value", () => {
    const projectF = r.project(thumbnailJson);
    const thumbnail = projectF.getProjectThumbnail();
    const projectThumbnailSource = projectF.get(rtp.project.project_thumbnail_source) as fn.Source;
    expect(thumbnail).to.be.eq(projectThumbnailSource.file_urls?.o)
  });

  it("should add a new record of type avatar to the project", () => {
    const project = createNewProject();
    const avatar = r.project(project).addBlankRecord(RT.avatar);
    if(avatar) {
      const avatarF = r.record(avatar);
      avatarF.set(rtp.avatar.source, {id: -1, file_urls: {o: "https://test.com/test.glb"}});
      expect((avatarF.get(rtp.avatar.source) as fn.Source).id).to.eq(-1);
    }
  });
});

describe("Test complex property updates", () => {
  it("should update scene bounds", () => {
    const projectF = r.project(br);
    const parentAddr = projectF.getSelfRecordAddress();
    const sceneAddr = `${parentAddr}|scene:1648702666399`;
    const scene = projectF.getRecordAtAddress(sceneAddr) as RecordNode<RT.scene>;
    const sceneF = r.scene(scene);
    const propertyAddr = sceneF.getPropertyAddress(sceneAddr, rtp.scene.scene_bounds, 3);
    projectF.updatePropertyAtAddress(propertyAddr, 100);
    expect(scene.props.scene_bounds).to.eql([ -15, 4.5, 0, 100, -4.5, 15 ]);
  });

  it("should update avatar system to basic + custom if avatars are selected", () => {
    const clone = jsUtils.deepClone(br);
    const migratedProject = migrateProjectRJson(clone);
    const projectF = r.project(migratedProject);
    expect(projectF.getValueOrDefault(rtp.project.avatar_system) === pn.AvatarSystem.basic_custom);
  });
});