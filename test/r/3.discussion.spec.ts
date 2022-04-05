import { createRecord, r, RT } from "../../src/r";
import { expect } from "chai";

const discussionJson = {
  id: 1,
  props: {},
  name: "",
  type: "discussion",
  records: {
    topic: {
      order: [2],
      map: {
        2: {
          id: 2,
          props: {
            topic_position: [0, 0, 0],
            topic_resolved: false,
          },
          name: "",
          type: "topic",
          records: {
            comment: {
              order: [3],
              map: {
                3: {
                  id: 3,
                  props: {
                    comment_ts: 12345,
                    comment_fullname: "GMetri Test",
                    comment_message: "This is a test comment"
                  },
                  name: "",
                  type: "comment",
                }
              }
            }
          }
        }
      }
    }
  }
};

// describe("Test Discussion/Topic/Comment operations", () => {
//   it("Should create a new discussion ", () => {
//     const discussion = createRecord(RT.discussion);
//     expect(discussion).to.not.eq(undefined);
//     expect(discussion).to.not.eq(null);
//   });

//   it("Should add a new topic to a discussion", () => {
//     const discussion = createRecord(RT.discussion);
//     const discussionR = r.record(discussion);
//     const topic = discussionR.addBlankRecord(RT.topic);
//     expect(topic).to.not.eq(undefined);
//     expect(discussionR.getRecord(RT.topic, topic.id)).to.not.eq(undefined);
//   });

//   it("Should add a new comment to the topic", () => {
//     const discussion = createRecord(RT.discussion);
//     const discussionR = r.record(discussion);
//     const topic = discussionR.addBlankRecord(RT.topic);
//     const topicR = r.record(topic);
//     const comment = createRecord(RT.comment);
//     comment.props.comment_fullname = "GMetri Test";
//     comment.props.comment_ts = Date.now();
//     comment.props.comment_message = "This is a test comment";
//     topicR.addRecord(comment);

//     const commentAfterAdding = topicR.getRecord(RT.comment, comment.id);
//     expect(topicR.getRecord(RT.comment, comment.id)).to.not.eq(undefined);
//     expect(commentAfterAdding?.props.comment_fullname).to.eq("GMetri Test");
//   });

//   it("Should get all comments for a discussion", () => {
//     const discussionR = r.record(discussionJson);
//     const allCommentsInDiscussion = discussionR.getAllDeepChildren(RT.comment);
//     const comment = discussionR.getAllDeepChildrenWithFilter(RT.comment, c => c.id === 3);
//     expect(allCommentsInDiscussion.length).to.eq(1);
//     expect(comment[0]?.props.comment_fullname).to.eq("GMetri Test");
//   });
// });
