'use client';

import { useState, useEffect, useContext } from "react";
import SelectTopic from "./components/SelectTopic";
import SelectStyle from "./components/SelectStyle";
import SelectDuration from "./components/SelectDuration";
import CustomLoading from "./components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import { VideoDataContext } from "@/app/context/VideoDataContext";
import { useUser } from "@clerk/nextjs";
import { db } from "@/configs/db";
import { VideoData, Users } from "@/configs/schema";
import PlayerDialog from "../components/PlayerDialog";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { eq } from "drizzle-orm";
import { useToast } from "@/hooks/use-toast";

const CreateNew = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user } = useUser();

  const avgSceneDuration = 4;
  const numScenes = Math.floor((formData?.duration || 30) / avgSceneDuration);

  useEffect(() => {
    if (videoScript?.length > 0) GenerateImages();
  }, [videoScript]);

  useEffect(() => {
    if (
      videoData?.script?.length &&
      videoData?.audioFileUrl &&
      videoData?.captions?.length &&
      videoData?.imageList?.length
    ) {
      SaveVideoData(videoData);
    }
  }, [videoData]);

  const onHandleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const onCreateClickHandler = () => {
    if (userDetail?.credits <= 0) {
      toast({
        variant: "destructive",
        title: "Not Enough Coins",
        description: "Uh oh! You have run out of Coins.",
      });
      return;
    }
    GetVideoScript();
  };

  const GetVideoScript = async () => {
    setLoading(true);

    const prompt = `Write a script to generate ${formData.duration} second video on topic: Interesting ${formData.topic}.
    Divide the video into ${numScenes} scenes.
    Each scene must contain:
    - content_text (1–2 lines of narration)
    - imagePrompt (descriptive AI image prompt)
    Return JSON with an array called "video_script".`;

    try {
      const result = await fetch("/api/get-video-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await result.json();
      const script = data.result?.video_script;

      setVideoData(prev => ({ ...prev, script }));
      setVideoScript(script);
      generateAudioFile(script);
    } catch (error) {
      console.error("Video script fetch error:", error);
    }
  };

  const generateAudioFile = async (script) => {
    setLoading(true);
    const id = uuidv4();
    const combinedScript = script.map(s => s.content_text).join(" ");

    try {
      const resp = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: combinedScript, id }),
      });

      const data = await resp.json();
      const audioUrl = data.downloadUrl;

      setVideoData(prev => ({ ...prev, audioFileUrl: audioUrl }));
      generateCaptions(audioUrl);
    } catch (error) {
      console.error("Audio generation error:", error);
    }
  };

  const generateCaptions = async (audioUrl) => {
    try {
      const resp = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioFileUrl: audioUrl }),
      });

      const data = await resp.json();
      setVideoData(prev => ({ ...prev, captions: data.result }));
    } catch (error) {
      console.error("Caption generation failed:", error);
    }
  };

  const GenerateImages = async () => {
    setLoading(true);
    const images = [];

    for (const scene of videoScript) {
      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: scene.imagePrompt }),
        });

        const data = await response.json();
        images.push(data.result);
      } catch (err) {
        console.error("Image gen failed:", err);
      }
    }

    setVideoData(prev => ({ ...prev, imageList: images }));
    setLoading(false);
    UpdateUserCredits();
  };

  const UpdateUserCredits = async () => {
    const updatedCredits = userDetail?.credits - 10;
    await db
      .update(Users)
      .set({ credits: updatedCredits })
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    setUserDetail(prev => ({ ...prev, credits: updatedCredits }));
  };

  const SaveVideoData = async (data) => {
    setLoading(true);
    const result = await db
      .insert(VideoData)
      .values({
        videoScript: data.script,
        audioFileUrl: data.audioFileUrl,
        captions: data.captions,
        imageList: data.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ id: VideoData.id });

    const vid = result[0]?.id;
    setVideoId(vid);
    setPlayVideo(true);
    setLoading(false);
  };

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-violet-600 text-center">Create Video</h2>

      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <button
          onClick={onCreateClickHandler}
          className="mt-10 w-full bg-violet-600 text-white p-2 px-4 rounded-xl hover:bg-violet-700"
        >
          Create Short Video
        </button>
      </div>

      <CustomLoading loading={loading} />
      <PlayerDialog
        playVideo={playVideo}
        videoID={videoId}
        onClose={() => window.location.reload()}
      />
    </div>
  );
};

export default CreateNew;
