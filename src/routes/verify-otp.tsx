import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AuthShell } from "./login";

export const Route = createFileRoute("/verify-otp")({
  component: OTP,
});
function OTP() {
  const [value, setValue] = useState("");
  const nav = useNavigate();
  return (
    <AuthShell>
      <h1 className="text-2xl font-bold tracking-tight">Verify your phone</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the 6-digit code we sent to your number.
      </p>
      <div className="mt-8 flex justify-center">
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        size="lg"
        className="mt-6 w-full"
        disabled={value.length < 6}
        onClick={() => {
          toast.success("Verified! Welcome to DriveHub.");
          nav({ to: "/dashboard" });
        }}
      >
        Verify
      </Button>
      <button className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">
        Resend code
      </button>
    </AuthShell>
  );
}
