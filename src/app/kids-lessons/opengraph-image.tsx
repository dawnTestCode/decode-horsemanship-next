import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kids & Family Lessons - Decode Horsemanship';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#0c0a09',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Crimson accent line - left */}
        <div
          style={{
            position: 'absolute',
            top: 120,
            left: 80,
            width: 60,
            height: 4,
            backgroundColor: '#dc143c',
          }}
        />

        {/* Crimson vertical line - right */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            right: 100,
            width: 4,
            height: 200,
            backgroundColor: '#dc143c',
          }}
        />

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 400,
              color: '#f5f0eb',
              lineHeight: 1.15,
              marginBottom: 0,
            }}
          >
            Some kids learn to ride.
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#dc143c',
              lineHeight: 1.15,
            }}
          >
            Ours learn to lead.
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#b8a8a0',
            marginTop: 32,
            letterSpacing: '0.02em',
          }}
        >
          Kids & Family Lessons · Ages 5–15
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 80,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: '0.15em',
              color: '#f5f0eb',
            }}
          >
            DECODE HORSEMANSHIP
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#6b6b6b',
              letterSpacing: '0.05em',
            }}
          >
            Chapel Hill, NC · decodehorsemanship.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
