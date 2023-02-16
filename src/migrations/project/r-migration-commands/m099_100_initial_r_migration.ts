import { R, RecordNode, createRecord, RT, rtp, r } from "../../../r";
import { IOrder } from "../../IOrder";

/**
 * @description Converts t type project json to r type project json
 */
class Migration implements IOrder {
  execute(projectJson: unknown): RecordNode<RT.project> {
    return migrateProject(projectJson);
  }
}

const migration = new Migration();
export default migration;

const migrateProject = (tProject: any): RecordNode<RT.project> => {
  const projectJson = createRecord(RT.project, R.SINGLE_RECORD_ID);
  const projectF = r.record(projectJson);

  if(tProject.scenes === undefined) {
    const sceneR = createRecord(RT.scene,100111);
    projectF.addRecord(sceneR);
  }

  if(tProject.pp !== undefined){
    if(tProject.pp?.scenes_order !== undefined) {
      const scenes_order = tProject.pp?.scenes_order;
      for(const sceneId of scenes_order) {
        const tScene = tProject?.scenes[sceneId];
        if(tScene !== undefined) {
          const scene: RecordNode<RT.scene> = migrateScene(tScene);
          projectF.addRecord(scene);
        }
      }
      delete tProject?.pp?.scenes_order;
    }
  
    if(tProject.pp?.vars_order !== undefined) {
      const vars_order = tProject?.pp?.vars_order;
      for(const varId of vars_order) {
        const tVar = tProject?.vars[varId];
        if(tVar !== undefined) {
          const varJson: RecordNode<RT.variable> = migrateVar(tVar);
          projectF.addRecord(varJson);
        }
      }
      delete tProject.pp.vars_order;
    }
  
    if(tProject.pp?.menu_structure !== undefined) {
      const menu_structure = tProject?.pp?.menu_structure
      for(const tMenu of menu_structure) {
        const menu: RecordNode<RT.menu> = migrateMenu(tMenu);
        projectF.addRecord(menu);
      }
      delete tProject?.pp?.menu_structure;
    }
    if(tProject.shopping !== undefined) {
      const shopping: RecordNode<RT.shopping> = migrateShopping(tProject?.shopping);
      projectF.addRecord(shopping);
    }
  
    if(tProject.pp.lead_gen_fields?.heading !== undefined) {
      projectF.set(rtp.project.lead_gen_heading, tProject.pp.lead_gen_fields?.heading);
    }
    if(tProject.pp.lead_gen_fields?.termsOfServiceLink !== undefined) {
      projectF.set(rtp.project.lead_gen_tos, tProject.pp.lead_gen_fields?.termsOfServiceLink);
    }
    if(tProject.pp.lead_gen_fields?.order !== undefined) {
      const order = tProject?.pp?.lead_gen_fields?.order
      for(const leadGenFieldId of order) {
        const tLeadGenField = tProject.pp.lead_gen_fields.map[leadGenFieldId];
        const leadGenField: RecordNode<RT.lead_gen_field> = migrateLeadGenField(tLeadGenField);
        projectF.addRecord(leadGenField);
      }
    }
    delete tProject.pp?.lead_gen_fields;
  
    projectJson.props = {...projectJson?.props, ...tProject?.pp};
  }

  projectF.set(rtp.project.version, 100);
  return projectJson;
}

const migrateLeadGenField = (tLeadGenField: any): RecordNode<RT.lead_gen_field> => {
  const leadGenField = createRecord(RT.lead_gen_field, tLeadGenField.id, tLeadGenField.name);
  delete tLeadGenField.id;
  delete tLeadGenField.name;
  leadGenField.props = tLeadGenField;
  return leadGenField;
}

// export interface Menu {
//   name: string,
//   show: boolean,
//   scene_no: number
// }
const migrateMenu = (tMenu: any): RecordNode<RT.menu> => {
  //ids kept deterministic (but unique) for test cases
  const menu = createRecord(RT.menu, tMenu.scene_no + 100000);
  menu.props.menu_scene_id = tMenu.scene_no;
  if(tMenu.name !== undefined) menu.props.menu_display_name = tMenu.name;
  if(tMenu.show !== undefined) menu.props.menu_show = tMenu.show;
  return menu;
}

const migrateVar = (tVar: any): RecordNode<RT.variable> => {
  const id = tVar.var_id;
  const name = tVar.var_name;
  delete tVar.var_id;
  delete tVar.var_name;
  const varJson = createRecord(RT.variable, id, name);
  varJson.props = tVar;
  return varJson;
}

const migrateShopping = (tShopping: any): RecordNode<RT.shopping> => {
  const shoppingJson = createRecord(RT.shopping, R.SINGLE_RECORD_ID);
  const shoppingF = r.record(shoppingJson);
  for(const productId of tShopping.products.order) {
    const tProduct = tShopping.products.map[productId];
    const product = createRecord(RT.product, productId);
    delete tProduct.id;
    tProduct.scene_id = tProduct.scene_no;
    delete tProduct.scene_no;
    product.props = tProduct;
    shoppingF.addRecord(product);
  }
  delete tShopping.id;
  shoppingJson.props = tShopping.shp;
  return shoppingJson;
}


