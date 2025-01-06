import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../store/slices/authSlice";
import { useMutation, useQueryClient } from "react-query";
import api from "../../utils/api";
import { FaUserEdit} from "react-icons/fa";
import "./ProfileCard.css";

const ProfileCard = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
  //   user.name
  // )}&background=random`;

  const updateProfileMutation = useMutation(
    async (newName) => {
      const response = await api.put("/users/profile", { name: newName });
      return response.data;
    },
    {
      onSuccess: (data) => {
        dispatch(updateUserProfile(data));
        queryClient.invalidateQueries("user-profile");
        setIsEditing(false);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() && newName !== user.name) {
      updateProfileMutation.mutate(newName);
    }

    else if(newName.trim()){
      setIsEditing(false);
    }
  };

  return (
    <div className="profile-card-container">
    <div className="profile-card">
      <div className="profile-card-logo">
      {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="profile-info">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="form-input"
              autoFocus
            />
            <button type="submit" className="save-btn">Update</button>
          </form>
        ) : (
          <>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <FaUserEdit /> <span>Edit Name</span>
            </button>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

export default ProfileCard;
