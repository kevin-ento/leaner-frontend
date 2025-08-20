import { useState, useEffect, useRef, memo } from "react";

const VideoPlayer = memo(({ session }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const prevSessionId = useRef(null);
  const loadingTimeoutRef = useRef(null);

  useEffect(() => {
    if (session && session.videoUrl) {
      const currentSessionId = session._id || session.id;
      
      // Only reset loading state if it's a different session
      if (prevSessionId.current !== currentSessionId) {
        // Clear any existing timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        
        setIsLoading(true);
        setHasError(false);
        prevSessionId.current = currentSessionId;
      }
    }
  }, [session]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const extractYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (!session || !session.videoUrl) {
    return (
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          No video available for this session
        </p>
      </div>
    );
  }

  const videoId = extractYouTubeVideoId(session.videoUrl);
  if (!videoId) {
    return (
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm sm:text-base">
            Invalid YouTube URL
          </p>
          <a
            href={session.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
          >
            Open Video Link
          </a>
        </div>
      </div>
    );
  }

  const handleIframeLoad = () => {
    // Add a small delay to ensure smooth transition and prevent flickering
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 150);
  };

  return (
    <div className="aspect-video relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={session.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
        onLoad={handleIframeLoad}
        onError={() => {
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
          setIsLoading(false);
          setHasError(true);
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm sm:text-base">
              Failed to load video
            </p>
            <a
              href={session.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm sm:text-base"
            >
              Open Video Link
            </a>
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
