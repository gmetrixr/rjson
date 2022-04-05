import { en, r, RecordNode, RT } from "../../src/r";
import { expect } from "chai";
import { jsUtils } from "@gmetrixr/gdash";

const { deepClone } = jsUtils;

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
                },
              },
            },
          },
        },
      },
    },
  },
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

// describe("Test SceneFactory methods", () => {
//   it("should paste a group inside a scene with deduplicated child ids", () => {
//     const simpleSceneJsonClone = deepClone(simpleSceneJson);
//     const sceneF = r.scene(simpleSceneJsonClone);
//     const group2 = sceneF.getRecord(RT.element, 2);
//     const cc = deepClone(sceneF.copyToClipboardObject([2]));
//     // changing parentType here to be able to paste it inside a scene
//     cc.parentType = RT.scene;
//     sceneF.pasteFromClipboardObject({obj: cc});

//     // check that the group with id 33 never changes
//     expect(group2?.id).to.eq(2);

//     // check that there is a new group element pasted with new ids for each of the nested group elements
//     const newAddedGroup = sceneF.getAllDeepChildrenWithFilter(RT.element, (e) => {
//       return e.props.element_type === en.ElementType.group && e.id !== 2;
//     });

//     expect(newAddedGroup[0]).to.not.eq(undefined);
//     expect(newAddedGroup[0]?.id).to.not.eq(2);
//     if (newAddedGroup[0]) {
//       const invalidIds = [31, 32, 33];
//       const newAddressGroupF = r.element(newAddedGroup[0]);
//       const children = newAddressGroupF.getRecords(RT.element);
//       // test that new child ids are different from the clipboard content
//       for (const c of children) {
//         expect(invalidIds.includes(c.id)).to.eq(false);
//       }
//     }
//   });
// });

