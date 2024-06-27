import { slackSendMsg } from '@/lib/slack';
import { fetcher } from '@/lib/utils';
import { UserAPI } from '@/types/api';

export async function getUserAPI(
  id: string | null,
  params?: { username?: string }
) {
  let url: string | null = null;

  if (id) {
    url = `/api/v1/user?id=${id}`;
  } else if (params?.username) {
    url = `/api/v1/user?username=${params?.username}`;
  }

  if (!url) {
    await slackSendMsg(`No url found! ${url}`);
    return { user: null };
  }

  try {
    const res = await fetcher<UserAPI>(url);
    if (res.error) {
      await slackSendMsg(`Failed to get user info! ${res.error}`);
      return { user: null };
    }
    return { user: res.data };
  } catch (error) {
    console.log(error);
    return { user: null };
  }
}
