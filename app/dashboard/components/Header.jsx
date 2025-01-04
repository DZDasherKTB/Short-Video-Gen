import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useContext } from "react";
const Header = () => {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <div className="fixed top-0 left-0 w-full p-3 px-5 flex items-center justify-between shadow-md bg-white z-50">
      <div className="flex gap-3 items-center">
        <Image src="/logo.png" width={30} height={30} alt="logo" />
        <h2 className="font-bold text-xl">AI Short Video</h2>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex gap-3 mr-5">
          <Image src="/coin.png" width={30} height={30} alt="logo" />
          <h2>{userDetail?.credits}</h2>
        </div>
        <button className="bg-violet-600 text-white p-2 pl-4 pr-4 rounded-xl hover:bg-violet-700">
          Dashboard
        </button>
        <UserButton />
      </div>
    </div>
  );
};

export default Header;
