"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { email, z } from "zod"
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
import { signIn } from "@/Firebase/firebaseaction/auth.action"
import { useRouter } from "next/navigation"
import {  signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/Firebase/client"

// ✅ Zod schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password required" }),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const  router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

 const onSubmit = async (values: LoginValues) => {
  const { email, password } = values;

  try {
    setLoading(true);

    // 🔥 Login with Firebase Auth
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredentials.user.getIdToken();

    if (!idToken) {
      toast.error("Sign in failed");
      return;
    }

    // Call server-side signIn
    const res = await signIn({ email, idToken });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);

    // Redirect based on role / token requirement
    if (res.redirectTo === "/token" && res.uid) {
      router.push(`/verify-token?user=${res.uid}`);
    } else {
      router.push(res.redirectTo || "/"); // admin goes to dashboard
    }

  } catch (err) {
    console.error(err);
    toast.error("Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
<div className="w-full max-w-md mx-auto p-8 bg-zinc-900 text-white shadow-lg rounded-2xl border border-zinc-800">
  <h2 className="text-2xl font-bold mb-6 text-center">PadhneAi Dashboard Login</h2>
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

      {/* Forgot Password Link */}
      <div className="text-right">
        <a href="/forgot-password" className="text-sm text-green-400 hover:underline">
          Forgot Password?
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-transform hover:scale-[1.02]"
      >
        {loading ? "Logging in..." : "Login"}
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-400 mt-2">
        Don’t have an account?{" "}
        <a href="/sign-up" className="text-green-400 hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  </Form>
</div>

  )
}
