// src/components/TableCamera.js
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import axios from 'axios';

const TableCamera = ({ tableIndex }) => {
  const videoRef = useRef(null);
  const [noCamera, setNoCamera] = useState(false);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    let hls;

    const startStream = async () => {
      try {
        // Initiate the stream on the backend
        const response = await axios.get(`http://localhost:5000/start-stream/${tableIndex}`);

        if (response.status === 200) {
          const { message, cameraKey } = response.data;

          if (cameraKey) {
            const streamSrc = `http://localhost:5000/streams/${cameraKey}.m3u8`;
            const video = videoRef.current;

            if (Hls.isSupported()) {
              hls = new Hls();
              hls.loadSource(streamSrc);
              hls.attachMedia(video);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play(); // Autoplay when the stream loads
              });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
              // Native HLS support (e.g., Safari)
              video.src = streamSrc;
              video.addEventListener('loadedmetadata', () => {
                video.play(); // Autoplay for native HLS
              });
            }

            setNoCamera(false);
          } else {
            // If cameraKey is not present, treat it as no camera
            console.error(`Failed to extract camera key from message: "${message}"`);
            setNoCamera(true);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error(`No camera configured for table ${tableIndex}`);
          setNoCamera(true);
        } else {
          console.error('Error starting stream:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    startStream();

    return () => {
      // Clean up: destroy Hls instance and stop the stream
      if (hls) {
        hls.destroy();
      }
      axios.get(`http://localhost:5000/stop-stream/${tableIndex}`)
        .catch((error) => {
          console.error('Error stopping stream:', error);
        });
    };
  }, [tableIndex]);

  if (loading) {
    return (
      <div>
        <h2>Camera View for Table {parseInt(tableIndex) + 1}</h2>
        <p>Loading stream...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Camera View for Table {parseInt(tableIndex) + 1}</h2>
      {noCamera ? (
        <p>No camera configured for this table.</p>
      ) : (
        <video ref={videoRef} style={{ width: '100%' }} controls />
      )}
    </div>
  );
};

export default TableCamera;
