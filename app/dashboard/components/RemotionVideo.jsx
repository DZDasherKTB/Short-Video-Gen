import React, { useState, useEffect } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";

const RemotionVideo = ({ script, imageList, audioFileUrl, captions }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame()
  const [loadedAudioFileUrl, setLoadedAudioFileUrl] = useState(null); // State to store the loaded audio URL

  // Get the duration in frames for each image sequence
  const getDurationFrames = () => {
    return (captions[captions?.length - 1]?.end * fps) / 1000;
  };

  // Fetch audio URL if not passed as a prop
  useEffect(() => {
    if (audioFileUrl) {
      setLoadedAudioFileUrl(audioFileUrl); // Use the passed URL if available
    } else {
      setLoadedAudioFileUrl("https://example.com/default-audio.mp3"); // Use a default URL if not available
    }
  }, [audioFileUrl]); // Re-run if audioFileUrl changes
  
  const getCurrentCaptions=()=>{
    const currentTime=frame/30*1000
    const currentCaption = captions.find(word => currentTime >= word.start && currentTime <= word.end);
    return currentCaption?currentCaption?.text:'';
  }

  return (
    <AbsoluteFill className="bg-black">
      {imageList?.map((item, index) => 
      
      {
        const startTime = (index * getDurationFrames()) / imageList?.length;
        const duration = getDurationFrames()
        
        const scale =(index)=> interpolate(
          frame,
          [startTime,startTime+duration/2,startTime+duration],
          index%2==0?[1,1.3,1]:[1.3,1,1.3],
          {extrapolateLeft:'clamp',extrapolateRight:'clamp'}
        )
        
        return (
        <Sequence
          key={index}
          from={startTime}
          durationInFrames={duration}
        >
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Img
              src={item}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform:`scale(${scale(index)})`
              }}
            />
            <AbsoluteFill style={{color:'white',justifyContent:'center', top:undefined,bottom:50,height:150,textAlign:'center',width:'100%'}}>
              <h2 className="text-2xl">{getCurrentCaptions()}</h2>
            </AbsoluteFill>
          </AbsoluteFill>
        </Sequence>
      )})}

      {/* Render the Audio component if URL is available */}
      {loadedAudioFileUrl && (
        <Audio
          src={loadedAudioFileUrl}
        />
      )}
    </AbsoluteFill>
  );
};

export default RemotionVideo;
