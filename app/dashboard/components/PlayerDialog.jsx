"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import { useState, useEffect } from "react";
import RemotionVideo from "./RemotionVideo";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

const PlayerDialog = ({ playVideo, videoID }) => {
  const [openDialog, setOpenDialog] = useState();
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const router = useRouter();

  useEffect(() => {
    setOpenDialog(openDialog);
    if (videoID) {
      GetVideoData();
    }
    if(openDialog){
      setOpenDialog(false)
    }
    if (playVideo){
      setOpenDialog(true)
    }
  }, [playVideo]);


  // Fetch video data
  const GetVideoData = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoID));
    console.log("result:", result);
    setVideoData(result[0]);
  };

  // Update durationInFrame when videoData changes
  useEffect(() => {
    if (videoData?.captions) {
      const duration = calculateDurationInFrames(videoData.captions, 30); // Assuming 30 fps
      setDurationInFrame(duration);
    }
  }, [videoData]);

  // Function to calculate the duration in frames based on captions and fps
  const calculateDurationInFrames = (captions, fps) => {
    const lastCaptionEnd = captions[captions.length - 1]?.end; // Get the end time of the last caption
    if (lastCaptionEnd) {
      const durationInFrames = (lastCaptionEnd / 1000) * fps; // Convert milliseconds to seconds and multiply by fps to get frames
      return Math.round(durationInFrames); // Round to the nearest integer
    }
    return 0; // Return 0 if no captions or invalid data
  };

  return (
    <Dialog open={openDialog}>
      <DialogContent className="bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5">
            Your video is ready
          </DialogTitle>
          <Player
            component={RemotionVideo}
            durationInFrames={durationInFrame}
            compositionWidth={300}
            compositionHeight={450}
            fps={30}
            controls={true}
            inputProps={{
              ...videoData,
            }}
          />
          <div className="flex flex-row justify-around mt-7">
            <button
              onClick={() => {router.replace("/dashboard");setOpenDialog(false);}}
              className="bg-violet-100 text-black p-2 pl-4 pr-4 rounded-xl hover:bg-violet-200"
            >
              Cancel
            </button>
            <button className="bg-violet-600 text-white p-2 pl-4 pr-4 rounded-xl hover:bg-violet-700">
              Export
            </button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
