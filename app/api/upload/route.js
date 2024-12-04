import { v2 as cloudinary } from 'cloudinary';
import uniqid from 'uniqid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const formData = await req.formData();

  if (formData.has('file')) {
    const file = formData.get('file');

    // Generate a unique filename
    const randomId = uniqid();
    const ext = file.name.split('.').pop();
    const newFilename = `${randomId}.${ext}`;

    // Collect file data into a buffer
    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { public_id: newFilename, resource_type: 'auto' },
        (error, result) => {
          if (error) throw error;
          return result;
        }
      );

      // Write the buffer to the upload stream
      result.write(fileBuffer);
      result.end();

      // Return the file URL
      return Response.json(result.secure_url);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ error: "No file provided" }, { status: 400 });
}