const migrateScene = (tScene: any): RecordNode<RT.scene> => {
  const id = tScene.sp.scene_no;
  const name = tScene.sp.scene_name;
  delete tScene.sp.scene_no;
  delete tScene.sp.scene_name;
  const sceneJson = createRecord(RT.scene, id, name);
  const sceneF = r.record(sceneJson);

  for(const elementId of tScene.sp.elements_order) {
    const tElement = tScene.elements[elementId];
    const element: RecordNode<RT.element> = migrateElement(tElement);
    sceneF.addRecord(element);
  }
  delete tScene.sp.elements_order;

  for(const ruleId of tScene.sp.connections_order) {
    const tRule = tScene.connections[ruleId];
    const rule: RecordNode<RT.rule> = migrateRule(tRule);
    sceneF.addRecord(rule);
  }
  delete tScene.sp.connections_order;

  sceneJson.props = tScene.sp;
  return sceneJson;
}

export const migrateElement = (tElement: any): RecordNode<RT.element> => {
  const id = tElement.ep.element_id;
  const name = tElement.ep.element_name;
  delete tElement.ep.element_id;
  delete tElement.ep.element_name;
  const element = createRecord(RT.element, id, name);
  const elementF = r.record(element);
  if(tElement.ep.elements_order) {
    for(const subElementId of tElement.ep.elements_order) {
      const subtElement = tElement.ep.elements[subElementId];
      if(subtElement !== undefined) {
        const subElement: RecordNode<RT.element> = migrateElement(subtElement);
        elementF.addRecord(subElement);
      }
    }
    delete tElement.ep.elements_order;
    delete tElement.ep.elements;
  }
  if(tElement.ep.items_order) {
    for(const itemId of tElement.ep.items_order) {
      const tItem = tElement.ep.items[itemId];
      if(tItem !== undefined) {
        const item: RecordNode<RT.item> = migrateItem(tItem);
        elementF.addRecord(item);
      }
    }
    delete tElement.ep.items_order;
    delete tElement.ep.items;
  }
  //const elementF = new NodeFactory(element);
  element.props = tElement.ep;  
  return element;
}

const migrateItem = (tItem: any): RecordNode<RT.item> => {
  const id = tItem.id;
  const name = tItem.name;
  const item = createRecord(RT.item, id, name);
  const itemF = r.record(item);
  delete tItem.id;
  delete tItem.name;
  if(tItem.options_order) {
    for(const optionId of tItem.options_order) {
      const tOption = tItem.options[optionId];
      if(tOption !== undefined) {
        const option = createRecord(RT.option, optionId);
        option.props.is_checked = tOption.is_checked;
        option.props.option_text = tOption.text;
        itemF.addRecord(option);
      }
    }
    delete tItem.options_order;
    delete tItem.options;
  }
  item.props = tItem;
  return item;
}

const migrateRule = (tRule: any): RecordNode<RT.rule> => {
  const id = tRule.cp.connection_id;
  const name = tRule.cp.connection_name;
  delete tRule.cp.connection_id;
  delete tRule.cp.connection_name;
  const rule = createRecord(RT.rule, id, name);
  const ruleF = r.record(rule);

  for(const id of tRule.cp.we_order) {
    const tWhenEvent = tRule.when_events[id];
    if(tWhenEvent === undefined) {
      console.log(`Data was corrupt. Couldn't find when event with id ${id}. Skipping it.`);
      continue;
    }
    const whenEvent: RecordNode<RT.when_event> = migrateWhenEvent(tWhenEvent);
    ruleF.addRecord(whenEvent);
  }
  delete tRule.cp.we_order;

  for(const id of tRule.cp.ta_order) {
    const tThenAction = tRule.then_actions[id];
    if(tThenAction === undefined) {
      console.log(`Data was corrupt. Couldn't find then action with id ${id}. Skipping it.`);
      continue;
    }
    const thenAction: RecordNode<RT.then_action> = migrateThenAction(tThenAction);
    ruleF.addRecord(thenAction);
  }
  delete tRule.cp.ta_order;

  rule.props = tRule.cp;
  return rule;
}

const migrateWhenEvent = (tWhenEvent: any): RecordNode<RT.when_event> => {
  const id = tWhenEvent.event_id;
  delete tWhenEvent.event_id;
  const whenEvent = createRecord(RT.when_event, id);
  whenEvent.props = tWhenEvent;  
  return whenEvent;
}

const migrateThenAction = (tThenAction: any): RecordNode<RT.then_action> => {
  const id = tThenAction.action_id;
  delete tThenAction.action_id;
  const thenAction = createRecord(RT.then_action, id);
  thenAction.props = tThenAction;  
  return thenAction;
}
