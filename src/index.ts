import { Devvit } from '@devvit/public-api';
import createPost from './createPost.tsx'; // Explicit file extension

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: 'Webview Example',
  height: 'tall',
  render: createPost,
});

export default Devvit;