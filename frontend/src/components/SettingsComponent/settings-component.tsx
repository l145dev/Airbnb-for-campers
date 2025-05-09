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

interface SettingsComponentProps {
  className?: string;
  onLogoutSuccess: () => void; // callback to Settings.tsx
}

export function SettingsComponent({
  className,
  onLogoutSuccess,
  ...props
}: SettingsComponentProps) {

  // input variables
  const [fn, setFn] = useState<string>("");
  const [ln, setLn] = useState<string>("");
  // email is immutable
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>("");

  const saveChanges = () => {
    // patch /settings/update -> fn, ln, phone, pfp
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); saveChanges(); }}>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    // className={`${isAllError ? "border-red-500" : ""}`}
                    id="first-name"
                    placeholder="Lee"
                    required
                    value={fn}
                    onChange={(e) => setFn(e.target.value)}
                  // onClick={() => resetErrors()} 
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    // className={`${isAllError ? "border-red-500" : ""}`}
                    id="last-name"
                    placeholder="Robinson"
                    required
                    value={ln}
                    onChange={(e) => setLn(e.target.value)}
                  // onClick={() => resetErrors()} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    // className={`${isEmailError || isAllError ? "border-red-500" : ""}`}
                    id="email"
                    disabled
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  // onClick={() => resetErrors()}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    // className={`${isAllError ? "border-red-500" : ""}`}
                    id="phone"
                    placeholder="+32 611 73 14 40"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  // onClick={() => resetErrors()} 
                  />
                </div>
              </div>

              <div className="grid w-full w-full items-center gap-3">
                <Label>Password</Label>
                <Button variant={"outline"}>
                  Change password
                </Button>
              </div>

              <div className="grid w-full w-full items-center gap-3">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" />
              </div>

              <div className="mt-3 flex flex-col gap-3">
                <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                  Save changes
                </Button>

                <Button variant={"outline"}>
                  Become a host
                </Button>

                <div className="flex gap-3 w-full">
                  <Button variant={"destructive"} className="flex-1">
                    Log out
                  </Button>

                  <Button variant={"destructive"} className="flex-1 bg-transparant text-[var(--destructive)] border-[var(--destructive)] border-2 hover:text-white">
                    Delete account
                  </Button>
                </div>
              </div>

              {/* <div className="grid w-full gap-3">
              <div className="space-y-3 flex flex-col gap 3">
                <h2 className="mt-6 mb-6 text-xl font-semibold">Account</h2>
                
                </div>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
