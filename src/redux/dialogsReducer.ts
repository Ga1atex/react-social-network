import { InferActionTypes } from "./redux-store";

const SEND_MESSAGE = 'social-network/dialogsPage/SEND_MESSAGE';

type DialogType = {
  id: number,
  name: string
}

type MessageType = {
  id: number,
  text: string
}

const initialState = {
  dialogsData: [
    { id: 1, name: 'Igor' },
    { id: 2, name: 'Andrey' },
    { id: 3, name: 'Ruslan' },
    { id: 4, name: 'Valeriy' },
  ] as Array<DialogType>,
  messagesData: [
    { id: 1, text: 'How is your day' },
    { id: 2, text: 'Hey' },
    { id: 3, text: 'Hi' },
    { id: 4, text: 'How is your day123' },
  ] as Array<MessageType>,
}

export type InitialStateType = typeof initialState

type ActionsTypes = InferActionTypes<typeof actionCreators>

const dialogsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {

  switch (action.type) {
    case SEND_MESSAGE: {
      const newState = {
        ...state,
        messagesData: [...state.messagesData],
      };

      const newMessage = {
        id: newState.messagesData.length + 1,
        text: action.text,
      };

      newState.messagesData.push(newMessage);
      return newState;
    }

    default:
      return state;
  }
}

export const actionCreators = {
  sendMessage: (text: string) => {
    return {
      type: SEND_MESSAGE,
      text
    } as const
  }
}

export default dialogsReducer;