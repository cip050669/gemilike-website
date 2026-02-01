export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image');

  if (!image || typeof image === 'string') {
    return new Response(JSON.stringify({ error: 'Missing image file' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const upstreamUrl = process.env.SEGMENTATION_API_URL;
  if (!upstreamUrl) {
    return new Response(JSON.stringify({ error: 'Segmentation API not configured' }), {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const upstreamForm = new FormData();
  for (const [key, value] of formData.entries()) {
    upstreamForm.append(key, value);
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    method: 'POST',
    body: upstreamForm,
  });

  const contentType = upstreamResponse.headers.get('content-type') || 'application/json';
  const body = await upstreamResponse.text();

  return new Response(body, {
    status: upstreamResponse.status,
    headers: { 'Content-Type': contentType },
  });
}
