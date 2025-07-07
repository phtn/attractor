import { Repositories } from "../repositories";
import { Sidebar, SidebarContent } from "../ui/sidebar";

export const LeftSidebar = () => {
  return (
    <Sidebar
      side="left"
      variant="inset"
      className="text-card-foreground dark:bg-transparent bg-transparent flex-[4] border-none flex flex-col p-0 rounded-xl shadow-sm dark:inset-shadow-[0_1px_rgb(255_255_255/0.15)] h-[calc(94vh)] mt-[4.25rem] mx-1 mb-1"
    >
      <SidebarContent className="border-none dark:bg-transparent bg-transparent rounded-[3.5px]">
        <Repositories />
      </SidebarContent>
    </Sidebar>
  );
};
