'use server'

import { db , auth } from "@/Firebase/admin";
import { Timestamp } from "firebase-admin/firestore";





import { cookies } from "next/headers";




const ONE_WEEK = 60 * 60 * 24 * 7;



export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;
//   console.log(params)

  try {
    const userRecord = await db.collection('users').doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in instead.'
      };
    }

    // Check if this is the first user
    const usersSnapshot = await db.collection('users').get();
    let role = 'user';
    if (usersSnapshot.empty) {
      role = 'admin'; // first user becomes admin
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
      role, // <-- add role here
      createdAt: new Date()
    });

    return {
      success: true,
      message: 'Successfully created an account. Please sign in.'
    };
    
  } catch (error: any) {
    console.error('Error creating a user', error);

    if (error.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'This email is already in use.'
      };
    }

    return {
      success: false,
      message: 'Failed to create an account'
    };
  }
}


// export async function signIn (params:SignInParams){
//     const {email,idToken} = params;

//     try {
//         const userRecord = await auth.getUserByEmail(email)
//         if(!userRecord){
//             return{
//               success:false,
//               message:"user doesn't exit. Create an account instead."  
//             }
//         }

//         await setSessionCookie(idToken)
//     } catch (error) {
//         console.error(error)

//         return{
//             success:false,
//             message:'Failed to log into an account'
//         }
//     }
// }

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // 1️⃣ Get user from Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User doesn't exist. Create an account instead.",
      };
    }

    // 2️⃣ Get user document from Firestore
    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return {
        success: false,
        message: "User record not found. Contact administrator.",
      };
    }

    const userData = userDoc.data();

    // 3️⃣ Set session cookie
    await setSessionCookie(idToken);

    // 4️⃣ Determine redirect based on role
    if (userData?.role === "admin") {
      return {
        success: true,
        message: "Logged in successfully ✅",
        redirectTo: "/", // admin dashboard
      };
    }else if(userData?.tokenVerified){
       return {
        success: true,
        message: "Logged in successfully ✅",
        redirectTo: "/", // admin dashboard
      };
    } else {
      // non-admin users need to verify token
      return {
        success: true,
        message: "Token verification required.",
        redirectTo: "/token", // token verification page
        uid: userRecord.uid, // pass UID so token page can mark verification
      };
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      success: false,
      message: "Failed to log into the account",
    };
  }
}



export async function setSessionCookie(idToken:string){
    
    const cookieStore = await cookies();
    const sessionCookie  = await auth.createSessionCookie(idToken , {
        expiresIn: ONE_WEEK * 100 ,
    })

    cookieStore.set('session', sessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite:'lax'
    })
}


export async function getCurrentsUser() : Promise<UserInfo | null >{
const cookieStore = await cookies();

const sessionCookie = cookieStore.get('session')?.value;

if(!sessionCookie) return null;

try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);

    const userRecord = await db.collection
    ('users')
    .doc(decodedClaims.uid)
    .get();

    if(!userRecord) return null;

    const userdata:any = userRecord.data();

    return {
        ...userdata,
          createdAt:
                userdata.createdAt instanceof Timestamp ?
                 userdata.createdAt.toDate() 
                 : new Date(userdata.createdAt),
        id : userRecord.id,

    } as UserInfo;
} catch (error) {
    // console.error(error);
    return null;
    
}
}


export async function isAuthenticated(): Promise<boolean | null> {
  const user = await getCurrentsUser();
  if (!user) return false;

  // ✅ Admins are always authenticated
  if (user.role === "admin") {
    return true;
  }

  // ✅ For non-admins, check token verification
  const isVerified = user.tokenVerified;
  return isVerified || null;
}


export async function logout() {
  try {
    const cookieStore = await cookies();

    // Clear the session cookie
    cookieStore.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Logged out successfully ✅',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'Failed to log out',
    };
  }
}


export async function getEmailByUid(uid: string): Promise<string | null> {
  if (!uid) return null;

  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return null;

    const userData = userDoc.data();
    // console.log("check",userData)
    return userData?.email || null;
  } catch (error) {
    
    console.error("Error fetching email by UID:", error);
    return null;
  }
}

