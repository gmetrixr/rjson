
export enum ChatProperty {
  chat_scene_id = "chat_scene_id",
  chat_show = "chat_show",
}

export const chatPropertyDefaults: Record<ChatProperty, unknown> = {
  [ChatProperty.chat_scene_id]: 0,
  [ChatProperty.chat_show]: true,
}
