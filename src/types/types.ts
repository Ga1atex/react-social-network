import { AppStateType } from "../redux/store";

export type GetStateType = () => AppStateType;


export type PostType = {
  id: number,
  message: string,
  likesCount: number,
  isLiked: boolean,
  avatarImage?: string | null,
  userName: string,
  userId: number
}
export type ContactsType = {
  github: string
  vk: string
  facebook: string
  twitter: string
  youtube: string
  website: string
  mainLink: string
}
export type PhotosType = {
  small: string | null,
  large: string | null
}
export type ProfileType = {
  userId: number,
  lookingForAJob: boolean,
  lookingForAJobDescription: string,
  fullName: string,
  contacts: ContactsType,
  photos: PhotosType
  aboutMe: string
}

export type UserType = {
  "name": string,
  "id": number,
  "photos": PhotosType
  "status": string,
  "followed": boolean
}
