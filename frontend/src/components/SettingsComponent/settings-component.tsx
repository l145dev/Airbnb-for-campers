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
import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { Query, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SettingsComponentProps {
  className?: string;
  onLogoutSuccess: () => void; // callback to Settings.tsx
}

interface UserSettings {
  fn: string;
  ln: string;
  email: string;
  phone: string | null;
  pfp: string | null;
  is_owner: boolean;
  registration_date: string;
}

const fetchSettings = async () => {
  const response = await axios.get('http://localhost:3000/settings', {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });
  return response.data;
};

export function SettingsComponent({
  className,
  onLogoutSuccess,
  ...props
}: SettingsComponentProps) {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // input variables
  const [fn, setFn] = useState<string>("");
  const [ln, setLn] = useState<string>("");
  // email is immutable
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>("");


  const { data, isLoading, error } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    enabled: true
  });

  useEffect(() => {
    if (data) {
      setFn(data.fn);
      setLn(data.ln);
      setEmail(data.email);
      setPhone(data.phone || '');
      setProfilePicture(data.pfp || '');
      setIsOwner(data.is_owner);
    }
  }, [data]);

  const saveChanges = async () => {
    try {
      const response = await axios.patch(
        'http://localhost:3000/settings/update',
        {
          first_name: fn === '' ? null : fn,
          last_name: ln === '' ? null : ln,
          phone_number: phone === '' ? null : phone,
          profile_picture: profilePicture === '' ? null : profilePicture
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Update the cache with new data
        // queryClient.setQueryData(['settings'], response.data);
        // Invalidate the query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ['settings'] });
        toast("Settings updated", {
          description: new Date().toLocaleString()
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        onLogoutSuccess();
        navigate("/home");
      }
      else {
        console.error('Logout failed');
      }
    }
    catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        'http://localhost:3000/settings/delete',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        onLogoutSuccess();
        navigate("/home");
      }
      else {
        console.error('Deletion failed');
      }
    }
    catch (error) {
      console.error('Delete error:', error);
    }
  }

  return (
    <>
      <Toaster closeButton />
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                    // onClick={() => resetErrors()} 
                    />
                  </div>
                </div>

                <div className="grid w-full w-full items-center gap-3">
                  <Label>Password</Label>
                  <Button type="button" variant={"outline"} asChild>
                    <Link to={"/reset-password"}>
                      Change password
                    </Link>
                  </Button>
                </div>

                <div className="grid w-full w-full items-center gap-3">
                  <Label htmlFor="picture">Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        console.log(imageUrl)
                        setProfilePicture(imageUrl);
                      }
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-3">
                  <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                    Save changes
                  </Button>

                  {!isOwner && !isLoading && (
                    <>
                      <Button type="button" variant={"outline"} asChild>
                        <Link to={"/host"}>
                          Become a host
                        </Link>
                      </Button>
                    </>
                  )}


                  <div className="flex gap-3 w-full">
                    <Button type="button" variant={"destructive"} className="flex-1" onClick={handleLogout}>
                      Log out
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant={"destructive"} className="flex-1 bg-transparant text-[var(--destructive)] border-[var(--destructive)] border-2 hover:text-white">
                          Delete account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div >
    </>
  )
}
