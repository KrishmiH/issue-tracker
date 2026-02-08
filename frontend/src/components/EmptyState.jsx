import Button from "./Button";
import Card from "./Card";
import { Plus, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  title = "No issues found",
  message = "Try changing your filters or create a new issue.",
  ctaText = "Create Issue",
  ctaLink = "/new",
}) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-100">
          <SearchX className="h-6 w-6 text-purple-700" />
        </div>

        <p className="mt-3 text-lg font-semibold text-slate-900">{title}</p>
        <p className="mt-1 max-w-md text-sm text-slate-800">{message}</p>

        <Link to={ctaLink} className="mt-5">
          <Button>
            <Plus className="h-4 w-4" /> {ctaText}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
