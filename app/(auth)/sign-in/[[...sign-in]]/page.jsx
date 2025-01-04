import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative w-full h-screen">
        <Image
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/login.jpg"
          alt="Login Image"
          layout="fill" // This ensures it fully fills the container.
          objectFit="cover" // Ensures the image covers the container without distorting.
        />
      </div>
      <div className="flex justify-center items-center h-screen">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#4f46e5", // Primary color
              fontSize: "1.0625rem", // Increased font size for text
              buttonHeight: "2.5rem",
              buttonWidth: "3rem", // Larger button height
              buttonBorderRadius: "1.25rem", // Rounded buttons
              inputHeight: "2.5rem", // Increased input field height
            },
          }}
        />
      </div>
    </div>
  );
}
