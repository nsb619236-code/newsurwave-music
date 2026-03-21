function SongCard({ title, description, image, onClick, onPlay }) {
    return (
        <div 
            className="card-surface group relative flex flex-col gap-3 p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300"
            onClick={onClick}
            data-name="song-card" data-file="components/SongCard.js"
        >
            <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-lg mb-1">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                {/* Play Button Overlay */}
                <div 
                    className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPlay();
                    }}
                >
                    <button className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[var(--primary-hover)] text-black">
                         <div className="icon-play text-2xl ml-1 fill-black"></div>
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-white font-bold truncate">{title}</h3>
                <p className="text-[var(--text-subdued)] text-sm line-clamp-2 leading-tight">{description}</p>
            </div>
        </div>
    );
}