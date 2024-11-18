import React from "react";

export interface userInfo {
  name: string;
  email: string;
  image: string;
}

interface UserCardProps {
  userData: userInfo;
}




const UserCard: React.FC<UserCardProps> = ({ userData}) => {
    const { name, email, image } = userData;
    return (
      <div className="max-w-sm bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        {/* Imagen */}
        <div className="relative">
          <img
            src={image || "http"}
            alt={`${name}'s profile`}
            className="w-full h-40 object-cover rounded-t-lg"
          />
        </div>
  
        {/* Información del usuario */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
  
        {/* Acciones */}
        <div className="px-4 pb-4">
          <button className="bg-blue-500 text-white text-sm font-medium px-3 py-2 rounded-lg w-full hover:bg-blue-600">
            View Profile
          </button>
        </div>
      </div>
    );
  };
  
  export default UserCard;