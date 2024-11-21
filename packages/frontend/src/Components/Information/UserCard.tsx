import React from "react";

export interface userInfo {
  name: string;
  email: string;
  image: string;
}

interface UserCardProps {
  userData: userInfo;
}

const UserCard: React.FC<UserCardProps> = ({ userData }) => {
    const { name, email, image } = userData;
    const imageURL = import.meta.env.VITE_BACKEND_URL + '/userImg/' + (image ?? 'default.png');
    return (
      <div className="max-w-xs w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Imagen */}
        <div className="relative">
          <img
            src={imageURL}
            alt={`${name}'s profile`}
            className="w-full h-40 object-cover rounded-t-lg"
          />
        </div>
  
        {/* Información del usuario */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-600">{email}</p>
        </div>

      </div>
    );
  };
  
  export default UserCard;