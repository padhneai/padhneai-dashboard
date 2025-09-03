
import { getCurrentsUser } from '@/Firebase/firebaseaction/auth.action';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!, 
        api_key: process.env.CLOUDINARY_API_KEY!, 
        api_secret: process.env.CLOUDINARY_API_SECRET! // Click 'View API Keys' above to copy your API secret
    });
    


    interface CloudinaryUplaodResutl {
        public_id:string;
        [key : string] :any;
    }


    export async function POST(req:NextRequest) {
    const user = await getCurrentsUser();
    console.log(user)
    if(!user){
        return NextResponse.json({error:"Unauthorized"},{status:401});
    }
        
        try {
            const formdata = await req.formData();
            const file = formdata.get("file") as File | null;
            // console.log(file)
            if(!file){
                return NextResponse.json({error:"File not found"},{status:400})
            }

            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes);

         const result =    await new Promise<CloudinaryUplaodResutl>(
                (resolve,reject)=>{
                const uploadStream =     cloudinary.uploader.upload_stream(
                        {folder:"paperimages"},
                        (error, result)=>{
                            if(error) reject(error);
                            else resolve(result as CloudinaryUplaodResutl)
                        }
                    )
                    uploadStream.end(buffer)
                }
            )
// console.log(result)
            return NextResponse.json({publicId : result.public_id},{status:200})
        } catch (error) {
            // console.log("upload image filaied ", error)
            return NextResponse.json({error:"upload image failed"},{status:500})
        }
    }






export async function PUT(req: NextRequest) {
  const user = await getCurrentsUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formdata = await req.formData();
    const file = formdata.get("file") as File | null;
    const oldPublicId = formdata.get("oldPublicId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // 🔹 Delete old image if provided
    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    // 🔹 Upload new image
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUplaodResutl>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "paperimages" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUplaodResutl);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Update image failed" }, { status: 500 });
  }
}




export async function DELETE(req: NextRequest) {
  const user = await getCurrentsUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: "publicId is required" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: publicId }, { status: 200 });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Delete image failed" }, { status: 500 });
  }
}

   