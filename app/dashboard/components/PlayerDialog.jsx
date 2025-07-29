"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [videoData, setVideoData] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (playVideo && videoID) {
      setOpenDialog(true);
      GetVideoData();
    }
  }, [playVideo, videoID]);

  const GetVideoData = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoID));

    const data = result[0];
    setVideoData(data);

    if (data?.audioFileUrl) {
      const audio = new Audio(data.audioFileUrl);

      const setDuration = () => {
        const duration = audio.duration;
        if (!isNaN(duration)) {
          setDurationInFrames(Math.ceil(duration * 30)); // fps = 30
        } else if (data?.captions?.length) {
          const fallbackMs = data.captions.at(-1)?.end || 2000;
          setDurationInFrames(Math.ceil((fallbackMs / 1000) * 30));
        }
      };

      if (audio.readyState >= 1) {
        setDuration(); // already loaded
      } else {
        audio.addEventListener("loadedmetadata", setDuration);
      }
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    router.push("/");
    router.refresh();
  };

  return (
    <Dialog open={openDialog} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold my-5">
            Your video is ready
          </DialogTitle>
        </DialogHeader>

        {videoData && durationInFrames ? (
          <Player
            component={RemotionVideo}
            durationInFrames={durationInFrames}
            compositionWidth={300}
            compositionHeight={450}
            fps={30}
            controls
            inputProps={{ ...videoData }}
          />
        ) : (
          <div className="text-gray-600 font-medium py-10">
            Loading video preview...
          </div>
        )}

        <div className="flex flex-row justify-around mt-7 w-full">
          <DialogClose asChild>
            <button
              onClick={handleClose}
              className="bg-violet-100 text-black p-2 px-4 rounded-xl hover:bg-violet-200"
            >
              Cancel
            </button>
          </DialogClose>
          <button className="bg-violet-600 text-white p-2 px-4 rounded-xl hover:bg-violet-700">
            Export
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerDialog;
