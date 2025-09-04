import { SidebarProvider } from "@/components/ui/sidebar";
import { Content } from "./content";
import { ResizeCtxProvider } from "@/ctx/resize-ctx";

export default async function Page() {
  return (
    <SidebarProvider>
      <ResizeCtxProvider>
        <Content />
      </ResizeCtxProvider>
    </SidebarProvider>
  );
}
