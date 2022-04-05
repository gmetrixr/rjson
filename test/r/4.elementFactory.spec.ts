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

// describe("Test ElementFactory methods", () => {
//   it("should paste a group inside another group with deduplicated child ids", () => {
//     const simpleGroupJsonClone = deepClone(simpleGroupJson);
//     const elementF = r.element(simpleGroupJsonClone);
//     const group33 = elementF.getRecord(RT.element, 33);
//     if (group33) {
//       const cc = deepClone(elementF.copyToClipboardObject([33]));
//       elementF.pasteFromClipboardObject({obj: cc});
//     }

//     // check that the group with id 33 never changes
//     expect(group33?.id).to.eq(33);

//     // check that there is a new group element pasted with new ids for each of the nested group elements
//     const newAddedGroup = elementF.getAllDeepChildrenWithFilter(RT.element, (e) => {
//       return e.props.element_type === en.ElementType.group && e.id !== 33;
//     });

//     expect(newAddedGroup[0]).to.not.eq(undefined);
//     expect(newAddedGroup[0]?.id).to.not.eq(33);
//     if (newAddedGroup[0]) {
//       const invalidIds = [31, 32];
//       const newAddressGroupF = r.element(newAddedGroup[0]);
//       const children = newAddressGroupF.getRecords(RT.element);
//       // test that new child ids are different from the clipboard content
//       for (const c of children) {
//         expect(invalidIds.includes(c.id)).to.eq(false);
//       }
//     }
//   });
// });

