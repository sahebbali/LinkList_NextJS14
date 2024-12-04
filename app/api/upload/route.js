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
    console.log({ file });

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
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: newFilename, resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        // Write the buffer to the upload stream
        uploadStream.write(fileBuffer);
        uploadStream.end();
      });

      // Return the file URL
      return Response.json({ secure_url: result.secure_url });
    } catch (error) {
      console.log({ error });
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return Response.json({ error: "No file provided" }, { status: 400 });
}

