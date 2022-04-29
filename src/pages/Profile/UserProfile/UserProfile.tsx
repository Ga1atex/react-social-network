import Preloader from "../../../components/common/Preloader/Preloader";
import ProfileStatusContainer from "./ProfileStatus/ProfileStatusContainer";
import userPhoto from '../../../assets/images/user.png';
import './UserProfile.css';
import { ChangeEvent, useEffect, useState } from "react";
import ProfileDataForm from "./ProfileDataForm";
import { ContactsType, ProfileType } from "../../../types/types";
import { useDispatch } from "react-redux";
import { actionCreators, savePhoto, saveProfile } from "../../../redux/reducers/profileReducer/profileReducer";
import { FormikHelpers } from "formik";
import { Button, Image } from "antd";
import { Link } from "react-router-dom";
import { RouteNames } from "../../../App";

type PropsType = {
  isOwner: boolean
  profile: ProfileType | null,
  userId: number | null,
  status: string,
  profileUpdateStatus: string
}

const UserProfile: React.FC<PropsType> = (props) => {
  const { profileUpdateStatus, profile, isOwner, status, userId } = props;

  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch()

  const onMainPhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e);

    if (e.target.files?.length) { // "?" instead of "e.target.files && "
      dispatch(savePhoto(e.target.files[0]));
    }
  };

  const onSubmit = (formData: ProfileType, submitProps: FormikHelpers<ProfileType>) => {
    // dispatch(saveProfile(formData, submitProps.setStatus));
    dispatch(saveProfile(formData, submitProps.setErrors));
  };

  useEffect(() => {
    if (profileUpdateStatus === 'success') {
      setEditMode(false);
      dispatch(actionCreators.saveProfileSuccess('none'))
    }
  }, [profileUpdateStatus, dispatch])

  const goToEditMode = () => {
    setEditMode(true);
  }

  if (!profile) {
    return <Preloader />;
  }

  return (
    <div className="profile__info user-info">
      <Image className="user-info__avatar" src={profile.photos.large || userPhoto} alt="" width={250} height={250} />
      {isOwner && <div>
        <span>Photo:</span>
        <input type={"file"} onChange={onMainPhotoSelected} />
      </div>
      }
      {!isOwner &&
        <Button><Link to={`/${RouteNames.DIALOGS}/${userId}`}>Написать сообщение</Link></Button>
      }
      <ProfileStatusContainer status={status} isOwner={isOwner} />
      {editMode
        ? <ProfileDataForm profile={profile} onSubmit={onSubmit} />
        : <ProfileData goToEditMode={goToEditMode} profile={profile} isOwner={isOwner} />}
    </div>
  );
}
type ContactPropsType = {
  contactTitle: string
  contactValue: string
}

const Contact: React.FC<ContactPropsType> = ({ contactTitle, contactValue, }) => {
  return <div className="contact__title">
    {contactTitle}: <a target="_blank" href={`https://www.${contactValue}`} rel="noreferrer" className={"contact__value"}>{contactValue}</a>
  </div>;
};

type ProfileDataPropsType = {
  profile: ProfileType
  isOwner: boolean
  goToEditMode: () => void
}

const ProfileData: React.FC<ProfileDataPropsType> = (props) => {
  const { isOwner, goToEditMode, profile } = props;

  return (<div className="user-info__description">
    {isOwner && <Button onClick={goToEditMode}>Edit</Button>}
    <div className="">
      <h3 className="user-info__name">Full name: {profile.fullName}</h3>
      <p className="user-info__job">Looking for a job: {profile.lookingForAJob ? "Yes" : "No"} </p>
      {profile.lookingForAJob && <p className="user-info__job-description">My professional skills: {profile.lookingForAJobDescription}</p>}
      <p className="user-info__job">About me: {profile.aboutMe} </p>
    </div>
    <div className="user-info__contacts">
      <h3 className="user-info__contacts-title">My contacts:</h3>
      {Object.keys(profile.contacts)
        .map(item => {
          return <Contact key={item} contactTitle={item} contactValue={profile.contacts[item as keyof ContactsType]} />;
        })}
    </div>
  </div>);
};


export default UserProfile
