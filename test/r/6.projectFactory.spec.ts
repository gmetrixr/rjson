import { en, r, R, RecordNode, RT } from "../../src/r";
import { migrateProjectRJson } from "../../src";
import { expect } from "chai";
import { ProjectUtils } from "../../src/r/recordFactories/ProjectFactory";
import oneSceneWithGroup from "./jsons/oneSceneWithGroup.json";
import simpleSceneWithPano from "./jsons/simpleSceneWithPano.json";
import { ClipboardR } from "../../src/r/R";
import scormElementJson from "./jsons/r3fJsons/clipboardEntries/scormElement.json";
import mediaUploadJson from "./jsons/r3fJsons/clipboardEntries/mediaUploadElement.json";
import sceneContainingGroupInGroup from "./jsons/r3fJsons/clipboardEntries/sceneContainingGroupInGroup.json";
import sceneWithElementJson from "./jsons/r3fJsons/clipboardEntries/sceneWithElement.json";
import sceneContainingScorm from "./jsons/r3fJsons/clipboardEntries/sceneContainingScorm.json";
import scormElementsInsideGroup from "./jsons/r3fJsons/clipboardEntries/scormElementsInsideGroup.json";

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

      expect(scene1.id).to.not.be.eq((duplicatedScene as RecordNode<RT.scene>).id);
      expect(sceneRootElements.length).to.be.eq(duplicatedSceneRootElements.length);
      expect(sceneAllElements.length).to.be.eq(duplicatedSceneAllElements.length);
      expect(initialVariables.length).to.not.be.eq(finalVariables.length);
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
    console.log('[Error test]: Expected error because sending a media upload element without any SceneId and an element cannot be added at project level.');
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
    const projectF = r.project(simpleSceneWithPano);
    const variablesBeforeDeleting = projectF.getRecords(RT.variable);
    const scenesBeforeDeleting = projectF.getRecords(RT.scene);

    projectF.deleteRecord(RT.scene, scenesBeforeDeleting[1].id);

    const variablesAfterDeleting = projectF.getRecords(RT.variable);
    const scenesAfterDeleting = projectF.getRecords(RT.scene);

    expect(scenesBeforeDeleting.length - 1).to.be.eq(scenesAfterDeleting.length);
    expect(variablesBeforeDeleting.length - 4).to.be.eq(variablesAfterDeleting.length);
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
});