export enum WebhookProperty {
  webhook_enabled = "webhook_enabled",
  webhook_type = "webhook_type", //rules | session | variables | legacy (for the older version of webhooks)
  webhook_api_endpoint = "webhook_api_endpoint",
}

export const webhookPropertyDefaults:  Record<WebhookProperty, unknown> = {
  [WebhookProperty.webhook_enabled]: false,
  [WebhookProperty.webhook_type]: "",
  [WebhookProperty.webhook_api_endpoint]: "",
};
