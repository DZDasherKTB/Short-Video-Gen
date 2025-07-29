"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import { useState, useEffect } from "react";
import RemotionVideo from "./RemotionVideo";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

const PlayerDialog = ({ playVideo, videoID }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const router = useRouter();

  // Handle dialog open
  useEffect(() => {
    if (playVideo) {
      setOpenDialog(true);
    }
    if (videoID) {
      GetVideoData();
    }
  }, [playVideo, videoID]);

  // Fetch video data
  const GetVideoData = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoID));
    setVideoData(result[0]);
  };

  // Update durationInFrame when videoData changes
  useEffect(() => {
    if (videoData?.captions) {
      const duration = calculateDurationInFrames(videoData.captions, 30);
      setDurationInFrame(duration);
    }
  }, [videoData]);

  // Calculate frame duration
  const calculateDurationInFrames = (captions, fps) => {
    const lastCaptionEnd = captions[captions.length - 1]?.end;
    if (lastCaptionEnd) {
      return Math.round((lastCaptionEnd / 1000) * fps);
    }
    return 0;
  };

  // Handle close + reload
  const handleClose = () => {
    setOpenDialog(false);
    router.refresh(); // soft reload to refetch state/UI
  };

  return (
    <Dialog open={openDialog} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5">
            Your video is ready
          </DialogTitle>
        </DialogHeader>

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

        <div className="flex flex-row justify-around mt-7 w-full">
          <DialogClose asChild>
            <button
              onClick={handleClose}
              className="bg-violet-100 text-black p-2 pl-4 pr-4 rounded-xl hover:bg-violet-200"
            >
              Cancel
            </button>
          </DialogClose>
          <button className="bg-violet-600 text-white p-2 pl-4 pr-4 rounded-xl hover:bg-violet-700">
            Export
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
