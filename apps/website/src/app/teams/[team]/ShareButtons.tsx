'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share';

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <div className="flex gap-3 mb-3">
      <TwitterShareButton url={url} title={title}>
        <Icons.twitter className="hover:opacity-50">
          Share on Twitter
        </Icons.twitter>
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={title}>
        <Icons.facebook className="hover:opacity-50">
          Share on Facebook
        </Icons.facebook>
      </FacebookShareButton>
      <LinkedinShareButton url={url} title={title}>
        <Icons.linkedin className="hover:opacity-50">
          Share on LinkedIn
        </Icons.linkedin>
      </LinkedinShareButton>
      <EmailShareButton url={url} title={title} subject={title}>
        <Icons.mail className="hover:opacity-50">Share by Email</Icons.mail>
      </EmailShareButton>
    </div>
  );
}
