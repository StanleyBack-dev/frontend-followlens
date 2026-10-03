import type { Metadata } from "next";
import { History } from "lucide-react";
import {
  Card,
  EmptyState,
  PageHeader,
  Pagination,
  SegmentedNav,
} from "@/design-system";
import { FilterTransition } from "@/features/followers/components/FilterTransition";
import { FollowerEventList } from "@/features/followers/components/FollowerEventList";
import { FollowerFilterCombobox } from "@/features/followers/components/FollowerFilterCombobox";
import { InvalidFilterAlert } from "@/features/followers/components/InvalidFilterAlert";
import {
  EVENT_LABEL,
  EVENT_TYPES,
} from "@/features/followers/model/event-labels";
import { authed } from "@/server/services/authed";
import { withFilterValidation } from "@/server/services/filter-result";
import { followersService } from "@/server/services/followers.service";
import {
  buildHref,
  firstParam,
  oneOf,
  pageParam,
  type RawSearchParams,
} from "@/shared/lib/search-params";

export const metadata: Metadata = { title: "Unfollows" };

const PATH = "/unfollows";
const FILTERS = [
  { key: "lost", label: "Deixaram de seguir" },
  { key: "gained", label: "Novos" },
  { key: "returned", label: "Voltaram" },
  { key: "all", label: "Tudo" },
] as const;

export default async function UnfollowsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const rawType = firstParam(params, "type");
  const type =
    rawType === "all" ? undefined : (oneOf(rawType, EVENT_TYPES) ?? "lost");
  const filterKey = type ?? "all";
  const typeQuery = filterKey === "lost" ? undefined : filterKey;
  const user = firstParam(params, "user") || undefined;
  const page = pageParam(params);

  const [events, filterOptions] = await authed((token) =>
    Promise.all([
      withFilterValidation(() =>
        followersService.events(token, {
          type,
          username: user,
          page,
          limit: 25,
        }),
      ),
      followersService.eventFilterOptions(token, { type }),
    ]),
  );

  return (
    <>
      <PageHeader
        title="Histórico"
        description="Cada mudança detectada entre duas listas de seguidores."
      />

      <FilterTransition>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="overflow-x-auto">
            <SegmentedNav
              label="Filtrar eventos"
              items={FILTERS.map((filter) => ({
                label: filter.label,
                // Switching the event type resets the follower filter.
                href: buildHref(PATH, {
                  type: filter.key === "lost" ? undefined : filter.key,
                }),
                active: filterKey === filter.key,
              }))}
            />
          </div>
          <FollowerFilterCombobox
            initialOptions={filterOptions}
            scope={{ scope: "events", type }}
            value={user}
            path={PATH}
            query={{ type: typeQuery }}
          />
        </div>

        {!events.ok ? (
          <InvalidFilterAlert
            message={events.message}
            clearHref={buildHref(PATH, { type: typeQuery })}
          />
        ) : (
          <Card>
            {events.data.items.length > 0 ? (
              <>
                <FollowerEventList
                  events={events.data.items}
                  showType={filterKey === "all"}
                />
                <Pagination
                  page={events.data.page}
                  totalPages={events.data.totalPages}
                  total={events.data.total}
                  hrefFor={(target) =>
                    buildHref(PATH, { type: typeQuery, user, page: target })
                  }
                />
              </>
            ) : (
              <EmptyState
                icon={<History className="size-5" />}
                title={
                  type
                    ? `Nenhum evento "${EVENT_LABEL[type].label.toLowerCase()}"`
                    : "Nenhum evento ainda"
                }
                description="Os eventos aparecem a partir da segunda sincronização completa."
              />
            )}
          </Card>
        )}
      </FilterTransition>
    </>
  );
}
