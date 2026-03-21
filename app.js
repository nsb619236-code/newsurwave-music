// Important: DO NOT remove this `ErrorBoundary` component.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-500 rounded-full font-bold text-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [activeTab, setActiveTab] = React.useState('home');
    const [currentSong, setCurrentSong] = React.useState(mockSongs[0]); // Default song
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handlePlay = (item) => {
        // In a real app, this would play the specific item/playlist
        // For now, let's just pretend we picked a song from the mockSongs based on ID mod
        const songIndex = item.id % mockSongs.length;
        setCurrentSong({
            ...mockSongs[songIndex],
            image: item.image || mockSongs[songIndex].image // Prefer playlist image if available
        });
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
      <div className="flex h-screen w-full bg-black p-0 md:p-2 gap-2" data-name="app" data-file="app.js">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
             <MainContent onPlay={handlePlay} />
        </div>

        {/* Player Overlay */}
        <Player 
            currentSong={currentSong} 
            isPlaying={isPlaying} 
            onTogglePlay={togglePlay} 
        />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
