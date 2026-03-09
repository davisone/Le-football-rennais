import type { Metadata } from "next";
import { getAllTopics } from "@/lib/queries/forum";
import { ModerationPanel } from "@/components/admin/moderation-panel";

export const metadata: Metadata = {
  title: "Modération du forum | Admin — Le Football Rennais",
};

const AdminForumPage = async () => {
  const topics = await getAllTopics();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Modération du forum</h1>
        <p className="mt-1 text-sm text-gray-400">
          {topics.length} sujet{topics.length !== 1 ? "s" : ""} au total
        </p>
      </div>

      <ModerationPanel topics={topics} />
    </div>
  );
};

export default AdminForumPage;
