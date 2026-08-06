import Link from "next/link";
import type { Activity } from "@/types";
import { formatDate } from "@/lib/utils";

type RegistrationPanelProps = {
  activities: Activity[];
};

export function RegistrationPanel({ activities }: RegistrationPanelProps) {
  if (activities.length === 0) {
    return (
      <section className="rounded-lg border-2 border-dashed border-muted bg-light-gray p-8 text-center">
        <p className="font-bold">目前沒有開放報名的活動。</p>
        <p className="mt-2 text-sm text-muted">
          下一波活動資訊將在這裡公布。
        </p>
        <Link href="/schedule" className="btn-outline mt-4 text-sm">
          查看近期活動
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-bold text-success">
              報名中
            </p>
            <h3 className="text-xl font-black">{activity.title}</h3>
            {activity.registrationEndAt && (
              <p className="mt-1 text-sm">
                報名截止：{formatDate(activity.registrationEndAt, true)}
              </p>
            )}
            {activity.participantLimit && (
              <p className="text-sm text-muted">
                名額上限：{activity.participantLimit} 人
              </p>
            )}
          </div>
          {activity.registrationUrl && (
            <a
              href={activity.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary shrink-0"
            >
              立即報名
            </a>
          )}
        </div>
      ))}
    </section>
  );
}
