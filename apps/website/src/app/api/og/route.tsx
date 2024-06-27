import { ImageResponse } from '@vercel/og';
import { Logo } from '@/components/icons/Logo';
import { capitalize } from '@/lib/utils';

const year = '2024';
const event2024 = {
  year,
  name: `8HourRealy`,
  description: `8 Hour Realy Race - 2024`,
  location: 'Athletic field in Surrey, British Columbia',
  time: 'Sep 7, 2024',
  isActive: true,
  createdAt: new Date().getTime(),
  registerDeadline: 'August 31, 2024',
};

export const runtime = 'edge';

const interRegular = fetch(
  new URL('../../../assets/fonts/Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL('../../../assets/fonts/CalSans-SemiBold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
  try {
    const fontRegular = await interRegular;
    const fontBold = await interBold;

    let mode = 'dark',
      heading = event2024.description,
      location = event2024.location,
      slogan = 'Run Together, Achieve Forever',
      time = event2024.time,
      type = 'Come Join Us!';

    const url = new URL(req.url);
    const values = Object.fromEntries(url.searchParams);
    console.log(`values are ${JSON.stringify(values)}`);
    if (values.mode) mode = values.mode;
    if (values.heading)
      heading =
        values.heading.length > 140
          ? `${values.heading.substring(0, 140)}...`
          : values.heading;
    if (values.type) type = values.type;
    if (values.slogan) slogan = values.slogan;

    const paint = mode === 'dark' ? '#fff' : '#00356a';

    const fontSize = heading.length > 100 ? '70px' : '100px';

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: paint,
            background:
              mode === 'dark'
                ? 'linear-gradient(60deg, #00356a 0%, #111356 100%)'
                : 'white',
          }}
        >
          <div tw="flex w-full flex-row-reverse">
            <Logo fill="white" />
          </div>
          <div tw="flex flex-col flex-1 py-10">
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: 'Inter', fontWeight: 'normal' }}
            >
              {slogan ? slogan : type}
            </div>
            <div
              tw="flex leading-[1.1] text-[80px] font-bold"
              style={{
                fontFamily: 'Cal Sans',
                fontWeight: 'bold',
                marginLeft: '-3px',
                fontSize,
              }}
            >
              {capitalize(heading)}
            </div>
          </div>
          <div></div>
          <div tw="flex items-center w-full justify-between">
            <div
              tw="flex text-xl"
              style={{ fontFamily: 'Inter', fontWeight: 'normal' }}
            >
              {location}
            </div>
            <div
              tw="flex items-center text-xl"
              style={{ fontFamily: 'Inter', fontWeight: 'normal' }}
            >
              <div tw="flex ml-2">{time}</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Cal Sans',
            data: fontBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
