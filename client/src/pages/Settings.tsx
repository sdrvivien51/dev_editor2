import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const form = useForm();

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
    },
  });

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <form onSubmit={form.handleSubmit(data => updateMutation.mutate(data))} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input {...form.register("name")} />
        </div>
        <div>
          <label className="text-sm font-medium">Bio</label>
          <Textarea {...form.register("bio")} />
        </div>
        <div>
          <label className="text-sm font-medium">Avatar URL</label>
          <Input {...form.register("avatar_url")} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
