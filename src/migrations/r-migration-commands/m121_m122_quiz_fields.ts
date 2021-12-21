import { RecordNode, r, rtp, RT, en } from "../../r";
import { IOrder } from "../IOrder";

/**
 * Flattens the Quiz property quiz_instructions
 * Older Structure:
 * /**
 * export interface QuizInstruction {
 *   heading: { name: string, placeholder: string, value: string },   ----->  heading
 *   correct_score: { name: string, placeholder: string, value: number  },   ------> quiz_correct_score
 *   wrong_score: { name: string, placeholder: string, value: number  },     ------> quiz_wrong_score
 *   pass_mark: { name: string, placeholder: string, value: number  }        ------> quiz_passing_score
 * }
 * 
 * [ElementProperty.quiz_starting_instructions]: {},
 * [ElementProperty.quiz_passing_score]: {},
 * [ElementProperty.quiz_correct_score]: {},
 * [ElementProperty.quiz_wrong_score]: {},
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    projectF.getRecords(RT.scene).forEach(scene => {
      const sceneF = r.record(scene);
      const quizElements = sceneF.getAllDeepChildrenWithFilter(RT.element, (e) => e.props.element_type === en.ElementType.quiz);
      for(const quizElement of quizElements) {
        const quiz_instructions = (quizElement.props as any).quiz_instructions as any;
        quizElement.props.quiz_starting_instructions = quiz_instructions?.heading?.value;
        quizElement.props.quiz_passing_score = quiz_instructions?.pass_mark?.value;
        quizElement.props.quiz_correct_score = quiz_instructions?.correct_score?.value;
        quizElement.props.quiz_wrong_score = quiz_instructions?.wrong_score?.value;

        delete (quizElement.props as any).quiz_instructions;
        delete (quizElement.props as any).quiz_elements;
      }
    });
    projectF.set(rtp.project.version, 122);
  }
}

const migration = new Migration();
export default migration;
