import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import axios from "axios";
import { Toaster, toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export function SupportComponent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // input variables
  const [supportMessage, setSupportMessage] = useState<string>("");

  // post support ticket
  const sendSupport = async () => {
    try {
      // process support message first (add ' \ ' before ' " ')
      const supportData = {
        message: supportMessage,
      };

      // send 
      const response = await axios.post(
        'http://localhost:3000/support',
        supportData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        // trigger toast
        toast(`Support ticket created [ID: ${response.data.support_request_id}]`, {
          description: new Date().toLocaleString()
        })
      }

      else if (response.status === 429) {
        toast(`Max 1 support ticket every 5 minutes!`, {
          description: new Date().toLocaleString()
        })
      }

      else {
        toast(`Failed to create support ticket`, {
          description: new Date().toLocaleString()
        })
        console.error('Support failed');
      }
    }
    catch (error: any) {
      if (error.response && error.response.status === 429) {
        toast(`Max 1 support ticket every 5 minutes!`, {
          description: new Date().toLocaleString(),
        });
      } else {
        toast(`Failed to create support ticket: ${error.message}`, {
          description: new Date().toLocaleString(),
        });
      }
      console.error('Support error:', error);
    }
  };

  return (
    <>
      {/* allow toasts to appear on page, with closing btn */}
      <Toaster closeButton />
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent>
            {/* save the changes that user may have made on submit */}
            {/* inputs have disabled state when loading */}
            <form onSubmit={(e) => { e.preventDefault(); sendSupport(); }}>
              <div className="flex flex-col gap-6 max-w-[600px] min-w-[600px]">
                <Textarea
                  className="h-[400px]"
                  placeholder="Have a problem? Have feedback? Or simply bored? Tell us anything! ...but maybe not if you're just bored"
                  value={supportMessage}
                  required
                  onChange={(e) => setSupportMessage(e.target.value)} />

                {/* triggers saveChanges() to update user details */}
                <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                  Send message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div >
    </>
  )
}
