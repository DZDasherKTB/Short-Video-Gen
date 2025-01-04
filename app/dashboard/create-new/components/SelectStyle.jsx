import Image from "next/image";
import React, { useState } from "react";

const SelectStyle = ({onUserSelect}) => {
  const styleOptions = [
    {
      name: "Realistic",
      image: "/realistic.png",
    },
    {
      name: "Cartoon",
      image: "/cartoon.png",
    },
    {
      name: "Comic",
      image: "/comic.png",
    },
    {
      name: "WaterColor",
      image: "/watercolor.png",
    },
    {
      name: "GTA",
      image: "/gta.png",
    },
  ];
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div className="mt-7">
      <h2 className="font-bold text-xl text-violet-500">Style</h2>
      <p className="text-gray-500">Select a style for your video</p>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {styleOptions.map((item, index) => (
          <div
            onClick={() => {
              setSelectedOption(item.name)
              onUserSelect('imageStyle',item.name)
            }}
            className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl ${selectedOption==item.name&&'border-4 border-violet-500'}`}
            key={index}
          >
            <Image
              className="object-cover rounded-lg w-full h-48"
              src={item.image}
              width={1000}
              height={1000}
              alt={item.name}
            ></Image>
            <h2 className="absolute p-1 bg-black bottom-0 w-full text-white text-center rounded-b-lg">
              {item.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectStyle;
