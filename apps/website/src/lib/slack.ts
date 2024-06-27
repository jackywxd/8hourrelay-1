import { IncomingWebhook } from "@slack/webhook";
import { WebClient } from "@slack/web-api";

const url = process.env.SLACK_WEBHOOK;

const ENV = process.env.ENV;

const web = new WebClient(process.env.SLACK_TOKEN);

export const updateMessage = async (
  channelId: string,
  messageTs: string,
  collectionId: string
) => {
  await web.chat.update({
    channel: channelId,
    ts: messageTs,
    text: `Collection ID: ${collectionId} has been approved!`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Collection ID: ${collectionId} has been approved!`,
        },
      },
    ],
  });
};

// Send the notification
export const slackSendMsg = async (text: string): Promise<void> => {
  const webhook = new IncomingWebhook(url!);
  await webhook.send({
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: `[${ENV}] ${text}` } },
    ],
  });
};

// Send the notification
export const slackSendText = async (text: string) => {
  const webhook = new IncomingWebhook(url!);
  return webhook.send(`[${ENV}] ${text}`);
};

// Send the notification
export const slackActionSend = async (
  text: string,
  id: string, // team ID
  uid: string // user uid
) => {
  const webhook = new IncomingWebhook(url!);
  return webhook.send({
    text: `[${ENV}] ${text}`,
    attachments: [
      {
        text: "Approve or Deny for the new team?",
        fallback: "You are unable to choose an option",
        callback_id: "approval",
        color: "#3AA3E3",
        actions: [
          {
            name: "approve",
            text: "Approve",
            type: "button",
            value: `approve_${id}_${uid}`,
          },
          {
            name: "deny",
            text: "Deny",
            type: "button",
            value: `deny_${id}_${uid}`,
          },
        ],
      },
    ],
  });
};
