// app/api/upload-image/route.js
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Directory to store uploaded images
const uploadDir = join(process.cwd(), 'public/uploads/cars');

// Ensure the upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(uploadDir, { recursive: true });
    console.log('Upload directory ensured:', uploadDir);
  } catch (error) {
    console.error('Error creating upload directory:', error);
    throw new Error('Failed to create upload directory');
  }
}

export async function POST(req) {
  console.log('Received POST request to /api/upload-image');

  try {
    // Parse the form-data to get the file
    console.log('Parsing form-data...');
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      console.log('No file uploaded');
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('File received:', file.name);

    // Convert the file to a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure the upload directory exists
    await ensureUploadDir();

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueName = `${Date.now()}_${uuidv4()}.${fileExtension}`;
    const fileName = `uploads/cars/${uniqueName}`; // Fixed path to match uploadDir
    const filePath = join(process.cwd(), 'public', fileName);

    // Save the file to the filesystem
    console.log('Saving file to:', filePath);
    await writeFile(filePath, buffer);
    console.log('File saved successfully:', fileName);

    // Generate the public URL
    const imageUrl = `/${fileName}`;
    console.log('Public URL:', imageUrl);

    return new Response(JSON.stringify({ imageUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/upload-image:', error);
    return new Response(JSON.stringify({ error: `Failed to upload image: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}