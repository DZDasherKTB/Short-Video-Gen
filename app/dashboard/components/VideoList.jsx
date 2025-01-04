import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";
import { useState } from "react";

const VideoList = ({ videoList }) => {
  const[openPlayDialog,setOpenPlayDialog]= useState(false)
  const [videoId,setVideoId] = useState()
  return (
    <div className="mt-10 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid=cols-5 gap-10  justify-center content-center">
      {videoList?.map((video, index) => (
        <div onClick={()=>{setOpenPlayDialog(Date.now());setVideoId(video?.id)}} key={index} className="cursor-pointer hover:scale-105 transition-all">
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={250}
            compositionHeight={400}
            frameToDisplay={30}
            durationInFrames={120}
            style={{
              borderRadius:15
            }}
            fps={30}
            inputProps={{
              ...video,
              setDurationInFrame:(v)=>console.log(v)
            }}
          />
        </div>
      ))}
      <PlayerDialog playVideo={openPlayDialog} videoID={videoId} />
    </div>
  );
};

export default VideoList;
