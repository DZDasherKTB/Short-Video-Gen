"use client";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const SelectDuration = ({onUserSelect}) => {
  const [selectedOption,setSelectedOption] = useState()
  return (
    <div className="mt-7">
      <h2 className="font-bold text-xl text-violet-500">Duration</h2>
      <p className="text-gray-500">Select the duration of your video</p>
      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          onUserSelect("duration", value);
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="15 Seconds">15 Seconds</SelectItem>
          <SelectItem value="30 Seconds">30 Seconds</SelectItem>
          <SelectItem value="60 Seconds">60 Seconds</SelectItem>
        </SelectContent>
      </Select>
      {selectedOption == "Custom Prompt" && (
        <>
          <Textarea
            onChange={(e) => onUserSelect("topic", e.target.value)}
            placeholder="Write prompt on which you wnat to generate custom vdieo"
            className="mt-3 text-xl"
            id="prompt"
          />
        </>
      )}
    </div>
  );
}

export default SelectDuration