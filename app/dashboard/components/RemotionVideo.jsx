import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
  random as remotionRandom,
} from "remotion";

const RemotionVideo = ({ script, imageList, audioFileUrl, captions }) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();
  const [loadedAudioFileUrl, setLoadedAudioFileUrl] = useState(null);

  useEffect(() => {
    setLoadedAudioFileUrl(audioFileUrl || "https://example.com/default-audio.mp3");
  }, [audioFileUrl]);

  const getDurationFrames = () => {
    if (!captions?.length) return 100;
    return (captions.at(-1)?.end * fps) / 1000;
  };

  const getCurrentCaption = () => {
    if (!captions?.length) return "";
    const ms = (frame / fps) * 1000;
    return captions.find(w => ms >= w.start && ms <= w.end)?.text || "";
  };

  const totalDuration = getDurationFrames();
  const framesPerImage = imageList?.length
    ? Math.floor(totalDuration / imageList.length)
    : 100;

  const flip = (val) => (val > 0.5 ? 1 : -1);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {imageList?.map((url, index) => {
        const seed = `image-${index}`;
        const rand1 = remotionRandom(`${seed}-1`);
        const rand2 = remotionRandom(`${seed}-2`);
        const rand3 = remotionRandom(`${seed}-3`);

        const start = index * framesPerImage;
        const end = start + framesPerImage;

        const progress = interpolate(frame, [start, end], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const easedProgress = Easing.bezier(0.3, 0.1, 0.3, 1)(progress);

        // Zoom in/out direction alternates per image

        const zoomDirection = index % 2 === 0 ? "in" : "out";
        const baseZoom = 1.25; // Ensures the image always starts oversized
        const finalZoom = 1.12; // Still zoomed in enough to cover canvas

        const zoom = interpolate(
          easedProgress,
          [0, 1],
          zoomDirection === "in" ? [finalZoom, baseZoom] : [baseZoom, finalZoom],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );


        // Pan faster and slightly more
        const maxPanX = ((width * 1.12) - width) / 2;
        const maxPanY = ((height * 1.12) - height) / 2;

        const panX = interpolate(easedProgress, [0, 1], [
          flip(rand1) * rand2 * maxPanX * 0.8,
          flip(rand3) * rand1 * maxPanX * 0.8,
        ]);

        const panY = interpolate(easedProgress, [0, 1], [
          flip(rand2) * rand3 * maxPanY * 0.8,
          flip(rand1) * rand2 * maxPanY * 0.8,
        ]);

        const rotate = interpolate(easedProgress, [0, 1], [rand1 * 4 - 2, 0]);
        const skewX = interpolate(easedProgress, [0, 1], [0, rand2 * 4 - 2]);

        const flash = spring({
          frame: frame - start,
          fps,
          config: { damping: 14, stiffness: 150 },
        });

        const flashOpacity = index % 3 === 0
          ? interpolate(flash, [0.9, 1], [0.3, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <Sequence key={index} from={start} durationInFrames={framesPerImage}>
            <AbsoluteFill style={{ overflow: "hidden" }}>
              <Img
                src={url}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `
                    scale(${zoom})
                    translate(${panX}px, ${panY}px)
                    rotateZ(${rotate}deg)
                    skewX(${skewX}deg)
                  `,
                  transformOrigin: "center",
                }}
              />
              {/* Flash effect */}
              <AbsoluteFill
                style={{
                  backgroundColor: "white",
                  opacity: flashOpacity,
                  mixBlendMode: "overlay",
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Captions/Subtitles */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 60,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            padding: "10px 20px",
            borderRadius: 12,
            maxWidth: "90%",
            color: "white",
            fontSize: 26,
            fontWeight: 600,
            textAlign: "center",
            backdropFilter: "blur(6px)",
          }}
        >
          {getCurrentCaption()}
        </div>
      </AbsoluteFill>

      {/* Audio */}
      {loadedAudioFileUrl && <Audio src={loadedAudioFileUrl} />}
    </AbsoluteFill>
  );
};

export default RemotionVideo;
