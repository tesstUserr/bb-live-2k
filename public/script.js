document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("video");
    const videoSrc =
        "https://prod-ent-live-gm.jiocinema.com/hls/live/2105483/uhd_akamai_atv_avc_24x7_bbhindi_day01/master_2160p.m3u8";
    const audioSrc =
        "https://prod-ent-live-gm.jiocinema.com/hls/live/2105483/uhd_akamai_atv_avc_24x7_bbhindi_day01/master_aac.m3u8";

    const isConfirmed = confirm("Have you joined the telegram?");

    if (!isConfirmed) {
        location.href = "https://t.me/bbottlivefree";
        return;
    }

    if (Hls.isSupported()) {
        const hlsVideo = new Hls();
        const hlsAudio = new Hls();

        hlsVideo.loadSource(videoSrc);
        hlsVideo.attachMedia(video);
        hlsVideo.on(Hls.Events.MANIFEST_PARSED, () => {
            const audio = new Audio();
            hlsAudio.loadSource(audioSrc);
            hlsAudio.attachMedia(audio);

            audio.addEventListener("canplay", () => {
                video.play();
                audio.play();
                video.muted = true;

                const syncAudioVideo = () => {
                    if (Math.abs(video.currentTime - audio.currentTime) > 0.1) {
                        audio.currentTime = video.currentTime;
                    }
                    requestAnimationFrame(syncAudioVideo);
                };
                syncAudioVideo();

                video.addEventListener("play", () => {
                    audio.play();
                });

                video.addEventListener("pause", () => {
                    audio.pause();
                });

                video.addEventListener("seeking", () => {
                    audio.currentTime = video.currentTime;
                });

                video.addEventListener("seeked", () => {
                    audio.currentTime = video.currentTime;
                });

                video.addEventListener("ratechange", () => {
                    audio.playbackRate = video.playbackRate;
                });
            });
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
    } else {
        console.error("This browser does not support HLS.");
    }
});
