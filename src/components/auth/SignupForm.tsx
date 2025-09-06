"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signIn, signUp } from "@/Firebase/firebaseaction/auth.action"
import { useRouter } from "next/navigation"
import { auth } from "@/Firebase/client"
import { createUserWithEmailAndPassword } from "firebase/auth"

// ✅ Zod schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }).max(50),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type SignupValues = z.infer<typeof signupSchema>

export default function SignupForm() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

 const onSubmit = async (values: SignupValues) => {
  const { email, password, name } = values;
  try {
    setLoading(true);

    // 1️⃣ Create Firebase Auth user
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // 2️⃣ Create Firestore user
    const result = await signUp({
      uid: userCred.user.uid,
      name: name!,
      email,
      password,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    // 3️⃣ Get ID token from the same user (no need to sign in again)
    const idToken = await userCred.user.getIdToken();

    // 4️⃣ Call server-side signIn to set session cookie
    const res = await signIn({ email, idToken });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);

    // 5️⃣ Redirect based on role / token requirement
    if (res.redirectTo === "/token" && res.uid) {
      router.push(`/verify-token?user=${res.uid}`);
    } else {
      router.push(res.redirectTo || "/");
    }

    form.reset();
  } catch (err) {
    console.error(err);
    toast.error("Signup failed");
  } finally {
    setLoading(false);
  }
};


  return (
 <div className="w-full max-w-md mx-auto p-8 bg-zinc-900 text-white shadow-lg rounded-2xl border border-zinc-800">
  <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} className="bg-zinc-800 border-zinc-700" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="example@mail.com" {...field} className="bg-zinc-800 border-zinc-700" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••" {...field} className="bg-zinc-800 border-zinc-700" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-transform hover:scale-[1.02]"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-400 mt-2">
        Already have an account?{" "}
        <a href="/login" className="text-green-400 hover:underline">
          Login
        </a>
      </p>
    </form>
  </Form>
</div>




  )
}
