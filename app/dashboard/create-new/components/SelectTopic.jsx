'use client'
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const SelectTopic = ({onUserSelect}) => {
  const options=['Custom Prompt','Random AI Story','Scary Story','Historical Facts','Bed Time Story','Motivational','Fun Facts']
  const [selectedOption,setSelectedOption] = useState();
  return (
    <div>
      <h2 className="font-bold text-xl text-violet-500">Content</h2>
      <p className="text-gray-500">What is topic of your video</p>
      <Select onValueChange={(value) => {
        setSelectedOption(value)
        value!='Custom Prompt'&&onUserSelect('topic',value)
        }}>
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => {
            return (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {selectedOption == "Custom Prompt" && (
        <>
          <Textarea
          onChange={(e)=>onUserSelect('topic',e.target.value)}
            placeholder="Write prompt on which you wnat to generate custom vdieo"
            className="mt-3 text-xl"
            id="prompt"
          />
        </>
      )}
    </div>
  );
};

export default SelectTopic;
