import { RecordNode, r, rtp, RT, en } from "../../r";
import { IOrder } from "../IOrder";

/** 
 * Flattens Product card Add to cart CTA button.
 * show_add_to_cart]: {
    show_cart_btn: false,
    cart_btn_text: "Add to cart",
    cart_btn_link: "#",
  } gets converted to
  show_add_to_cart_button, add_to_cart_button_text, add_to_cart_button_link
 */

class Migration implements IOrder {
  execute (projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const productCards = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.product_card);

    for (const card of productCards) {
      const elementF = r.element(card);
      const showAddToCartProperties = elementF.getValueOrDefault("show_add_to_cart" as any) as any;
      
      if (showAddToCartProperties) {
        showAddToCartProperties.show_cart_btn && elementF.set(rtp.element.show_add_to_cart_button, showAddToCartProperties.show_cart_btn);
        showAddToCartProperties.cart_btn_text && elementF.set(rtp.element.add_to_cart_button_text, showAddToCartProperties.cart_btn_text);
        showAddToCartProperties.cart_btn_link && elementF.set(rtp.element.add_to_cart_button_link, showAddToCartProperties.cart_btn_link);
        elementF.deleteProperty("show_add_to_cart");
      }
    }

    projectF.set(rtp.project.version, 130);
  }
}


const migration = new Migration();
export default migration;