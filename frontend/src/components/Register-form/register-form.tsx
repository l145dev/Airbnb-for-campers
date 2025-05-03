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
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // react router navigation
  const navigate = useNavigate();

  // input variables
  const [fn, setFn] = useState<string>("");
  const [ln, setLn] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [repeatPwd, setRepeatPwd] = useState<string>("");

  // error states
  const [isPwdError, setIsPwdError] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isAllError, setAllError] = useState<boolean>(false);

  const tryRegister = async () => {
    try {
      // check if passwords match
      if (pwd !== repeatPwd) {
        setIsPwdError(true);
        return;
      }

      // create the user
      axios.post('http://localhost:3000/register', {
        fn: fn,
        ln: ln,
        email: email,
        pwd: pwd
      })
        .then(response => {
          // successfully created user
          // navigate back to previous page
          if (response.status === 200) {
            navigate(-1);
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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); tryRegister(); }}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    className={`${isAllError ? "border-red-500" : ""}`}
                    id="first-name"
                    placeholder="Lee"
                    required
                    value={fn}
                    onChange={(e) => setFn(e.target.value)}
                    onClick={() => resetErrors()} />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    className={`${isAllError ? "border-red-500" : ""}`}
                    id="last-name"
                    placeholder="Robinson"
                    required
                    value={ln}
                    onChange={(e) => setLn(e.target.value)}
                    onClick={() => resetErrors()} />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  className={`${isEmailError || isAllError ? "border-red-500" : ""}`}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onClick={() => resetErrors()}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
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

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  className={`${isPwdError || isAllError ? "border-red-500" : ""}`}
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPwd}
                  onChange={(e) => setRepeatPwd(e.target.value)}
                  onClick={() => resetErrors()} />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                  Register
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account? {" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
