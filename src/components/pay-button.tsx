"use client";

import { Button } from "@/components/ui/button";
import { HandCoins } from "lucide-react";
import { Dialog, DialogTrigger } from "./ui/dialog";

import PayDialog from "./pay-dialog";

export default function PayButton({ id }: { id: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <HandCoins />
          <span>Pay</span>
        </Button>
      </DialogTrigger>
      <PayDialog id={id} />
    </Dialog>
  );
}
