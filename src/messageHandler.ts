type WebViewMessage =
  | { type: 'initialData'; data: { username: string; currentCounter: number } }
  | { type: 'setCounter'; data: { newCounter: number } }
  | { type: 'updateCounter'; data: { currentCounter: number } };

const handleMessage = async (
  msg: WebViewMessage,
  context: any,
  setCounter: (value: number) => void
) => {
  switch (msg.type) {
    case 'setCounter':
      await context.redis.set(
        `counter_${context.postId}`,
        msg.data.newCounter.toString()
      );
      context.ui.webView.postMessage('myWebView', {
        type: 'updateCounter',
        data: { currentCounter: msg.data.newCounter },
      });
      setCounter(msg.data.newCounter);
      break;
    default:
      throw new Error(`Unknown message type: ${msg}`);
  }
};

export default handleMessage;