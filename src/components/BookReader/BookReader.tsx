import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './BookReader.css';

interface BookReaderProps {
  book: {
    id: string;
    title: string;
    authorName: string;
    category: string;
    imageUrl: string;
    audioUrl?: string;
  };
  content: string;
  onClose: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({
  book,
  content,
  onClose
}) => {
  const { user } = useAuth();
  const isSubscribed = user?.isSubscribed || false;

  useEffect(() => {
    console.log('BookReader Debug Info:', {
      isSubscribed,
      hasAudioUrl: !!book.audioUrl,
      audioUrl: book.audioUrl,
      userSubscriptionStatus: user?.isSubscribed
    });
  }, [isSubscribed, book.audioUrl, user]);

  return (
    <div className="book-reader">
      <div className="book-reader-header">
        <button className="reader-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="reader-title">
          <h1>{book.title}</h1>
          <p className="reader-author">{book.authorName}</p>
        </div>
      </div>

      {isSubscribed && book.audioUrl && (
        <div className="reader-audio">
          <audio controls className="audio-player">
            <source src={book.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="reader-content">
        {content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default BookReader; 