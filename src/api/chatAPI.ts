const subscribers = {
  'messages-received': [] as MessagesReceivedSubscriberType[],
  'status-changed': [] as StatusChangedSubscriberType[],
};
let ws: WebSocket | null = null;

const closeHandler = () => {
  notifySubscribersAboutStatus('pending');
  setTimeout(() => {
    createChannel();
  }, 3000);
};
const messageHandler = (e: MessageEvent) => {
  const newMessages = JSON.parse(e.data);
  subscribers['messages-received'].forEach((sub) => sub(newMessages));
};
const openHandler = () => {
  notifySubscribersAboutStatus('ready');
};
const errorHandler = () => {
  notifySubscribersAboutStatus('error');
};
const cleanUp = () => {
  ws?.removeEventListener('close', closeHandler);
  ws?.removeEventListener('message', messageHandler);
  ws?.removeEventListener('open', openHandler);
  ws?.removeEventListener('error', errorHandler);
};

const notifySubscribersAboutStatus = (status: StatusType) => {
  subscribers['status-changed'].forEach((subscriberCallback) => {
    subscriberCallback(status);
  });
};

const createChannel = () => {
  cleanUp();
  ws?.close();
  ws = new WebSocket(
    'wss://social-network.samuraijs.com/handlers/ChatHandler.ashx'
  );

  notifySubscribersAboutStatus('pending');
  ws.addEventListener('close', closeHandler);
  ws.addEventListener('message', messageHandler);
  ws.addEventListener('open', openHandler);
  ws.addEventListener('error', errorHandler);
};

export const chatAPI = {
  start() {
    createChannel();
  },
  stop() {
    subscribers['messages-received'] = [];
    subscribers['status-changed'] = [];
    cleanUp();
    ws?.close();
  },
  subscribe(
    eventName: EventNamesType,
    callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType
  ) {
    //@ts-ignore
    subscribers[eventName].push(callback);

    // can use this instead of unsubscribe method
    // return () => {
    //   //@ts-ignore
    //   subscribers[eventName] = subscribers[eventName].filter((sub: MessagesReceivedSubscriberType | StatusChangedSubscriberType) => sub !== callback)
    // }
  },
  unsubscribe(
    eventName: EventNamesType,
    callback: MessagesReceivedSubscriberType | StatusChangedSubscriberType
  ) {
    //@ts-ignore
    subscribers[eventName] = subscribers[eventName].filter(
      (sub: MessagesReceivedSubscriberType | StatusChangedSubscriberType) =>
        sub !== callback
    );
  },
  sendMessage(message: string) {
    ws?.send(message);
  },
};

type EventNamesType = keyof typeof subscribers;
export type MessagesReceivedSubscriberType = (
  messages: MessageAPIType[]
) => void;
export type StatusChangedSubscriberType = (status: StatusType) => void;
export type StatusType = 'pending' | 'ready' | 'error';
export type MessageAPIType = {
  message: string;
  photo: null | string;
  userId: null | number;
  userName: null | string;
};
