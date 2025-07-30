import React from 'react';

const CompletionBadge = () => {
  return (
    <div
      className="completion-celebration"
      style={{
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1,
        transition: 'all 0.3s ease'
      }}
    >
      <div
        className="celebration-content"
        style={{
          animation: 'celebration 2s infinite ease-in-out'
        }}
      >
        <span style={{ fontSize: '32px' }}>✨</span>
        <span>Great Progress!</span>
      </div>
    </div>
  );
};

export default CompletionBadge;