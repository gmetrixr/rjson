import { r, RecordNode, rtp, RT, en, fn } from "../../../r";
import { IOrder } from "../../IOrder";
import { pathUtils } from "@gmetrixr/gdash";

/**
 * Migrating media type for popup items
 * Old Types: media, youtube, embed_code, sprite
 * New Types: image, video, audio, 3d_model, pdf, youtube, markdown, embed_code, sprite
 * We check whether a file uploaded is an image, video, audio or 3d_model
 * It CAN'T be a PDF as we currently don't support them
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const allPopupElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === en.ElementType.popup);

    for (const element of allPopupElements) {
      const elementF = r.element(element);
      const allItems = elementF.getRecords(RT.item);

      for(const item of allItems) {
        const itemF = r.record(item);
        const source = itemF.getValueOrDefault(rtp.item.item_source) as fn.Source;
        let sourceType = source.type as pathUtils.FileType;

        //* Only in case of JSON corruption could this scenario occur
        if(!sourceType) {
          // get the file type from the file_urls
          const url = source.file_urls?.glb || source.file_urls?.gltf || source.file_urls?.o || "";
          sourceType = pathUtils.getFileType(url);
        }

        const { FileType } = pathUtils;

        switch(sourceType) {
          case FileType.IMAGE: {
            item.props.item_source_type = "image";
            break;
          }
          case FileType.VIDEO: {
            item.props.item_source_type = "video";
            break;
          }
          case FileType.AUDIO: {
            item.props.item_source_type = "audio";
            break;
          }
          case FileType.THREED:
          case FileType.COMPRESSED: {
            item.props.item_source_type = "3d_model";
            break;
          }
        }
      }
    }

    projectF.set(rtp.project.version, 149);
  }
}

const migration = new Migration();
export default migration;
