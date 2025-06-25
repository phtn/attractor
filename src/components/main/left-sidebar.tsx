import { Repositories } from "../repositories";
import { Sidebar, SidebarContent } from "../ui/sidebar";

export const LeftSidebar = () => {
  return (
    <Sidebar
      variant="inset"
      side="left"
      className="dark:bg-card-origin/38 bg-card text-card-foreground border-none flex flex-col p-0 rounded-xl shadow-sm dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] h-[calc(94vh)] mt-[4.25rem] mx-1 mb-1"
    >
      <SidebarContent className="dark:bg-card/40 border-none rounded-[3.5px]">
        <Repositories />
      </SidebarContent>
    </Sidebar>
  );
};
