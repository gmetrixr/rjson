import { pathUtils } from "@gmetrixr/gdash";

export enum lightType {
  ambient = "ambient",
  point = "point",
  directional = "directional"
}

export enum variantType {
  design_one = "design_one",
  design_two = "design_two"
}

export const SHOPPING_ITEM_ELEMENT_ID = -102

/**
 * Minimum fields required in FileWithUrl to make it usable for the right bar and the viewer
 */
export interface Source {
  id: number,
  name?: string,
  file_paths?: Record<string, string>,
  file_urls?: Record<string, string>,
  size?: number,
  type?: pathUtils.FileType,
  metadata?: unknown,
}

export type ShareAttributes = {
  url: string,
  text: string,
  platforms: string[], // ['facebook', 'twitter', 'linkedin']
};
