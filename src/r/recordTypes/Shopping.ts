export enum ShoppingProperty {
  store_name = "store_name",
  plugin = "plugin", //renamed from "plugin_name"
  endpoint = "endpoint",
  currency_prefix = "currency_prefix",
  show_cart = "show_cart",
  store_access_token = "store_access_token"
}

export const shoppingPropertyDefaults: Record<ShoppingProperty, unknown> = {
  [ShoppingProperty.store_name]: "",
  [ShoppingProperty.plugin]: "",
  [ShoppingProperty.endpoint]: "",
  [ShoppingProperty.currency_prefix]: "",
  [ShoppingProperty.show_cart]: true,
  [ShoppingProperty.store_access_token]: ""
}