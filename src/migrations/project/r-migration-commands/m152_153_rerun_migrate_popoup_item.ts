import { RecordNode, r, rtp, RT, en, fn } from "../../../r";
import { IOrder } from "../../IOrder";
import { pathUtils } from "@gmetrixr/gdash";

/**
 * Rerun pop items migration. This is being done as the migration rjson scheme has changed.
 * new scheme
 * 1. Apply initial migrations
 * 2. inject file sources
 * 3. run normal migrations - Few migrations require file sources to be injected
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

    projectF.set(rtp.project.version, 153);
  }
}

const migration = new Migration();
export default migration;