// credits: shadcn
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

interface LoginFormProps {
  className?: string;
  onLoginSuccess: () => void;
}

export function LoginForm({
  className,
  onLoginSuccess,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");

  // error states
  const [isPwdError, setIsPwdError] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isAllError, setAllError] = useState<boolean>(false);

  const tryLogin = async () => {
    try {
      // login the user
      axios.post(
        'http://localhost:3000/login',
        {
          email: email,
          pwd: pwd
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true // Ensure credentials (like cookies) are sent
        }
      )
        .then(response => {
          // successfully logged user in
          if (response.status === 200) {
            // console.log(response.data)
            onLoginSuccess(); // pass on login success
          }
        })
        .catch(error => {
          console.error(error.response.data.error);

          // set errors
          switch (error.response.data.errorType) {
            case "Email":
              setIsEmailError(true);
              break;
            case "Password":
              setIsPwdError(true);
              break;
            default:
              setAllError(true);
          }
        });
    }

    catch (error) {
      console.log(error);
    }
  }

  const resetErrors = () => {
    // reset relevant
    if (isAllError) {
      setAllError(false);
    }

    else if (isPwdError) {
      setIsPwdError(false);
    }

    else if (isEmailError) {
      setIsEmailError(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); tryLogin(); }}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  className={`${isAllError || isEmailError ? "border-red-500" : ""}`}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onClick={() => resetErrors()} />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/reset-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  className={`${isPwdError || isAllError ? "border-red-500" : ""}`}
                  id="password"
                  type="password"
                  required
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onClick={() => resetErrors()} />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
