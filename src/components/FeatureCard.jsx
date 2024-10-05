import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white/85 backdrop-blur-3xl rounded-2xl p-6 shadow-xl flex items-start space-x-4">
      <div className="flex flex-col justify-center items-center gap-2">
        {icon}
        <h3 className="text-xl font-semibold text-blue-800">{title}</h3>
        <p className="text-blue-800/50">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
