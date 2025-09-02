import SignupForm from "@/components/auth/SignupForm";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <SignupForm />
      </div>
    </div>
  );
};

export default Page;
