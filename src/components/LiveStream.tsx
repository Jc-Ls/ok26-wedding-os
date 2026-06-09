'use client';

import React from 'react';
import styles from './LiveStream.module.css';

interface LiveStreamProps {
  videoId: string;
  title?: string;
}

/**
 * LiveStream Component
 * Embeds a YouTube live video with custom UI masking to create a branded experience.
 * Responsive 16:9 aspect ratio with modular design.
 *
 * @param videoId - YouTube video ID (e.g., "dQw4w9WgXcQ")
 * @param title - Optional title for accessibility (default: "Live Stream")
 */
export default function LiveStream({ videoId, title = 'Live Stream' }: LiveStreamProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* CSS masking overlays to hide standard YouTube UI elements */}
        <div className={styles.topMask} aria-hidden="true" />
        <div className={styles.bottomMask} aria-hidden="true" />
        <div className={styles.logoMask} aria-hidden="true" />
      </div>
    </div>
  );
}
