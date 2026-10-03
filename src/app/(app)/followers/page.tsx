import type { Metadata } from "next";
import { Users } from "lucide-react";
import {
  Card,
  EmptyState,
  PageHeader,
  Pagination,
  SegmentedNav,
} from "@/design-system";
import { FilterTransition } from "@/features/followers/components/FilterTransition";
import { FollowerFilterCombobox } from "@/features/followers/components/FollowerFilterCombobox";
import { FollowerList } from "@/features/followers/components/FollowerList";
import { InvalidFilterAlert } from "@/features/followers/components/InvalidFilterAlert";
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

export const metadata: Metadata = { title: "Seguidores" };

const PATH = "/followers";

export default async function FollowersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const status =
    oneOf(firstParam(params, "status"), ["active", "lost"] as const) ??
    "active";
  const statusQuery = status === "active" ? undefined : status;
  const user = firstParam(params, "user") || undefined;
  const page = pageParam(params);

  const [list, overview, filterOptions] = await authed((token) =>
    Promise.all([
      withFilterValidation(() =>
        followersService.list(token, {
          status,
          username: user,
          page,
          limit: 30,
        }),
      ),
      followersService.overview(token),
      followersService.filterOptions(token, { status }),
    ]),
  );

  return (
    <>
      <PageHeader
        title="Seguidores"
        description="Todas as contas que seguem ou já seguiram você."
      />

      <FilterTransition>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SegmentedNav
            label="Filtrar por status"
            items={[
              {
                label: "Ativos",
                // Switching the status resets the follower filter.
                href: buildHref(PATH, {}),
                active: status === "active",
                count: overview.activeFollowers,
              },
              {
                label: "Perdidos",
                href: buildHref(PATH, { status: "lost" }),
                active: status === "lost",
                count: overview.lostFollowersTotal,
              },
            ]}
          />
          <FollowerFilterCombobox
            initialOptions={filterOptions}
            scope={{ scope: "followers", status }}
            value={user}
            path={PATH}
            query={{ status: statusQuery }}
          />
        </div>

        {!list.ok ? (
          <InvalidFilterAlert
            message={list.message}
            clearHref={buildHref(PATH, { status: statusQuery })}
          />
        ) : (
          <Card>
            {list.data.items.length > 0 ? (
              <>
                <FollowerList followers={list.data.items} />
                <Pagination
                  page={list.data.page}
                  totalPages={list.data.totalPages}
                  total={list.data.total}
                  hrefFor={(target) =>
                    buildHref(PATH, { status: statusQuery, user, page: target })
                  }
                />
              </>
            ) : (
              <EmptyState
                icon={<Users className="size-5" />}
                title="Nenhum seguidor por aqui"
                description={
                  status === "lost"
                    ? "Ninguém deixou de seguir você até agora."
                    : "Rode uma sincronização para carregar a lista."
                }
              />
            )}
          </Card>
        )}
      </FilterTransition>
    </>
  );
}
