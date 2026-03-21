function Player({ currentSong, isPlaying, onTogglePlay }) {
    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full h-[90px] bg-black border-t border-[#282828] px-4 flex items-center justify-between z-50" data-name="player" data-file="components/Player.js">
            
            {/* Left: Song Info */}
            <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-800 shadow-md group relative cursor-pointer">
                    <img src={currentSong.image || "https://via.placeholder.com/56"} alt="Album Art" className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 hidden group-hover:flex items-center justify-center text-white">
                         <div className="icon-chevron-up"></div>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <a href="#" className="font-sm text-white hover:underline truncate pr-2">{currentSong.title || "Song Title"}</a>
                    <a href="#" className="text-xs text-[var(--text-subdued)] hover:underline hover:text-white truncate pr-2">{currentSong.artist || "Artist Name"}</a>
                </div>
                <button className="text-[var(--text-subdued)] hover:text-white btn-icon hidden sm:block">
                    <div className="icon-heart"></div>
                </button>
            </div>

            {/* Center: Controls */}
            <div className="flex flex-col items-center max-w-[40%] w-full px-4">
                <div className="flex items-center gap-5 mb-1">
                    <button className="text-[var(--text-subdued)] hover:text-white btn-icon" title="Shuffle">
                        <div className="icon-shuffle text-lg"></div>
                    </button>
                    <button className="text-[var(--text-subdued)] hover:text-white btn-icon">
                        <div className="icon-skip-back fill-current text-xl"></div>
                    </button>
                    <button 
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black"
                        onClick={onTogglePlay}
                    >
                        {isPlaying ? (
                             <div className="icon-pause fill-black text-xl"></div>
                        ) : (
                             <div className="icon-play fill-black text-xl ml-0.5"></div>
                        )}
                    </button>
                    <button className="text-[var(--text-subdued)] hover:text-white btn-icon">
                        <div className="icon-skip-forward fill-current text-xl"></div>
                    </button>
                    <button className="text-[var(--text-subdued)] hover:text-white btn-icon" title="Repeat">
                        <div className="icon-repeat text-lg"></div>
                    </button>
                </div>
                
                <div className="w-full flex items-center gap-2 text-xs text-[var(--text-subdued)] font-medium font-mono">
                    <span>0:32</span>
                    <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative group cursor-pointer">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-white rounded-full group-hover:bg-[var(--primary)]"></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100"></div>
                    </div>
                    <span>{currentSong.duration || "3:45"}</span>
                </div>
            </div>

            {/* Right: Volume & Extras */}
            <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
                <button className="btn-icon">
                    <div className="icon-mic-2 text-lg"></div>
                </button>
                <button className="btn-icon">
                    <div className="icon-list-music text-lg"></div>
                </button>
                <button className="btn-icon">
                    <div className="icon-monitor-speaker text-lg"></div>
                </button>
                <div className="flex items-center gap-2 w-24 group">
                    <button className="btn-icon">
                        <div className="icon-volume-2 text-lg"></div>
                    </button>
                    <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative cursor-pointer">
                        <div className="absolute top-0 left-0 h-full w-2/3 bg-white rounded-full group-hover:bg-[var(--primary)]"></div>
                    </div>
                </div>
                 <button className="btn-icon">
                    <div className="icon-maximize-2 text-lg"></div>
                </button>
            </div>

        </div>
    );
}