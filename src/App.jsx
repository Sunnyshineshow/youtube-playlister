import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700&display=swap');

  .afq-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

  .afq-wrap {
    font-family: 'Syne', sans-serif;
    background: #0a0a0b;
    color: #e8e6e1;
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 600px;
    border-radius: 12px;
    overflow: hidden;
  }

  .afq-header {
    padding: 18px 24px 14px;
    border-bottom: 0.5px solid #2a2a2e;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #0f0f11;
  }

  .afq-logo {
    width: 28px; height: 28px;
    background: #e63946;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .afq-title { font-size: 15px; font-weight: 700; letter-spacing: -0.3px; color: #f0ede8; }
  .afq-sub { font-size: 11px; color: #e63946; font-family: 'DM Mono', monospace; margin-left: auto; letter-spacing: 0.5px; }

  .afq-main {
    display: grid;
    grid-template-columns: 1fr 320px;
    height: 540px;
  }

  .afq-player-section {
    display: flex; flex-direction: column;
    background: #0a0a0b;
    border-right: 0.5px solid #1e1e22;
  }

  .afq-video-container {
    position: relative;
    background: #000;
    flex: 1;
    display: flex; align-items: center; justify-content: center;
  }

  .afq-video-container iframe,
  .afq-video-container > div { width: 100%; height: 100%; min-height: 280px; }

  .afq-empty-state {
    display: flex; flex-direction: column;
    align-items: center; gap: 12px;
    padding: 40px; color: #444; text-align: center;
    position: absolute; inset: 0; justify-content: center;
    background: #000;
  }

  .afq-empty-icon {
    width: 48px; height: 48px;
    border: 1.5px solid #2a2a2e; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }

  .afq-np-bar {
    padding: 12px 16px;
    background: #111114;
    border-top: 0.5px solid #1e1e22;
    display: flex; align-items: center; gap: 10px;
    min-height: 56px;
  }

  .afq-np-info { flex: 1; min-width: 0; }
  .afq-np-label { font-size: 10px; color: #e63946; font-family: 'DM Mono', monospace; letter-spacing: 1px; margin-bottom: 3px; }
  .afq-np-title { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #f0ede8; }

  .afq-controls { display: flex; align-items: center; gap: 6px; }

  .afq-ctrl {
    width: 32px; height: 32px;
    border: 0.5px solid #2a2a2e;
    background: transparent; border-radius: 8px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #888; transition: all 0.15s;
  }
  .afq-ctrl:hover { background: #1e1e22; color: #e8e6e1; border-color: #3a3a3e; }
  .afq-ctrl.primary { background: #e63946; border-color: #e63946; color: white; width: 36px; height: 36px; }
  .afq-ctrl.primary:hover { background: #c8313e; }

  .afq-sidebar { display: flex; flex-direction: column; background: #0f0f11; overflow: hidden; min-height: 0; }

  .afq-add-section { padding: 14px 16px; border-bottom: 0.5px solid #1e1e22; }
  .afq-add-label { font-size: 10px; color: #666; font-family: 'DM Mono', monospace; letter-spacing: 1px; margin-bottom: 8px; }

  .afq-input-row { display: flex; gap: 6px; }

  .afq-url-input {
    flex: 1;
    background: #1a1a1e; border: 0.5px solid #2a2a2e;
    border-radius: 8px; padding: 8px 10px;
    font-size: 12px; color: #e8e6e1;
    font-family: 'DM Mono', monospace;
    outline: none; transition: border-color 0.15s;
  }
  .afq-url-input::placeholder { color: #444; }
  .afq-url-input:focus { border-color: #e63946; }

  .afq-add-btn {
    background: #e63946; border: none; border-radius: 8px;
    padding: 8px 12px; font-size: 12px; font-weight: 600;
    color: white; cursor: pointer;
    font-family: 'Syne', sans-serif; transition: background 0.15s; white-space: nowrap;
  }
  .afq-add-btn:hover { background: #c8313e; }

  .afq-quick-add { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }

  .afq-chip {
    font-size: 10px; padding: 4px 8px; border-radius: 20px;
    border: 0.5px solid #2a2a2e; background: transparent;
    color: #666; cursor: pointer;
    font-family: 'DM Mono', monospace; transition: all 0.15s;
  }
  .afq-chip:hover { border-color: #e63946; color: #e63946; background: rgba(230,57,70,0.08); }

  .afq-pl-header {
    padding: 12px 16px 8px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .afq-pl-label { font-size: 10px; color: #666; font-family: 'DM Mono', monospace; letter-spacing: 1px; }
  .afq-pl-count { font-size: 10px; color: #e63946; font-family: 'DM Mono', monospace; }

  .afq-clear-btn {
    font-size: 10px; color: #555; background: none;
    border: none; cursor: pointer;
    font-family: 'DM Mono', monospace; transition: color 0.15s;
  }
  .afq-clear-btn:hover { color: #e63946; }

  .afq-pl-items {
    flex: 1; overflow-y: auto; padding: 0 8px 8px;
    min-height: 0;
    scrollbar-width: thin; scrollbar-color: #2a2a2e transparent;
  }
  .afq-pl-items::-webkit-scrollbar { width: 3px; }
  .afq-pl-items::-webkit-scrollbar-thumb { background: #2a2a2e; border-radius: 2px; }

  .afq-pl-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 8px; border-radius: 8px; cursor: pointer;
    transition: background 0.12s; border: 0.5px solid transparent;
    margin-bottom: 2px;
  }
  .afq-pl-item:hover { background: #1a1a1e; }
  .afq-pl-item.active { background: rgba(230,57,70,0.1); border-color: rgba(230,57,70,0.3); }

  .afq-thumb {
    width: 52px; height: 36px; background: #1e1e22;
    border-radius: 6px; flex-shrink: 0; overflow: hidden;
  }
  .afq-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .afq-item-info { flex: 1; min-width: 0; }
  .afq-item-title { font-size: 12px; font-weight: 500; color: #d0cec9; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .afq-item-id { font-size: 10px; color: #555; font-family: 'DM Mono', monospace; margin-top: 2px; }

  .afq-item-num { font-size: 11px; color: #444; font-family: 'DM Mono', monospace; flex-shrink: 0; width: 18px; text-align: right; }
  .afq-pl-item.active .afq-item-num { color: #e63946; }

  .afq-rm-btn {
    width: 20px; height: 20px; background: none; border: none;
    color: #333; cursor: pointer; border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.12s; flex-shrink: 0;
  }
  .afq-rm-btn:hover { background: rgba(230,57,70,0.15); color: #e63946; }

  .afq-empty-pl { padding: 32px 16px; text-align: center; color: #333; font-size: 12px; line-height: 1.8; }

  .afq-autoplay-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-top: 0.5px solid #1e1e22;
  }
  .afq-toggle-label { font-size: 11px; color: #666; font-family: 'DM Mono', monospace; flex: 1; }

  .afq-toggle {
    width: 32px; height: 18px; background: #2a2a2e;
    border-radius: 9px; position: relative; cursor: pointer;
    transition: background 0.2s; flex-shrink: 0;
  }
  .afq-toggle.on { background: #e63946; }
  .afq-toggle-knob {
    width: 14px; height: 14px; background: white; border-radius: 50%;
    position: absolute; top: 2px; left: 2px; transition: left 0.2s;
  }
  .afq-toggle.on .afq-toggle-knob { left: 16px; }

  .afq-toast {
    position: fixed; bottom: 20px; left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: #1e1e22; border: 0.5px solid #2a2a2e;
    border-radius: 8px; padding: 8px 16px;
    font-size: 12px; color: #e8e6e1;
    font-family: 'DM Mono', monospace;
    transition: transform 0.25s ease; z-index: 1000; white-space: nowrap;
    pointer-events: none;
  }
  .afq-toast.show { transform: translateX(-50%) translateY(0); }
`;

const QUICK_ADDS = [
  { id: "dQw4w9WgXcQ", label: "Classic", title: "Never Gonna Give You Up" },
  { id: "JGwWNGJdvx8", label: "Pop", title: "Shape of You" },
  { id: "kXYiU_JCYtU", label: "Rock", title: "Numb" },
  { id: "y6Sxv-sUYtM", label: "Lo-fi", title: "Piano Chill" },
  { id: "2vjPBrBU-TM", label: "Jazz", title: "Jazz Cafe" },
];

function extractVideoId(url) {
  url = url.trim();
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(); return; }
    const existing = document.getElementById("yt-api-script");
    if (existing) {
      const check = setInterval(() => {
        if (window.YT && window.YT.Player) { clearInterval(check); resolve(); }
      }, 100);
      return;
    }
    window.onYouTubeIframeAPIReady = resolve;
    const tag = document.createElement("script");
    tag.id = "yt-api-script";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
}

export default function AdFreeQueue() {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [autoplay, setAutoplay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [toast, setToast] = useState({ msg: "", show: false });
  const [nowPlayingTitle, setNowPlayingTitle] = useState("—");
  const [hasPlayer, setHasPlayer] = useState(false);

  const playerRef = useRef(null);
  const playerReadyRef = useRef(false);
  const toastTimer = useRef(null);
  const currentIndexRef = useRef(currentIndex);
  const playlistRef = useRef(playlist);
  const autoplayRef = useRef(autoplay);

  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { playlistRef.current = playlist; }, [playlist]);
  useEffect(() => { autoplayRef.current = autoplay; }, [autoplay]);

  useEffect(() => {
    if (!document.getElementById("afq-styles")) {
      const style = document.createElement("style");
      style.id = "afq-styles";
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  }, []);

  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast({ msg: "", show: false }), 2200);
  }, []);

  const initPlayer = useCallback(async (videoId) => {
    await loadYouTubeAPI();
    const container = document.getElementById("afq-player-container");
    if (!container) return;
    container.innerHTML = '<div id="afq-yt-player"></div>';

    playerRef.current = new window.YT.Player("afq-yt-player", {
      height: "100%",
      width: "100%",
      videoId,
      playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0, iv_load_policy: 3, fs: 1 },
      events: {
        onReady(e) {
          playerReadyRef.current = true;
          e.target.playVideo();
          setIsPlaying(true);
          setHasPlayer(true);
        },
        onStateChange(e) {
          const S = window.YT.PlayerState;
          if (e.data === S.PLAYING) {
            setIsPlaying(true);
            const title = playerRef.current?.getVideoData?.()?.title;
            if (title) {
              setNowPlayingTitle(title);
              setPlaylist(prev => {
                const next = [...prev];
                if (next[currentIndexRef.current]) next[currentIndexRef.current].title = title;
                return next;
              });
            }
          } else if (e.data === S.PAUSED) {
            setIsPlaying(false);
          } else if (e.data === S.ENDED) {
            setIsPlaying(false);
            if (autoplayRef.current) {
              const nextIdx = currentIndexRef.current + 1;
              if (nextIdx < playlistRef.current.length) {
                loadVideo(nextIdx);
              } else {
                showToast("Queue finished");
              }
            }
          }
        },
      },
    });
  }, [showToast]);

  const loadVideo = useCallback((idx) => {
    const pl = playlistRef.current;
    if (idx < 0 || idx >= pl.length) return;
    setCurrentIndex(idx);
    currentIndexRef.current = idx;
    const video = pl[idx];
    setNowPlayingTitle(video.title);

    if (playerRef.current && playerReadyRef.current) {
      playerRef.current.loadVideoById({ videoId: video.id });
      setIsPlaying(true);
    } else {
      initPlayer(video.id);
    }
  }, [initPlayer]);

  const addVideo = useCallback((id, title) => {
    setPlaylist(prev => {
      if (prev.find(v => v.id === id)) { showToast("Already in queue"); return prev; }
      const next = [...prev, { id, title }];
      playlistRef.current = next;
      if (next.length === 1) {
        setTimeout(() => loadVideo(0), 0);
      }
      return next;
    });
    showToast("Added to queue");
  }, [showToast, loadVideo]);

  const addFromInput = useCallback(() => {
    const id = extractVideoId(urlInput);
    if (!id) { showToast("Invalid YouTube URL"); return; }
    addVideo(id, "Video " + id.substring(0, 6) + "...");
    setUrlInput("");
  }, [urlInput, addVideo, showToast]);

  const removeVideo = useCallback((idx) => {
    setPlaylist(prev => {
      const next = prev.filter((_, i) => i !== idx);
      playlistRef.current = next;
      if (next.length === 0) {
        setCurrentIndex(-1);
        currentIndexRef.current = -1;
        setNowPlayingTitle("—");
        setHasPlayer(false);
        playerRef.current?.stopVideo?.();
        const c = document.getElementById("afq-player-container");
        if (c) c.innerHTML = "";
      } else if (idx === currentIndexRef.current) {
        const newIdx = Math.min(idx, next.length - 1);
        loadVideo(newIdx);
      } else if (idx < currentIndexRef.current) {
        setCurrentIndex(i => i - 1);
        currentIndexRef.current -= 1;
      }
      return next;
    });
  }, [loadVideo]);

  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
    playlistRef.current = [];
    setCurrentIndex(-1);
    currentIndexRef.current = -1;
    setNowPlayingTitle("—");
    setHasPlayer(false);
    playerRef.current?.stopVideo?.();
    const c = document.getElementById("afq-player-container");
    if (c) c.innerHTML = "";
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current || !playerReadyRef.current) return;
    if (isPlaying) { playerRef.current.pauseVideo(); setIsPlaying(false); }
    else { playerRef.current.playVideo(); setIsPlaying(true); }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    loadVideo((currentIndex + 1) % playlist.length);
  }, [playlist, currentIndex, loadVideo]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    loadVideo((currentIndex - 1 + playlist.length) % playlist.length);
  }, [playlist, currentIndex, loadVideo]);

  return (
    <div className="afq-wrap">
      {/* Header */}
      <div className="afq-header">
        <div className="afq-logo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <span className="afq-title">AdFree Queue</span>
        <span className="afq-sub">NO_ADS · AUTO_PLAY</span>
      </div>

      <div className="afq-main">
        {/* Player */}
        <div className="afq-player-section">
          <div className="afq-video-container">
            <div id="afq-player-container" style={{ width: "100%", height: "100%", minHeight: 280 }} />
            {!hasPlayer && (
              <div className="afq-empty-state">
                <div className="afq-empty-icon">
                  <svg width="22" height="22" fill="#444" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Add a video to start</div>
                <div style={{ fontSize: 11, color: "#3a3a3e", fontFamily: "'DM Mono', monospace" }}>
                  Paste a YouTube URL or try a quick add
                </div>
              </div>
            )}
          </div>

          {/* Now playing bar */}
          <div className="afq-np-bar">
            <div className="afq-np-info">
              <div className="afq-np-label">NOW PLAYING</div>
              <div className="afq-np-title">{nowPlayingTitle}</div>
            </div>
            <div className="afq-controls">
              <button className="afq-ctrl" onClick={playPrev}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>
              </button>
              <button className={`afq-ctrl primary`} onClick={togglePlayPause}>
                {isPlaying
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                }
              </button>
              <button className="afq-ctrl" onClick={playNext}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="afq-sidebar">
          <div className="afq-add-section">
            <div className="afq-add-label">ADD TO QUEUE</div>
            <div className="afq-input-row">
              <input
                className="afq-url-input"
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addFromInput()}
                placeholder="youtube.com/watch?v=..."
              />
              <button className="afq-add-btn" onClick={addFromInput}>Add</button>
            </div>
            <div className="afq-quick-add">
              {QUICK_ADDS.map(q => (
                <button key={q.id} className="afq-chip" onClick={() => addVideo(q.id, q.title)}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="afq-pl-header">
            <span className="afq-pl-label">QUEUE</span>
            <span className="afq-pl-count">{playlist.length} {playlist.length === 1 ? "video" : "videos"}</span>
            <button className="afq-clear-btn" onClick={clearPlaylist}>clear all</button>
          </div>

          <div className="afq-pl-items">
            {playlist.length === 0 ? (
              <div className="afq-empty-pl">
                Queue is empty<br />
                <span style={{ color: "#2a2a2e" }}>Add videos above to begin</span>
              </div>
            ) : (
              playlist.map((v, i) => (
                <div
                  key={v.id}
                  className={`afq-pl-item${i === currentIndex ? " active" : ""}`}
                  onClick={() => loadVideo(i)}
                >
                  <span className="afq-item-num">{i + 1}</span>
                  <div className="afq-thumb">
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                      alt=""
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  </div>
                  <div className="afq-item-info">
                    <div className="afq-item-title">{v.title}</div>
                    <div className="afq-item-id">{v.id}</div>
                  </div>
                  <button
                    className="afq-rm-btn"
                    onClick={e => { e.stopPropagation(); removeVideo(i); }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="afq-autoplay-row">
            <span className="afq-toggle-label">AUTOPLAY NEXT</span>
            <div className={`afq-toggle${autoplay ? " on" : ""}`} onClick={() => setAutoplay(a => !a)}>
              <div className="afq-toggle-knob" />
            </div>
          </div>
        </div>
      </div>

      <div className={`afq-toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
    </div>
  );
}