'use client'
import { useState,useEffect, useContext } from "react";
import SelectTopic from "./components/SelectTopic";
import SelectStyle from "./components/SelectStyle";
import SelectDuration from "./components/SelectDuration";
import CustomLoading from "./components/CustomLoading";
import {v4 as uuidv4} from 'uuid'
import { VideoDataContext } from "@/app/context/VideoDataContext";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import PlayerDialog from "../components/PlayerDialog";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { Users } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";

const createNew = () => {
  const {toast} = useToast()
  const [formData,setFormData] = useState([])
  const [loading,setLoading] = useState(false)
  const [videoScript,setVideoScript] = useState([])
  const [audioFileUrl,setAudioFileUrl] = useState()
  const [captions,setCaptions] = useState()
  const [imageList, setImageList] = useState(null);
  const [playVideo,setPlayVideo]=useState(false);
  const [videoId,setVideoId]=useState()
  const {videoData,setVideoData}=useContext(VideoDataContext)
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  // e.g., 30 seconds / avg 3 seconds = ~10 scenes
  const avgSceneDuration = 3; // seconds
  const numScenes = Math.floor(formData.duration / avgSceneDuration);
  const {user}=useUser();


  useEffect(() => {
    if (videoScript && videoScript.length > 0) {
      GenerateImage(); // Call GenerateImage only when videoScript is populated
    }
  }, [videoScript]);

  useEffect(() => {
    console.log("Checking videoData:", videoData);

    if (
      videoData?.script?.length > 0 &&
      videoData?.audioFileUrl &&
      videoData?.captions?.length > 0 &&
      videoData?.imageList?.length > 0
    ) {
      SaveVideoData(videoData);
    } 
  }, [videoData]);

  const SaveVideoData = async (videoData) => {

    setLoading(true);
    const result = await db
      .insert(VideoData)
      .values({
        videoScript: videoData.script,
        audioFileUrl: videoData.audioFileUrl,
        captions: videoData.captions,
        imageList: videoData.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ id: VideoData?.id });
    
    setVideoId(result[0].id);
    setPlayVideo(true);
    console.log(result);
    setLoading(false);
  };


  const onHandleInputChange = (fieldName,fieldValue)=>{
    console.log(fieldName,fieldValue)
    
    setFormData((prev)=>({
      ...prev,
      [fieldName]:fieldValue
    }))

  }

  const onCreateClickHandler=()=>{
    console.log("credits: ", userDetail?.credits);
    if(userDetail.credits<=0){
      toast({
        variant: "destructive",
        title: "Not Enough Coins",
        description: "Uh oh! You have run out of Coins.",
      });
      
      console.log("Not Enough Credits")
      return;
    }else{GetVideoScript();}
  }

  const GetVideoScript = async ()=> {
    setLoading(true)

    const prompt = `
    Write a script to generate a ${formData.duration} second video on the topic: Interesting ${formData.topic}.
    Divide the video into exactly ${numScenes} scenes — each scene should be around ${avgSceneDuration} seconds long.
    Each scene must have:
    - "content_text": 1–2 lines of narration
    - "imagePrompt": vivid, descriptive visual prompt

    Return the result in valid JSON with a key "video_script": [ ... ].
    Each element should include:
    - "scene"
    - "duration" (in seconds)
    - "content_text"
    - "imagePrompt"
    Only return valid JSON — no markdown or explanation.
    `;

    try {
      const result = await fetch("/api/get-video-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }), // Sending the prompt
      });

      const data = await result.json(); // Parse the response
      const script = data.result.video_script;
      setVideoData(prev=>({
        ...prev,
        'script':script
      }))
      setVideoScript(script); // Update the state
      generateAudioFile(script)

    } catch (error) {
      console.error("Error fetching video script:", error);
    } 
  }

  const generateAudioFile = async (videoScriptData) => {
    setLoading(true)
    let script = "";
    const id = uuidv4();
    videoScriptData.forEach((item) => {
      script += item.content_text + " "; // Use the correct key: content_text
    });

    try {
      const resp = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: script,
          id: id,
        }),
      });

      const data = await resp.json()
      setVideoData((prev) => ({
        ...prev,
        'audioFileUrl': data.downloadUrl,
      }));
      setAudioFileUrl(data?.downloadUrl)
      generateAudioCaptions(data.downloadUrl)

    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  const generateAudioCaptions= async (fileUrl)=>{
    setLoading(true);
    console.log("trying to generate audio")
    const response = await fetch('/api/generate-captions',{
      method: 'POST',
      headers: {
        "Content-Type":'application/json'
      },
      body:JSON.stringify({
        audioFileUrl:fileUrl
      })
    })
    const data = await response.json()
    setVideoData((prev) => ({
      ...prev,
      'captions': data.result,
    }));
    setCaptions(data?.result)
  }

  const GenerateImage = async () => {
    setLoading(true)
    let images = [];

    for (const element of videoScript) {
      const prompt = element?.imagePrompt;

      try {
        const response = await fetch(`/api/generate-image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt }), 
        });

        const data = await response.json();
        images.push(data.result);
      } catch (error) {
        console.error("Failed to generate image", error);
      }
    }
    setVideoData((prev) => ({
      ...prev,
      'imageList': images,
    }));
    UpdateUserCredits()
    setImageList(images);
        setLoading(false);
  };

  const UpdateUserCredits = async()=>{
    const result = await db.update(Users).set({
      credits:userDetail?.credits-10
    }).where(eq(Users?.email,user?.primaryEmailAddress?.emailAddress))
    console.log(result)
    setUserDetail(prev=>({
      ...prev,
      "credits":userDetail?.credits-10
    }))
  }

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-violet-600 text-center">
        Create Video
      </h2>
      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <button onClick={onCreateClickHandler} className="mt-10 w-full bg-violet-600 text-white p-2 pl-4 pr-4 rounded-xl hover:bg-violet-700 ">
          Create Short Video
        </button>
      </div>
      <CustomLoading loading={loading}/>
      <PlayerDialog playVideo={playVideo} videoID={videoId} onClose={() => window.location.reload()} />
    </div>
  );
};

export default createNew;
