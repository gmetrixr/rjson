import { r, RecordNode, rtp, RT, fn } from "../../../r";
import { IOrder } from "../../IOrder";
import { pathUtils } from "@gmetrixr/gdash";

/**
 * Migrating media type for popup items
 * Old Types: media, youtube, embed_code, sprite
 * New Types: image, video, audio, 3d_model, pdf, youtube, markdown, embed_code, sprite
 */
class Migration implements IOrder {
  execute(projectJson: unknown) {
    const pJson = projectJson as RecordNode<RT.project>;
    const projectF = r.record(pJson);

    const allPopupElements = projectF.getAllDeepChildrenWithFilter(RT.element, el => el.props.element_type === "popup");

    for (const element of allPopupElements) {
      const elementF = r.element(element);
      const allItems = elementF.getRecords(RT.item);

      for(const item of allItems) {
        const source = item.props.item_source as fn.Source;
        let sourceUri = "";

        //* It's just the "media" type that will be split into image, video, audio, pdf or 3d_model
        if(item.props.item_source_type === "media") {
          if(typeof source === "object" && source.file_urls) {
            sourceUri = source.file_urls ? (source.file_urls.gltf ?? source.file_urls.o): "";
          }
        }

        const { getFileType, FileType } = pathUtils;
        const fileType = getFileType(sourceUri);

        switch(fileType) {
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
          case FileType.PDF: {
            item.props.item_source_type = "pdf";
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
