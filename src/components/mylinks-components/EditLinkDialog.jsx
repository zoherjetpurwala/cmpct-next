import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Textarea } from "@/components/ui/textarea";
  import { Switch } from "@/components/ui/switch";
  import { toast } from "sonner";
  
  export const EditLinkDialog = ({ editingLink, setEditingLink }) => (
    <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update your link details and settings
          </DialogDescription>
        </DialogHeader>
        {editingLink && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                defaultValue={editingLink.title || ""}
                placeholder="Enter a title for your link"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                defaultValue={editingLink.description || ""}
                placeholder="Add a description (optional)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                defaultValue={editingLink.tags?.join(", ") || ""}
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                defaultChecked={editingLink.isActive !== false}
              />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="password"
                defaultChecked={!!editingLink.password}
              />
              <Label htmlFor="password">Password Protected</Label>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingLink(null)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              toast.success("Link updated successfully!");
              setEditingLink(null);
            }}
            className="bg-themeColor hover:bg-themeColor-dark"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );