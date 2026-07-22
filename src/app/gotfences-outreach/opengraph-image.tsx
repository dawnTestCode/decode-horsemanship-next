import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GotFences Outreach';
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
          alignItems: 'center',
          backgroundColor: '#1A1A1A',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative fence posts */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 80,
            display: 'flex',
            gap: 40,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 60,
                backgroundColor: '#9E1B32',
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        {/* Decorative fence posts right */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 80,
            display: 'flex',
            gap: 40,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 60,
                backgroundColor: '#9E1B32',
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        {/* Horizontal fence rail */}
        <div
          style={{
            position: 'absolute',
            top: 85,
            left: 80,
            width: 136,
            height: 6,
            backgroundColor: '#9E1B32',
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 85,
            right: 80,
            width: 136,
            height: 6,
            backgroundColor: '#9E1B32',
            borderRadius: 3,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: '0.2em',
              color: '#9E1B32',
              marginBottom: 24,
              fontWeight: 500,
            }}
          >
            DECODE HORSEMANSHIP
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#F5F3F0',
              marginBottom: 24,
              lineHeight: 1.1,
            }}
          >
            GotFences Outreach
          </div>

          <div
            style={{
              width: 120,
              height: 4,
              backgroundColor: '#9E1B32',
              marginBottom: 32,
            }}
          />

          <div
            style={{
              fontSize: 28,
              color: '#B0ABA3',
              maxWidth: 700,
            }}
          >
            Track fencing job contacts and referral partners
          </div>
        </div>

        {/* Bottom location */}
        <div
          style={{
            position: 'absolute',
            bottom: 50,
            fontSize: 18,
            letterSpacing: '0.15em',
            color: '#6B6B6B',
          }}
        >
          CHAPEL HILL, NORTH CAROLINA
        </div>
      </div>
    ),
    { ...size }
  );
}
