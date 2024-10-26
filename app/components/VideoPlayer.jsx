import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-ads';
import 'videojs-ima/dist/videojs.ima.js';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const loadGoogleIMAScript = () => {
      return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
      });
  };
    const timeout = setTimeout(async() => {
      await loadGoogleIMAScript();

      let videoElement = videoRef.current;
      if (!videoElement) return;

      if (!playerRef.current) {
        const player = videojs(videoRef.current, {
          controls: true,
          preload: 'auto',
          width: 640,
          height: 360
          });

          const imaOptions = {
            adTagUrl:"https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpreonlybumper&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&correlator=",
            showControlsForAds: true,
            disableAdControls: true,
            restoreCustomPlaybackStateOnAdBreakComplete: true,
          };
          player.ima(imaOptions);
          player.on("ads-loader", function (response) {
						const adsLoader = response.adsLoader;
						console.log("AdsLoader received:", adsLoader);
				
						// Handle AdsManager creation when ads are loaded
						adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, (event) => {
						  const adsManager = event.getAdsManager();
						  console.log("AdsManager created:", adsManager);
				
						  // Add event listeners to AdsManager
						  adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, () => {
							console.log("Ad started");
						  });
				
						  adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, () => {
							console.log("Ad completed");
						  });
				
							adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (event) => {
								console.error("Ad error:", event.getError());
								adsManager.destroy();
							});
							adsManager.addEventListener(
								google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
								function () {
									console.log('All ads Completed');
									// setAdsOn(false);
									// setVideoLoading(false);
									// videoElement.play();
									// setPlayPause(false);
									console.log("prerolladsmanager", adsManager)
									console.log("prerolladsloader", adsLoader)
									if (adsManager) {
										adsManager.destroy();
									}
									if (adsLoader) {
										// Reset the IMA SDK.
										adsLoader.contentComplete();
									}
									setAdTagUrl(null)
									setReRender(true)

								}
							);
							player.ima.addEventListener(
								google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
								function () {
									console.log('content resumed');
									if (adsManager) {
										adsManager.destroy();
									}
									if (adsLoader) {
										// Reset the IMA SDK.
										adsLoader.contentComplete();
									}
									// setAdsOn(false);
									// setVideoLoading(false);
									// videoElement.play();
									// setPlayPause(false);
								}
							);
						});
				
						// Handle ad loading errors
						adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (event) => {
						  console.error("AdsLoader error:", event.getError());
						});
				
					
					  });

          return () => {
              if (player) {
                  player.dispose();
              }
          };
      }
  }, 0);

  return () => clearTimeout(timeout);
    // Clean up the player on component unmount
    // return () => {
    //     if (player) {
    //         player.dispose();
    //     }
    // };
}, [videoRef]);
  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls
      />
    </div>
  );
};

export default VideoPlayer;